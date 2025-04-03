import type { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "node:stream";
import {removeProxyPrefix} from "@/hooks/use-connector-dashboard-state.ts";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const url = removeProxyPrefix(req.url);

  if (req.method?.toLowerCase() === "head") {
    return res.status(200).end();
  }

  const proxy = await fetch(
    url,
    {
      method: req.method,
      // headers: req.headers as any,
      headers: {
        "content-type": "application/json",
      },
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
