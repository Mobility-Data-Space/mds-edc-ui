// Transfer processes are served on v4 (issue #716). The sanitized passthrough
// (the data destination can hold credentials, so it never reaches the browser)
// lives in the shared handler, which the v3 route re-exports as well.
export { GET, POST, DELETE, PUT, HEAD } from "@/server/transfer-process-proxy";
