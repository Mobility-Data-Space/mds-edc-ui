import React from "react";
import { DataAddress } from "@think-it-labs/edc-connector-client";
import {T} from "@/i18n";
import {Input} from "@/components/atoms/input";
import {theme} from "@/theme/ThemeProvider";

export interface AssetFormDataAddressAmazonS3Props {
  translator: (key: string) => string,
  formData: DataAddress,
  onChange: any,
  errors: { [key: string]: boolean | string },
  isDestination?: boolean,
}

export function AssetFormDataAddressAmazonS3({ formData, errors, onChange, translator, isDestination = false }: AssetFormDataAddressAmazonS3Props): JSX.Element {
  return (
    <>
      <div>
        <label
          htmlFor="data-address-bucketName"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="assets.new.fieldBucketName"/> *
        </label>
        <Input
          name="bucketName"
          id="data-address-bucketName"
          key="data-address-bucketName"
          label={translator("assets.new.fieldBucketName")}
          placeholder={translator("assets.new.fieldBucketName")}
          required
          helperText={typeof errors.bucketName === "string" ? errors.bucketName : ""}
          classes={{ textField: { '& p':{ color: theme.palette.error.main } }} as any}
          error={errors.bucketName}
          value={formData.bucketName}
          onChange={(event) => onChange({ ...formData, bucketName: event.target.value })}
        />
      </div>
      <div>
        <label
          htmlFor="data-region-fieldRegion"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="assets.new.fieldRegion"/> *
        </label>
        <Input
          name="region"
          id="data-region-fieldRegion"
          key="data-region-fieldRegion"
          label={translator("assets.new.fieldRegion")}
          placeholder={translator("assets.new.fieldRegion")}
          required
          helperText={typeof errors.region === "string" ? errors.region : ""}
          classes={{ textField: { '& p':{ color: theme.palette.error.main } }} as any}
          error={errors.region}
          value={formData.region}
          onChange={(event) => onChange({ ...formData, region: event.target.value })}
        />
      </div>
      <div>
        <label
          htmlFor="data-keyname-Keyname"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="assets.new.fieldKeyname"/>
        </label>
        <Input
          name="keyname"
          id="data-keyname-Keyname"
          key="data-keyname-Keyname"
          label={translator("assets.new.fieldKeyname")}
          placeholder={translator("assets.new.fieldKeyname")}
          helperText={typeof errors.keyname === "string" ? errors.keyname : ""}
          classes={{ textField: { '& p':{ color: theme.palette.error.main } }} as any}
          error={errors.keyname}
          value={formData.keyname}
          onChange={(event) => onChange({ ...formData, keyname: event.target.value })}
        />
      </div>
      <div>
        <label
          htmlFor="data-address-objectName"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="assets.new.fieldObjectName"/>
          {isDestination || formData.objectPrefix ? "" : " *"}
        </label>
        <Input
          name="objectName"
          id="data-address-objectName"
          key="data-address-objectName"
          label={translator("assets.new.fieldObjectName")}
          placeholder={translator("assets.new.fieldObjectName")}
          required={! isDestination && !formData.objectPrefix}
          helperText={typeof errors.objectName === "string" ? errors.objectName : ""}
          classes={{ textField: { '& p':{ color: theme.palette.error.main } }} as any}
          error={errors.objectName}
          value={formData.objectName}
          onChange={(event) => onChange({ ...formData, objectName: event.target.value })}
        />
      </div>
      {isDestination ?
        <div>
          <label
            htmlFor="data-address-folderName"
            className="inline-block text-sm text-black font-medium mb-2"
          >
            <T string="assets.new.fieldFolderName"/>
          </label>
          <Input
            name="folderName"
            id="data-address-folderName"
            key="data-address-folderName"
            label={translator("assets.new.fieldFolderName")}
            placeholder={translator("assets.new.fieldFolderName")}
            helperText={typeof errors.folderName === "string" ? errors.folderName : ""}
            classes={{textField: {'& p': {color: theme.palette.error.main}}} as any}
            error={errors.folderName}
            value={formData.folderName}
            onChange={(event) => onChange({...formData, folderName: event.target.value})}
          />
        </div> :
        <div>
          <label
            htmlFor="data-address-objectPrefix"
            className="inline-block text-sm text-black font-medium mb-2"
          >
            <T string="assets.new.fieldObjectPrefix"/>
          </label>
          <Input
            name="objectPrefix"
            id="data-address-objectPrefix"
            key="data-address-objectPrefix"
            label={translator("assets.new.fieldObjectPrefix")}
            placeholder={translator("assets.new.fieldObjectPrefix")}
            helperText={typeof errors.objectPrefix === "string" ? errors.objectPrefix : ""}
            classes={{textField: {'& p': {color: theme.palette.error.main}}} as any}
            error={errors.objectPrefix}
            value={formData.objectPrefix}
            onChange={(event) => onChange({...formData, objectPrefix: event.target.value})}
          />
        </div>
      }
    </>
  );
}
