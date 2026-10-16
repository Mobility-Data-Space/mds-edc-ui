// Contract agreements are served on v4 (issue #716). The enriched agreements
// query and the retirements passthrough live in the shared handler, which the
// v3 route (kept for the dashboard count hook) re-exports as well.
export { GET, POST, DELETE, PUT, HEAD } from "@/server/contract-agreement-proxy";
