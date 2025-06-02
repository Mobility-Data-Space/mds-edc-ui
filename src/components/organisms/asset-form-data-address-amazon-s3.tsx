import React from "react";
import { DataAddress } from "@think-it-labs/edc-connector-client";
import {T} from "@/i18n";
import {Input} from "@/components/atoms/input";
import {theme} from "@/theme/ThemeProvider";

export interface AssetFormDataAddressRemoteProps {
  translator: (key: string) => string,
  formData: DataAddress,
  onChange: any,
  errors: { [key: string]: boolean | string },
}


export function AssetFormDataAddressAmazonS3({ formData, errors, onChange, translator}: AssetFormDataAddressRemoteProps): JSX.Element {
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
          htmlFor="data-region-description"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="assets.new.fieldRegion"/> *
        </label>
        <Input
          name="region"
          id="data-region-description"
          key="data-region-description"
          label={translator("assets.new.fieldRegion")}
          placeholder={translator("asser.new.fieldRegion")}
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
          htmlFor="data-keyname-description"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="assets.new.fieldKeyname"/> *
        </label>
        <Input
          name="keyname"
          id="data-keyname-description"
          key="data-keyname-description"
          label={translator("assets.new.fieldKeyname")}
          placeholder={translator("asset.new.fieldKeyname")}
          required
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
          <T string="assets.new.fieldObjectName"/> *
        </label>
        <Input
          name="objectName"
          id="data-address-objectName"
          key="data-address-objectName"
          label={translator("assets.new.fieldObjectName")}
          placeholder={translator("assets.new.fieldObjectName")}
          required
          helperText={typeof errors.objectName === "string" ? errors.objectName : ""}
          classes={{ textField: { '& p':{ color: theme.palette.error.main } }} as any}
          error={errors.objectName}
          value={formData.objectName}
          onChange={(event) => onChange({ ...formData, objectName: event.target.value })}
        />
      </div>
      <div>
        <label
          htmlFor="data-address-objectPrefix"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="assets.new.fieldObjectPrefix"/> *
        </label>
        <Input
          name="objectPrefix"
          id="data-address-objectPrefix"
          key="data-address-objectPrefix"
          label={translator("assets.new.fieldObjectPrefix")}
          placeholder={translator("assets.new.fieldObjectPrefix")}
          required
          helperText={typeof errors.objectPrefix === "string" ? errors.objectPrefix : ""}
          classes={{ textField: { '& p':{ color: theme.palette.error.main } }} as any}
          error={errors.objectPrefix}
          value={formData.objectPrefix}
          onChange={(event) => onChange({ ...formData, objectPrefix: event.target.value })}
        />
      </div>
    </>
  );
}
