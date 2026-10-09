import "server-only";

import { Resolver, parse } from "did-resolver";
import { lookup } from "node:dns/promises";
import { BlockList, isIP } from "node:net";
import { getResolver, webParser } from "web-did-resolver";

// DSP "Discovery of Service Endpoints": a DataService entry points at the
// connector's version metadata endpoint, from which the protocol address is derived.
const DATA_SERVICE_TYPE = "DataService";
const VERSION_METADATA_SUFFIX = "/.well-known/dspace-version";

const TIMEOUT_MS = 5_000;

const resolver = new Resolver(getResolver());

export type DiscoveredConnector = {
  id: string;
  serviceEndpoint: string;
  protocolAddress: string;
};

export class DidDiscoveryError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

// The DID document is fetched from a caller-supplied host, so only public
// addresses are allowed unless explicitly enabled.
const privateRanges = new BlockList();
for (const [network, prefix] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.168.0.0", 16],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
] as const) {
  privateRanges.addSubnet(network, prefix, "ipv4");
}
for (const [network, prefix] of [
  ["::", 128],
  ["::1", 128],
  ["fc00::", 7],
  ["fe80::", 10],
  ["ff00::", 8],
] as const) {
  privateRanges.addSubnet(network, prefix, "ipv6");
}

function isPrivateAddress(address: string): boolean {
  const mapped = address.toLowerCase().startsWith("::ffff:") ? address.slice(7) : address;
  if (isIP(mapped) === 4) {
    return privateRanges.check(mapped, "ipv4");
  }
  if (isIP(address) === 6) {
    return privateRanges.check(address, "ipv6");
  }
  return true;
}

async function assertPublicHost(didWebId: string): Promise<void> {
  if (process.env.DID_RESOLUTION_ALLOW_PRIVATE_NETWORKS === "true") {
    return;
  }
  const authority = decodeURIComponent(didWebId.split(":")[0]);
  const hostname = authority.startsWith("[")
    ? authority.slice(1, authority.indexOf("]"))
    : authority.replace(/:\d+$/, "");

  let addresses: { address: string }[];
  try {
    addresses = isIP(hostname) ? [{ address: hostname }] : await lookup(hostname, { all: true });
  } catch {
    throw new DidDiscoveryError("DID document could not be fetched", 502);
  }
  if (addresses.some((entry) => isPrivateAddress(entry.address))) {
    throw new DidDiscoveryError("DID host is not a public address", 400);
  }
}

function withTimeout<T>(promise: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new DidDiscoveryError("DID document request timed out", 504)), TIMEOUT_MS);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

/**
 * Resolves a did:web DID and returns the connectors it advertises as
 * DataService entries.
 */
export async function discoverConnectors(did: string): Promise<DiscoveredConnector[]> {
  const parsed = parse(did);
  if (!parsed) {
    throw new DidDiscoveryError("Malformed DID", 400);
  }
  if (parsed.method !== "web") {
    throw new DidDiscoveryError("Only did:web identifiers are supported", 400);
  }
  // webParser accepts an encoded path in the host segment as long as the URL
  // normalizes it away (e.g. "%2F..%2F"), so reject those explicitly.
  if (!webParser(parsed) || /[/?#@\\]/.test(decodeURIComponent(parsed.id.split(":")[0]))) {
    throw new DidDiscoveryError("Malformed did:web identifier", 400);
  }

  // web-did-resolver fetches with the global fetch, so the host is checked first.
  await withTimeout(assertPublicHost(parsed.id));
  const { didDocument, didResolutionMetadata } = await withTimeout(resolver.resolve(did));

  if (didResolutionMetadata.error || !didDocument) {
    throw new DidDiscoveryError("DID document could not be fetched", 502);
  }

  return (didDocument.service ?? []).flatMap((service) => {
    const endpoint = service.serviceEndpoint;
    if (
      service.type !== DATA_SERVICE_TYPE ||
      typeof endpoint !== "string" ||
      !/^https?:\/\//.test(endpoint) ||
      !endpoint.endsWith(VERSION_METADATA_SUFFIX)
    ) {
      return [];
    }
    return [{
      id: service.id,
      serviceEndpoint: endpoint,
      protocolAddress: endpoint.slice(0, -VERSION_METADATA_SUFFIX.length),
    }];
  });
}
