import { Participant } from "@/constants/dataspace";
import { useRouter } from "next/router";
import {participantConfig, readEnvironment} from "@/utilities/env.ts";
import {useEffect, useState} from "react";

type ParticipantConnectorState = {
  connector: Participant;
  push: (href: string) => void;
};

const connector = await readEnvironment();

export function useParticipantConnectorState(): ParticipantConnectorState {
  const router = useRouter();

  return {
    connector,
    push: (href: string) => router.push(`${href}`),
  } as any;
}
