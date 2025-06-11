import {NextApiRequest, NextApiResponse} from "next";
import {participantConfig} from "@/utilities/env.ts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(400).json({message: "Bad Request"});
  }

  res.setHeader("Allow", ["GET"]);

  res.json(participantConfig());
}
