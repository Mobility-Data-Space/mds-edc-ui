import React from "react";
import {FormHelperText, Link} from "@mui/material";

import {Input} from "../atoms/input";

import {T} from "@/i18n";
import {ASSET_CONTENT_TYPE} from "@/schema/asset";
import {AssetProperties} from "@/utilities/asset";

export interface AssetContentTypeProps {
  formData: AssetProperties;
  onChange: (formData: AssetProperties) => void;
  errors: { [key: string]: boolean };
  required?: boolean;
}

export function AssetContentType({ formData, onChange, errors }: AssetContentTypeProps): JSX.Element {

  return (<>
    <Input
      name={ASSET_CONTENT_TYPE}
      id="properties-contenttype"
      label={<T string="assets.new.fieldContentType"/>}
      placeholder="text/plain"
      value={formData[ASSET_CONTENT_TYPE]}
      error={errors[ASSET_CONTENT_TYPE]}
      onChange={(event) => onChange({ ...formData, [ASSET_CONTENT_TYPE]: event.target.value })}
    />
    <FormHelperText className="flex flex-row gap-x-1">
      <T string="assets.new.fieldContentTypeSupport"/>
      <Link href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types" target="_blank" color="secondary" >
        common types
      </Link>
    </FormHelperText>
  </>);
}
