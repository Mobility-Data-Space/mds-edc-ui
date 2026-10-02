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
