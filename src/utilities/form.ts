export const removeEmptyFields = <T extends object>(source: T): T => {
  const object = source as Record<string, unknown>;
  const newFormData: Record<string, unknown> = {};
  for (const key in object) {
    if (typeof object[key] === "boolean") {
      newFormData[key] = "" + object[key];
      continue;
    }

    if (Array.isArray(object[key])) {
      if ((object[key] as unknown[]).length > 0) {
        newFormData[key] = object[key];
      }
      continue;
    }

    if (typeof object[key] === "object") {
      newFormData[key] = removeEmptyFields(object[key] as object);
      continue;
    }

    if (object[key]) {
      newFormData[key] = object[key];
      continue;
    }
  }

  return newFormData as T;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  Object.getPrototypeOf(value) === Object.prototype;

/**
 * Recursively drops empty arrays and empty plain objects (including objects
 * that only become empty once their own empty members are dropped).
 *
 * The connector's semantic validator (MDS EDC >= 2.8.0) rejects empty arrays
 * for optional list properties ("must have at least 1 items"), so blank
 * optional form fields must be omitted rather than sent as `[]` / `{}`.
 */
export const removeEmptyCollections = <T>(value: T): T => {
  if (Array.isArray(value)) {
    return value
      .map(removeEmptyCollections)
      .filter((item) => !isEmptyCollection(item)) as T;
  }

  if (isPlainObject(value)) {
    const result: Record<string, unknown> = {};
    for (const [key, member] of Object.entries(value)) {
      const cleaned = removeEmptyCollections(member);
      if (!isEmptyCollection(cleaned)) {
        result[key] = cleaned;
      }
    }
    return result as T;
  }

  return value;
};

const isEmptyCollection = (value: unknown) =>
  (Array.isArray(value) && value.length === 0) ||
  (isPlainObject(value) && Object.keys(value).length === 0);
