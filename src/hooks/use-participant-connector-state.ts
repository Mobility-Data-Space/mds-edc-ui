import { Participant } from "@/constants/dataspace";
import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import {readEnvironment} from "@/utilities/env.ts";

type ParticipantConnectorState = {
  connector: Participant;
  push: (href: string) => void;
};

const connectorConfig = await readEnvironment();

export function useParticipantConnectorState(): ParticipantConnectorState {
  const router = useRouter();

  return {
    connector: connectorConfig,
    push: (href: string) => router.push(`${href}`),
  } as any;
}
