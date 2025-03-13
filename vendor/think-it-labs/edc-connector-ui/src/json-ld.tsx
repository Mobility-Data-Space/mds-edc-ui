import { JsonLdObject } from "@think-it-labs/edc-connector-client";
import React from "react";
import { useJsonLdContext } from "./json-ld-context-provider";

export interface ValueProps {
  object: JsonLdObject | undefined;
  prefix?: string;
  name: string;
  optional?: boolean;
  parent?: string;
  children?: (value: any) => JSX.Element;
}

function getValue(
  object: JsonLdObject,
  prefix: string,
  name: string,
  additionalContext: Record<string, string> = {},
  optional = false,
  parent?: string,
) {
  const pref = additionalContext[prefix];
  if (parent !== undefined) {
    const obj = object.mandatoryValue(
      prefix,
      parent,
    ) || object[`${pref}${parent}`]?.at(0);

    if (!obj) {
      return null;
    }

    try {
      return getValue(
        obj,
        prefix,
        name,
        additionalContext,
        optional,
      );
    } catch {
      return getValue(
        obj,
        prefix,
        name,
        additionalContext,
        optional,
      );
    }
  }

  try {
    return object?.[!optional ? "mandatoryValue" : "optionalValue"](
      prefix,
      name,
    );
  } catch {
    return object?.[`${pref}${name}`]?.at(0)?.["@value"];
  }
}

export function JsonLdValue(
  { object, prefix = "edc", name, optional, parent, children }: ValueProps,
) {
  const additionalContext = useJsonLdContext();

  if (!object) {
    return null;
  }

  const value = getValue(
    object,
    prefix,
    name,
    additionalContext,
    optional,
    parent,
  );

  if (children) {
    return children(value);
  }

  return <>{value}</>;
}
