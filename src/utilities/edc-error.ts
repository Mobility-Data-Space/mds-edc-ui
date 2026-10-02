// EDC client errors embed the connector's JSON response in `message`; pull out its first "message" field.
export const extractEdcErrorMessage = (error: unknown): string | undefined => {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /"message":"(.*?)"/.exec(message)?.[1];
};
