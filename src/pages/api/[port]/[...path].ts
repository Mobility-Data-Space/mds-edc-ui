import type { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "node:stream";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method?.toLowerCase() === "head") {
    return res.status(200).end();
  }

  const proxy = await fetch(
    `http://localhost:${req.query.port}${
      req.url?.replace(`/api/${req.query.port}/`, "/")
    }`,
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
