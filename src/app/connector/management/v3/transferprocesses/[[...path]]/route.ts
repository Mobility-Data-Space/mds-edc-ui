// The dashboard transfer-process widget still reads on v3; the v4 rollout
// (issue #666) serves the sanitized passthrough from the shared handler.
export { GET, POST, DELETE, PUT, HEAD } from "@/server/transfer-process-proxy";
