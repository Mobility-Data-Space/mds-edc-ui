// Expanded JSON-LD stores each property as an array of nodes; these read the first node safely.
type JsonLdNode = { "@value"?: unknown; "@id"?: unknown };

const firstNode = (property: unknown): JsonLdNode | undefined => {
  const node = Array.isArray(property) ? property[0] : undefined;
  return node && typeof node === "object" ? (node as JsonLdNode) : undefined;
};

export const getLiteral = (property: unknown): string | undefined => {
  const value = firstNode(property)?.["@value"];
  return typeof value === "string" ? value : undefined;
};

export const getId = (property: unknown): string | undefined => {
  const id = firstNode(property)?.["@id"];
  return typeof id === "string" ? id : undefined;
};
