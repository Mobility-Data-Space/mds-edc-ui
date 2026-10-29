// Data flows are served on v4 by the (embedded) data plane since mds-edc 2.7.0
// (DataFlow API, replaces the removed EDR cache endpoints).
//
// Two shapes pass through here:
//   POST /v4/dataflows/request        -> list of data flows. The connector serializes
//                                        source/destination as data addresses that surface
//                                        vault key *aliases* only, never resolved secrets.
//   GET  /v4/dataflows/{id}/dataaddress -> the *resolved* data address, secret included.
//                                        It is returned on explicit demand and masked in the
//                                        browser (see data-flow-table-row.tsx), mirroring how
//                                        the old EDR data address was shown.
//
// An explicit handler (rather than the generic management catch-all) keeps the per-entity v4
// pattern used for contractagreements/contractdefinitions/transferprocesses and gives us a
// single place to tighten sanitization later if the upstream contract changes.
import { proxyGet, proxyPost } from "@/server/proxy";

export const GET = proxyGet;
export const POST = proxyPost;
