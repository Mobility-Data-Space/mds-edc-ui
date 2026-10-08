import {
  DSPACE_CONTEXT_URL,
  DSPACE_ODRL_PROFILE_CONTEXT_URL,
  EDC_DSPACE_CONTEXT_URL,
  EDC_MANAGEMENT_V2_CONTEXT_URL,
  MDS_MANAGEMENT_V1_CONTEXT_URL,
} from "@/jsonld/context";
import mdsManagementV1Context from "@/jsonld/mds-management-v1.json" with { type: "json" };
import edcManagementV2Context from "@/jsonld/edc-management-v2.json" with { type: "json" };
import dspaceOdrlProfileContext from "@/jsonld/dspace-odrl-profile-v2025-1.json" with { type: "json" };
import dspaceContext from "@/jsonld/dspace-context-v2025-1.json" with { type: "json" };
import edcDspaceContext from "@/jsonld/edc-dspace-v0.0.1.json" with { type: "json" };

// JSON-LD contexts the management client must expand offline. The bundled
// `jsonld` loader cannot dereference these w3id.org URLs (in Node its HTTP
// loader is incompatible with the pinned undici; in the browser the same-origin
// policy blocks them), so we hand the client local copies. Management v4
// responses reference the MDS context (which transitively imports the EDC
// management context and the DSP ODRL profile); dataspace protocol responses
// such as catalogs reference the DSP contexts.
const CACHED_JSONLD_CONTEXTS: Record<string, object> = {
  [MDS_MANAGEMENT_V1_CONTEXT_URL]: mdsManagementV1Context,
  [EDC_MANAGEMENT_V2_CONTEXT_URL]: edcManagementV2Context,
  [DSPACE_ODRL_PROFILE_CONTEXT_URL]: dspaceOdrlProfileContext,
  [DSPACE_CONTEXT_URL]: dspaceContext,
  [EDC_DSPACE_CONTEXT_URL]: edcDspaceContext,
};

interface ManagementBuilder<B> {
  managementApiVersion(version: string): B;
  managementJsonLdContext(contextUrl: string): B;
  cachedJsonLdContext(url: string, context: object): B;
}

// Configure an `EdcConnectorClient.Builder` to talk the MDS management API:
// target v4, declare the MDS JSON-LD context on request bodies (so MDS short
// terms such as `REFERRING_CONNECTOR` expand to their IRIs connector-side), and
// cache the contexts responses reference so the client can expand them offline.
// Typed structurally so this stays decoupled from the client's builder type.
export function withMdsManagementConfig<B extends ManagementBuilder<B>>(
  builder: B,
): B {
  const configured = builder
    .managementApiVersion("v4")
    .managementJsonLdContext(MDS_MANAGEMENT_V1_CONTEXT_URL);

  return Object.entries(CACHED_JSONLD_CONTEXTS).reduce(
    (acc, [url, context]) => acc.cachedJsonLdContext(url, context),
    configured,
  );
}
