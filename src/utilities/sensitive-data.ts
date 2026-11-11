const MASK = "••••••••";

// A data address is sensitive as a whole. Keys match on their lower-cased last
// segment, so plain, prefixed (`edc:dataAddress`) and expanded forms all count.
const DATA_ADDRESS_KEYS = new Set([
  "dataaddress",
  "datadestination",
  "dataplanemetadata",
  "destination",
  "source",
]);

const isSensitiveKey = (key: string): boolean =>
  DATA_ADDRESS_KEYS.has(key.split(/[/:#]/).pop()!.toLowerCase());

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
