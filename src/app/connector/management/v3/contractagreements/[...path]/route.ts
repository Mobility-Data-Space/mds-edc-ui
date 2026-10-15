// The dashboard entity-count hook still reads agreements on v3; the v4 rollout
// (issue #666) serves the enriched agreements query from the shared handler.
export { GET, POST, DELETE, PUT, HEAD } from "@/server/contract-agreement-proxy";
