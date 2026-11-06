const MASK = "••••••••";

// Lower-cased last segment of a key, so plain, prefixed (`edc:secret`) and
// expanded (`https://w3id.org/edc/v0.0.1/ns/secret`) forms all match.
const SENSITIVE_FIELDS = new Set([
  "accesskeyid",
  "authcode",
  "authorization",
  "clientsecret",
  "endpoint",
  "kafkaconsumerproperties",
  "password",
  "secret",
  "secretaccesskey",
  "secretkey",
  "secretname",
  "sharedkey",
  "token",
  "tokenendpoint",
]);

const isSensitiveKey = (key: string): boolean =>
  SENSITIVE_FIELDS.has(key.split(/[/:#]/).pop()!.toLowerCase());

export const maskSensitiveData = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(maskSensitiveData);
  }
  if (!value || typeof value !== "object") {
    return value;
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      isSensitiveKey(key) ? MASK : maskSensitiveData(item),
    ]),
  );
};

export const containsSensitiveData = (value: unknown): boolean => {
  if (Array.isArray(value)) {
    return value.some(containsSensitiveData);
  }
  if (!value || typeof value !== "object") {
    return false;
  }
  return Object.entries(value).some(
    ([key, item]) => isSensitiveKey(key) || containsSensitiveData(item),
  );
};
