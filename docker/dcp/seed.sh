#!/bin/sh
# One-shot DCP provisioning: issuer setup, holder registration, wallet participant
# contexts, connector STS secrets in Vault, MembershipCredential issuance.
# Request bodies are templates in ./requests, rendered with the exported variables below.
# Not idempotent: wallets return the STS client secret only once. Run on a fresh stack.
set -eu

apk add --no-cache curl jq gettext-envsubst >/dev/null

REQUESTS="$(dirname "$0")/requests"

export ISSUER_API="${ISSUER_API_VERSION:-v1}"
export ISSUER_DID="did:web:issuer%3A7085"
# Participant context ids are plain names, not DIDs: a port-bearing DID (did:web:host%3Aport)
# URL-encodes to '%253A', which Jetty rejects as an ambiguous path encoding.
export ISSUER_CTX="issuer"
ISSUER_KEY="c3VwZXItdXNlcg==.e2e-issuer-key"
WALLET_KEY="c3VwZXItdXNlcg==.e2e-wallet-key"
VAULT="http://vault:8200"

# "<context id = connector vault folder> <wallet host> <did> <sts secret alias>"
# The alias must not contain ':' or '%' (the connector double-encodes it on lookup).
PARTICIPANTS="
edc-1 wallet-1 did:web:wallet-1%3A7083:edc-1 wallet-1-7083-edc-1-sts-client-secret
edc-2 wallet-2 did:web:wallet-2%3A7083:edc-2 wallet-2-7083-edc-2-sts-client-secret
"

# render <template> -> request body; fails on an unset placeholder or invalid JSON.
render() {
  for var in $(grep -o '\${[A-Z_]*}' "$REQUESTS/$1" | tr -d '${}' | sort -u); do
    eval "[ -n \"\${$var+x}\" ]" || { echo "  FAIL: \$$var not set for $1" >&2; exit 1; }
  done
  envsubst < "$REQUESTS/$1" | jq -c .
}

# post <url> <api-key> <template> <description> -> response body on stdout; fails on non-2xx.
post() {
  body=$(render "$3")
  code=$(curl -sS -o /tmp/resp -w '%{http_code}' -X POST "$1" \
    -H "x-api-key: $2" -H 'content-type: application/json' -d "$body")
  case "$code" in
    2*) echo "  ok ($code): $4" >&2; cat /tmp/resp ;;
    409) echo "  FAIL ($code): $4 already exists. Stack is not fresh: run 'docker compose -f docker-compose.dcp.yml down' first." >&2; exit 1 ;;
    *) echo "  FAIL ($code): $4" >&2; cat /tmp/resp >&2; exit 1 ;;
  esac
}

echo "Issuer ($ISSUER_API): participant context, attestation, credential definition"
post "http://issuer:7081/api/identity/$ISSUER_API/participants" "$ISSUER_KEY" issuer-participant.json "issuer participant context" >/dev/null
post "http://issuer:7083/api/admin/$ISSUER_API/participants/$ISSUER_CTX/attestations" "$ISSUER_KEY" attestation.json "attestation" >/dev/null
post "http://issuer:7083/api/admin/$ISSUER_API/participants/$ISSUER_CTX/credentialdefinitions" "$ISSUER_KEY" credential-definition.json "credential definition" >/dev/null

# The loop runs in a subshell (pipe); any `exit 1` fails the pipeline and `set -e` stops the script.
echo "$PARTICIPANTS" | while read -r CTX WALLET DID alias; do
  [ -z "$CTX" ] && continue
  export CTX WALLET DID
  echo "Participant $CTX ($DID)"

  post "http://issuer:7083/api/admin/$ISSUER_API/participants/$ISSUER_CTX/holders" "$ISSUER_KEY" holder.json "issuer holder" >/dev/null

  CLIENT_SECRET=$(post "http://$WALLET:7081/api/identity/v1beta/participants" "$WALLET_KEY" wallet-participant.json "wallet participant context" | jq -er .clientSecret)
  export CLIENT_SECRET
  curl -fsS -X POST -H "X-Vault-Token: root" -H 'content-type: application/json' \
    "$VAULT/v1/secret/data/$CTX/$alias" -d "$(render vault-secret.json)" >/dev/null
  echo "  ok: STS client secret stored at secret/$CTX/$alias"

  export HOLDER_PID="$CTX-membership"
  post "http://$WALLET:7081/api/identity/v1beta/participants/$CTX/credentials/request" "$WALLET_KEY" credential-request.json "credential request" >/dev/null

  status=""
  for _ in $(seq 1 60); do
    status=$(curl -sS -H "x-api-key: $WALLET_KEY" \
      "http://$WALLET:7081/api/identity/v1beta/participants/$CTX/credentials/request/$HOLDER_PID" | jq -r '.status // empty')
    [ "$status" = "ISSUED" ] && break
    sleep 2
  done
  if [ "$status" != "ISSUED" ]; then
    echo "  FAIL: MembershipCredential for $DID not issued after 120s (last status: ${status:-none})." >&2
    echo "  Check the wallet DID doc has a CredentialService entry, and issuer/wallet logs." >&2
    echo "  If the issuer rejects the wallet's request, retry with MDS_ISSUER_TAG=0.3.0 ISSUER_API_VERSION=v1beta." >&2
    exit 1
  fi
  echo "  ok: MembershipCredential ISSUED"
done

echo "DCP seed complete."
