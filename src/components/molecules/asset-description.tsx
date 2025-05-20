import React from "react";
import {T} from "@/i18n";
import {Input} from "../atoms/input.tsx";
import {
  ASSET_DESCRIPTION,
  AssetProperties,
} from "@/schema/asset.ts";
import {FormHelperText, Link} from "@mui/material";

export interface AssetDescriptionProps {
  translator: (key: string) => string;
  formData: AssetProperties;
  onChange: (formData: AssetProperties) => void;
  errors: { [key: string]: boolean };
  required?: boolean;
}

export function AssetDescription({ translator, formData, onChange, errors }: AssetDescriptionProps): JSX.Element {

  return (<>
    <Input
      name={ASSET_DESCRIPTION}
      id="properties-description"
      placeholder={translator("assets.new.fieldDescriptionPlaceholder")}
      multiline
      rows={6}
      label={<T string="assets.new.fieldDescription" />}
      value={formData[ASSET_DESCRIPTION]}
      error={errors[ASSET_DESCRIPTION]}
      onChange={(event) => onChange({ ...formData, [ASSET_DESCRIPTION]: event.target.value })}
    />
    <FormHelperText className="flex flex-row gap-x-1">
      <T string="assets.new.fieldDescriptionSupport"/>
      <Link href="https://www.markdownguide.org/basic-syntax" target="_blank" color="secondary" >
        Markdown syntax
      </Link>
    </FormHelperText>
  </>);
}
