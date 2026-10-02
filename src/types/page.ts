import type { NextPage } from "next";

// Pages declare their header title as a translation key; _app renders the shared layout around them.
export type TitledPage = NextPage & { titleKey?: string };
