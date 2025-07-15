import React from "react";
import { DataAddress } from "@think-it-labs/edc-connector-client";
import {T} from "@/i18n";
import {Input} from "@/components/atoms/input";
import {theme} from "@/theme/ThemeProvider";

export interface AssetFormDataAddressAzureProps {
  translator: (key: string) => string,
  formData: DataAddress,
  onChange: any,
  errors: { [key: string]: boolean | string },
  isDestination?: boolean,
}

export function AssetFormDataAddressAzure({ formData, errors, onChange, translator, isDestination = false }: AssetFormDataAddressAzureProps): JSX.Element {
  return (
    <>
      <div>
        <label
          htmlFor="data-address-container"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="assets.new.fieldBucketName"/> *
        </label>
        <Input
          name="container"
          id="data-address-container"
          key="data-address-container"
          label={translator("assets.new.fieldContainer")}
          placeholder={translator("assets.new.fieldContainer")}
          required
          helperText={typeof errors.container === "string" ? errors.container : ""}
          classes={{textField: {'& p': {color: theme.palette.error.main}}} as any}
          error={errors.container}
          value={formData.container}
          onChange={(event) => onChange({...formData, container: event.target.value})}
        />
      </div>
      <div>
        <label
          htmlFor="data-region-account"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="assets.new.fieldAccount"/> *
        </label>
        <Input
          name="region"
          id="data-region-account"
          key="data-region-account"
          label={translator("assets.new.fieldAccount")}
          placeholder={translator("assets.new.fieldAccount")}
          required
          helperText={typeof errors.account === "string" ? errors.account : ""}
          classes={{textField: {'& p': {color: theme.palette.error.main}}} as any}
          error={errors.account}
          value={formData.account}
          onChange={(event) => onChange({...formData, account: event.target.value})}
        />
      </div>
      {isDestination &&
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
        </div>
      }
      <div>
        <label
          htmlFor="data-address-blobName"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="assets.new.fieldBlobName"/>
        </label>
        <Input
          name="blobName"
          id="data-address-blobName"
          key="data-address-blobName"
          label={translator("assets.new.fieldBlobName")}
          placeholder={translator("assets.new.fieldBlobName")}
          helperText={typeof errors.blobName === "string" ? errors.blobName : ""}
          classes={{textField: {'& p': {color: theme.palette.error.main}}} as any}
          error={errors.blobName}
          value={formData.blobName}
          onChange={(event) => onChange({...formData, blobName: event.target.value})}
        />
      </div>
      <div>
        <label
          htmlFor="data-address-blobPrefix"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="assets.new.fieldBlobPrefix"/>
        </label>
        <Input
          name="blobPrefix"
          id="data-address-blobPrefix"
          key="data-address-blobPrefix"
          label={translator("assets.new.fieldBlobPrefix")}
          placeholder={translator("assets.new.fieldBlobPrefix")}
          helperText={typeof errors.blobPrefix === "string" ? errors.blobPrefix : ""}
          classes={{textField: {'& p': {color: theme.palette.error.main}}} as any}
          error={errors.blobPrefix}
          value={formData.blobPrefix}
          onChange={(event) => onChange({...formData, blobPrefix: event.target.value})}
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
          placeholder={translator("assets.new.fieldKeyname")}
          helperText={typeof errors.keyname === "string" ? errors.keyname : ""}
          classes={{textField: {'& p': {color: theme.palette.error.main}}} as any}
          error={errors.keyname}
          value={formData.keyname}
          onChange={(event) => onChange({...formData, keyname: event.target.value})}
        />
      </div>
    </>
  );
}
