import React, { useState } from "react";
import {Input} from "@/components/atoms/input";
import {MuiSelect} from "@/components/atoms/mui-select";
import {DATA_ADDRESS_DESTINATION_SELECT_DATA, DATA_ADDRESS_SELECT_DATA} from "@/constants/data-address-types";
import {theme} from "@/theme/ThemeProvider";
import {DataAddressTypes} from "@/utilities/data-address.ts";
import {AssetFormDataAddressAmazonS3} from "@/components/organisms/asset-form-data-address-amazon-s3.tsx";
import {AssetContactEmailAndSubject} from "@/components/molecules/asset-contact-email-and-subject.tsx";
import {AssetFormDataAddressHttp} from "@/components/organisms/asset-form-data-address-http";
import {Checkbox} from "@/components/atoms/checkbox.tsx";
import {AssetFormDataAddressAzure} from "@/components/organisms/asset-form-data-address-azure.tsx";
import { DataAddress } from "@think-it-labs/edc-connector-client";
import { T } from "@/i18n";

export interface AssetDataAddressFormStepProps {
  translator: (key: string) => string,
  formData: DataAddress,
  onChange: any,
  errors: { [key: string]: boolean | string },
  methodAlwaysShowing?: boolean,
  customDataSourceConfigRows?: number,
  isDestination?: boolean,
}

export function AssetFormDataAddressStep({ formData, errors, onChange, translator, methodAlwaysShowing = false, customDataSourceConfigRows = 2, isDestination = false }: AssetDataAddressFormStepProps): JSX.Element {
  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex flex-col gap-y-5 items-start">
        <label
          htmlFor="data-address-type"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="assets.new.fieldDataAddressType"/>
        </label>
        <MuiSelect
          name="data-address-type"
          id="data-address-type"
          label={translator("assets.new.fieldDataAddressType")}
          options={isDestination ? DATA_ADDRESS_DESTINATION_SELECT_DATA : DATA_ADDRESS_SELECT_DATA}
          error={errors.type}
          value={formData.type}
          onChange={(event) => onChange({ ...formData, type: event.target.value })}
        />
      </div>

      {formData.type === DataAddressTypes.MDSOnRequestOffer &&
        <AssetContactEmailAndSubject
          translator={translator}
          formData={formData}
          onChange={onChange}
          errors={errors}
        />
      }

      {formData.type === DataAddressTypes.AmazonS3 &&
        <AssetFormDataAddressAmazonS3
          translator={translator}
          formData={formData}
          onChange={onChange}
          errors={errors}
          isDestination={isDestination}
        />
      }

      {formData.type === DataAddressTypes.AzureStorage &&
        <AssetFormDataAddressAzure
          translator={translator}
          formData={formData}
          onChange={onChange}
          errors={errors}
          isDestination={isDestination}
        />
      }

      {formData.type === DataAddressTypes.CustomJson &&
        <Input
          name="data-address-custom-json"
          id="data-address-custom-json"
          key="data-address-custom-json"
          multiline
          rows={customDataSourceConfigRows}
          label={translator("assets.new.fieldCustomDatasourceConfig")}
          placeholder={'{"https://w3id.org/edc/v0.0.1/ns/type": "HttpData", ...}'}
          required
          classes={{ textField: { '& p':{ color: theme.palette.error.main } }} as any}
          error={errors.dataAddress}
          value={formData.dataAddress}
          onChange={(event) => onChange({ ...formData, dataAddress: event.target.value })}
        />
      }

      {formData.type === DataAddressTypes.HttpData && <>
        {isDestination &&
          <Checkbox
            label={<T string="assets.new.isPull" />}
            value={formData.isPull}
            onChange={(event) => onChange({ ...formData, isPull: event.target.checked })}
          />
        }
        <AssetFormDataAddressHttp
          translator={translator}
          formData={formData}
          onChange={onChange}
          errors={errors}
          methodAlwaysShowing={methodAlwaysShowing}
          isDestination={isDestination}
          isPull={formData.isPull}
        />
      </>}
    </div>
  );
}
