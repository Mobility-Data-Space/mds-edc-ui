import type { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "node:stream";
import {connectorApiKey, managementPrefix, participantConfig} from "@/utilities/env.ts";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { connectorManagementUrl } = participantConfig();
  const url = (req.url || "").replace(managementPrefix, connectorManagementUrl);

  if (req.method?.toLowerCase() === "head") {
    return res.status(200).end();
  }

  const proxy = await fetch(
    url,
    {
      method: req.method,
      headers: {
        "content-type": "application/json",
        "x-api-key": connectorApiKey(),
      },
      credentials: "same-origin",
      body: !["get"].includes(req.method?.toLowerCase() || "") && req.body
        ? JSON.stringify(req.body)
        : undefined,
    },
  );

  const contentType = proxy.headers.get("content-type");
  if (contentType) {
    res.setHeader("content-type", contentType);
  }

  res.status(proxy.status);
  if (req.method?.toLowerCase() === "delete") {
    res.end();
  } else {
    Readable.fromWeb(proxy.body as any).pipe(res);
  }
}
