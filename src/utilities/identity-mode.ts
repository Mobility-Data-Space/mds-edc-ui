export type IdentityMode = "dcp" | "daps";

/**
 * Resolves whether a connector uses DCP or DAPS.
 *
 * The explicit setting (EDC_IDENTITY_MODE) wins.
 * Without it the mode is inferred from the participant id: a DCP connector's participant id is
 * its DID, a DAPS connector's is its MDS id.
 */
export function resolveIdentityMode(
  explicit: string | undefined,
  participantId: string,
): IdentityMode {
  if (explicit === "dcp" || explicit === "daps") return explicit;
  if (explicit) {
    console.warn(
      `[identity-mode] Ignoring unknown identity mode "${explicit}", inferring from the participant id`,
    );
  }
  return participantId.startsWith("did:") ? "dcp" : "daps";
}
