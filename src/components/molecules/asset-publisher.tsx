import React from "react";
import {T} from "@/i18n";
import {Input} from "../atoms/input.tsx";
import {
  ASSET_PUBLISHER,
  AssetProperties
} from "@/schema/asset.ts";

export interface AssetPublisherProps {
  translator: (key: string) => string;
  formData: AssetProperties;
  onChange: (formData: AssetProperties) => void;
  errors: { [key: string]: boolean };
  required?: boolean;
}

export function AssetPublisher({ translator, formData, onChange, errors }: AssetPublisherProps): JSX.Element {

  return (
    <Input
      name={ASSET_PUBLISHER}
      id="properties-publisher"
      type="text"
      label={<T string="assets.new.fieldPublisher" />}
      placeholder={"https://"}
      tooltip={translator("assets.new.fieldPublisherTooltip")}
      value={formData[ASSET_PUBLISHER]}
      error={errors[ASSET_PUBLISHER]}
      onChange={(event) => onChange({ ...formData, [ASSET_PUBLISHER]: event.target.value })}
    />
  );
}
