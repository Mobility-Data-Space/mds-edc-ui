#!/bin/sh
# Seeds the transfer-proxy token signer keypair for each connector's Vault folder.
set -eu

apk add --no-cache openssl >/dev/null

for folder in edc-1 edc-2; do
  openssl genpkey -algorithm RSA -out /tmp/key.pem 2>/dev/null
  openssl req -new -x509 -key /tmp/key.pem -out /tmp/cert.pem -days 365 -subj "/CN=${folder}-transfer-proxy" 2>/dev/null
  vault kv put "secret/${folder}/transfer-proxy-token-signer-private-key" content=@/tmp/key.pem
  vault kv put "secret/${folder}/transfer-proxy-token-signer-public-key" content=@/tmp/cert.pem
done

echo "Vault initialized."
