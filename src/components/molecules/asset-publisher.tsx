import React from "react";

import { Input } from "@/components/atoms/input";

import { T } from "@/i18n";
import { ASSET_PUBLISHER } from "@/jsonld/asset";
import { AssetProperties } from "@/utilities/asset";

export interface AssetPublisherProps {
  translator: (key: string) => string;
  formData: AssetProperties;
  onChange: (formData: AssetProperties) => void;
  errors: { [key: string]: boolean };
  required?: boolean;
}

export function AssetPublisher({ translator, formData, onChange, errors }: AssetPublisherProps): React.ReactElement {

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
