import { CONTEXT_EDC } from "@/jsonld/context";
import { DataFlow, DataFlowDirection } from "@/domain/data-flow/model";

const EDC = CONTEXT_EDC.value;

type Node = Record<string, unknown> & { "@id"?: string };

// The connector serves data flows as *compacted* JSON-LD (management context applied),
// so a field is a plain scalar under its short term (e.g. `state: "STARTED"`). This reads
// that, while still tolerating the expanded form (`[{ "@value": ... }]`) and prefixed keys,
// so the mapper survives a context change.
const read = (node: Node, term: string): unknown => {
  const raw = node[term] ?? node[`edc:${term}`] ?? node[`${EDC}${term}`];
  if (raw == null) return undefined;
  const first = Array.isArray(raw) ? raw[0] : raw;
  if (first != null && typeof first === "object") {
    const obj = first as Record<string, unknown>;
    return obj["@value"] ?? obj["@id"];
  }
  return first;
};

const readString = (node: Node, term: string): string | undefined => {
  const value = read(node, term);
  return value == null ? undefined : String(value);
};

const readNumber = (node: Node, term: string): number | undefined => {
  const value = read(node, term);
  if (value == null) return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
};

const directionOf = (transferType?: string): DataFlowDirection => {
  if (!transferType) return "UNKNOWN";
  if (transferType.endsWith("-PULL")) return "PULL";
  if (transferType.endsWith("-PUSH")) return "PUSH";
  return "UNKNOWN";
};

/** Maps one JSON-LD data flow node (from POST /v4/dataflows/request) into a typed {@link DataFlow}. */
export const toDataFlow = (node: Node): DataFlow => {
  const transferType = readString(node, "transferType");

  return {
    id: node["@id"] ?? "",
    state: readString(node, "state") ?? "UNKNOWN",
    stateTimestamp: readNumber(node, "stateTimestamp"),
    createdAt: readNumber(node, "createdAt"),
    updatedAt: readNumber(node, "updatedAt"),
    assetId: readString(node, "assetId"),
    agreementId: readString(node, "agreementId"),
    participantId: readString(node, "participantId"),
    transferType,
    direction: directionOf(transferType),
    runtimeId: readString(node, "runtimeId"),
    errorDetail: readString(node, "errorDetail"),
    raw: node,
  };
};

export const toDataFlows = (payload: unknown): DataFlow[] => {
  if (!Array.isArray(payload)) return [];
  return payload
    .filter((n): n is Node => !!n && typeof n === "object")
    .map(toDataFlow);
};
