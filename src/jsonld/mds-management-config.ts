import { EdcConnectorClient } from "@think-it-labs/edc-connector-client";
import mdsManagementV1 from "./mds-management-v1.json" with { type: "json" };
import edcManagementV2 from "./edc-management-v2.json" with { type: "json" };
import dspaceContextV2025_1 from "./dspace-context-v2025-1.json" with { type: "json" };
import dspaceOdrlProfileV2025_1 from "./dspace-odrl-profile-v2025-1.json" with { type: "json" };
import edcDspaceV0_0_1 from "./edc-dspace-v0.0.1.json" with { type: "json" };

/**
 * Published MDS management JSON-LD context. v4 management responses reference
 * this alongside the EDC management v2 context, and request bodies need it so
 * MDS short terms (e.g. the policy `REFERRING_CONNECTOR` left operand) map.
 */
export const MDS_MANAGEMENT_V1_URL =
  "https://w3id.org/mobility-dataspace/connector/management/v1";

/**
 * The transitive set of JSON-LD `@context` documents the connector references,
 * bundled so the client's `jsonld` loader resolves them **offline**.
 *
 * Client 0.10.x cannot dereference these w3id URLs at runtime — the pinned
 * `undici` breaks jsonld's HTTP loader (redirect / Link-header / CORS), so
 * without these cached entries reads/writes throw `Dereferencing a URL did not
 * result in a valid JSON-LD object`.
 */
const CACHED_JSONLD_CONTEXTS: ReadonlyArray<readonly [string, object]> = [
  [MDS_MANAGEMENT_V1_URL, mdsManagementV1],
  ["https://w3id.org/edc/connector/management/v2", edcManagementV2],
  ["https://w3id.org/dspace/2025/1/context.jsonld", dspaceContextV2025_1],
  ["https://w3id.org/dspace/2025/1/odrl-profile.jsonld", dspaceOdrlProfileV2025_1],
  ["https://w3id.org/edc/dspace/v0.0.1", edcDspaceV0_0_1],
];

type EdcClientBuilder = InstanceType<typeof EdcConnectorClient.Builder>;

/**
 * Applies the MDS-specific configuration needed to talk to the EDC management
 * API **v4**: the v4 path segment, the MDS JSON-LD context, and the cached
 * contexts.
 *
 * Shared by the server client ({@link ../server/edc-client}), the browser
 * client factory ({@link ../utilities/edc-client-factory}) and the e2e seed so
 * they all agree on how a client is built.
 */
export function withMdsManagementConfig<B extends EdcClientBuilder>(
  builder: B,
): B {
  return CACHED_JSONLD_CONTEXTS.reduce(
    (b, [url, context]) => b.cachedJsonLdContext(url, context),
    builder,
  )
    .managementApiVersion("v4")
    .managementJsonLdContext(MDS_MANAGEMENT_V1_URL) as B;
}
