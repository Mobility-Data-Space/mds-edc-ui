import React from "react";
import { Input } from "@/components/atoms/input";
import { MuiSelect } from "@/components/atoms/mui-select";
import {
  DATA_ADDRESS_DESTINATION_SELECT_DATA,
  DATA_ADDRESS_SELECT_DATA,
} from "@/constants/data-address-types";
import { theme } from "@/theme/ThemeProvider";
import { DataAddressTypes } from "@/utilities/data-address.ts";
import { FormDataAddressAmazonS3 } from "@/components/organisms/form-data-address-amazon-s3";
import { AssetContactEmailAndSubject } from "@/components/molecules/asset-contact-email-and-subject.tsx";
import { FormDataAddressHttp } from "@/components/organisms/form-data-address-http";
import { FormDataAddressAzure } from "@/components/organisms/form-data-address-azure";
import { DataAddress } from "@think-it-labs/edc-connector-client";
import { T } from "@/i18n";
import { FormDataAddressKafka } from "./form-data-address-kafka";

export interface DataAddressFormStepProps {
  translator: (key: string) => string;
  formData: DataAddress;
  onChange: any;
  errors: { [key: string]: boolean | string };
  methodAlwaysShowing?: boolean;
  customDataAddressConfigRows?: number;
  isDestination?: boolean;
}

export function FormDataAddressStep({
  formData,
  errors,
  onChange,
  translator,
  methodAlwaysShowing = false,
  customDataAddressConfigRows = 2,
  isDestination = false,
}: DataAddressFormStepProps): JSX.Element {
  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex flex-col gap-y-5 items-start">
        <label
          htmlFor="data-address-type"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="assets.new.fieldDataAddressType" />
        </label>
        <MuiSelect
          name="data-address-type"
          id="data-address-type"
          label={translator("assets.new.fieldDataAddressType")}
          options={
            isDestination
              ? DATA_ADDRESS_DESTINATION_SELECT_DATA
              : DATA_ADDRESS_SELECT_DATA
          }
          error={errors.type}
          value={formData.type}
          onChange={(event) =>
            onChange({ ...formData, type: event.target.value })
          }
        />
      </div>

      {formData.type === DataAddressTypes.MDSOnRequestOffer && (
        <AssetContactEmailAndSubject
          translator={translator}
          formData={formData}
          onChange={onChange}
          errors={errors}
        />
      )}

      {formData.type === DataAddressTypes.AmazonS3 && (
        <FormDataAddressAmazonS3
          translator={translator}
          formData={formData}
          onChange={onChange}
          errors={errors}
          isDestination={isDestination}
        />
      )}

      {formData.type === DataAddressTypes.AzureStorage && (
        <FormDataAddressAzure
          translator={translator}
          formData={formData}
          onChange={onChange}
          errors={errors}
          isDestination={isDestination}
        />
      )}

      {formData.type === DataAddressTypes.CustomJson && (
        <Input
          name="data-address-custom-json"
          id="data-address-custom-json"
          key="data-address-custom-json"
          multiline
          rows={customDataAddressConfigRows}
          label={
            isDestination
              ? translator("assets.new.fieldCustomDataDestintationConfig")
              : translator("assets.new.fieldCustomDataSourceConfig")
          }
          placeholder={
            '{"https://w3id.org/edc/v0.0.1/ns/type": "HttpData", ...}'
          }
          required
          classes={
            { textField: { "& p": { color: theme.palette.error.main } } } as any
          }
          error={errors.dataAddress}
          value={formData.dataAddress}
          onChange={(event) =>
            onChange({ ...formData, dataAddress: event.target.value })
          }
        />
      )}

      {formData.type === DataAddressTypes.HttpData && (
        <FormDataAddressHttp
          translator={translator}
          formData={formData}
          onChange={onChange}
          errors={errors}
          methodAlwaysShowing={methodAlwaysShowing}
          isDestination={isDestination}
          isPull={formData.isPull}
        />
      )}

      {formData.type === DataAddressTypes.Kafka && (
        <FormDataAddressKafka
          translator={translator}
          formData={formData}
          onChange={onChange}
          errors={errors}
          isDestination={isDestination}
        />
      )}
    </div>
  );
}
