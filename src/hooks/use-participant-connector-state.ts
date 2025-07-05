import { Participant } from "@/constants/dataspace";
import { useRouter } from "next/router";
import { participantConfig } from "@/utilities/env.ts";

type ParticipantConnectorState = {
  connector: Participant;
  push: (href: string) => void;
};

export function useParticipantConnectorState(): ParticipantConnectorState {
  const router = useRouter();

  return {
    connector: participantConfig()!,
    push: (href: string) => router.push(`${href}`),
  } as any;
}
