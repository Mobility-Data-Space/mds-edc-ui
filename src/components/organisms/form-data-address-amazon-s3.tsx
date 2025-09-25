import React, { useState } from "react";
import { DataAddress } from "@think-it-labs/edc-connector-client";
import { T } from "@/i18n";
import { Input } from "@/components/atoms/input";
import { theme } from "@/theme/ThemeProvider";
import { Checkbox } from "@/components/atoms/checkbox";

export interface FormDataAddressAmazonS3Props {
  translator: (key: string) => string;
  formData: DataAddress;
  onChange: any;
  errors: { [key: string]: boolean | string };
  isDestination?: boolean;
}

export function FormDataAddressAmazonS3({
  formData,
  errors,
  onChange,
  translator,
  isDestination = false,
}: FormDataAddressAmazonS3Props): JSX.Element {
  const [multipleObjects, setMultipleObjects] = useState(false);

  return (
    <>
      <div>
        <Checkbox
          data-testid="multiple-objects-checkbox"
          label={translator("assets.new.fieldMultipleObjects")}
          value={multipleObjects}
          onChange={(event) => setMultipleObjects(event.target.checked)}
        />
      </div>
      <div>
        <label
          htmlFor="data-region-fieldRegion"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="assets.new.fieldRegion" /> *
        </label>
        <Input
          name="region"
          id="data-region-fieldRegion"
          key="data-region-fieldRegion"
          label={translator("assets.new.fieldRegion")}
          placeholder={translator("assets.new.fieldRegion")}
          required
          helperText={typeof errors.region === "string" ? errors.region : ""}
          classes={
            { textField: { "& p": { color: theme.palette.error.main } } } as any
          }
          error={errors.region}
          value={formData.region}
          onChange={(event) =>
            onChange({ ...formData, region: event.target.value })
          }
        />
      </div>
      <div>
        <label
          htmlFor="data-address-bucketName"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="assets.new.fieldBucketName" /> *
        </label>
        <Input
          name="bucketName"
          id="data-address-bucketName"
          key="data-address-bucketName"
          label={translator("assets.new.fieldBucketName")}
          placeholder={translator("assets.new.fieldBucketName")}
          required
          helperText={
            typeof errors.bucketName === "string" ? errors.bucketName : ""
          }
          classes={
            { textField: { "& p": { color: theme.palette.error.main } } } as any
          }
          error={errors.bucketName}
          value={formData.bucketName}
          onChange={(event) =>
            onChange({ ...formData, bucketName: event.target.value })
          }
        />
      </div>

      {!multipleObjects ? (
        <div>
          <label
            htmlFor="data-address-objectName"
            className="inline-block text-sm text-black font-medium mb-2"
          >
            <T string="assets.new.fieldObjectName" />
            {!isDestination && !formData.objectPrefix ? " *" : ""}
          </label>
          <Input
            name="objectName"
            id="data-address-objectName"
            key="data-address-objectName"
            label={translator("assets.new.fieldObjectName")}
            placeholder={translator("assets.new.fieldObjectName")}
            required={!isDestination && !formData.objectPrefix}
            helperText={
              typeof errors.objectName === "string" ? errors.objectName : ""
            }
            classes={
              {
                textField: { "& p": { color: theme.palette.error.main } },
              } as any
            }
            error={errors.objectName}
            value={formData.objectName}
            onChange={(event) =>
              onChange({ ...formData, objectName: event.target.value })
            }
          />
        </div>
      ) : (
        !isDestination && (
          <div>
            <label
              htmlFor="data-address-objectPrefix"
              className="inline-block text-sm text-black font-medium mb-2"
            >
              <T string="assets.new.fieldObjectPrefix" />
              {!formData.objectName ? " *" : ""}
            </label>
            <Input
              name="objectPrefix"
              id="data-address-objectPrefix"
              key="data-address-objectPrefix"
              label={translator("assets.new.fieldObjectPrefix")}
              placeholder={translator("assets.new.fieldObjectPrefix")}
              required={!formData.objectName}
              helperText={
                typeof errors.objectPrefix === "string"
                  ? errors.objectPrefix
                  : ""
              }
              classes={
                {
                  textField: { "& p": { color: theme.palette.error.main } },
                } as any
              }
              error={errors.objectPrefix}
              value={formData.objectPrefix}
              onChange={(event) =>
                onChange({ ...formData, objectPrefix: event.target.value })
              }
            />
          </div>
        )
      )}

      {isDestination && (
        <div>
          <label
            htmlFor="data-address-folderName"
            className="inline-block text-sm text-black font-medium mb-2"
          >
            <T string="assets.new.fieldFolderName" />
          </label>
          <Input
            name="folderName"
            id="data-address-folderName"
            key="data-address-folderName"
            label={translator("assets.new.fieldFolderName")}
            placeholder={translator("assets.new.fieldFolderName")}
            helperText={
              typeof errors.folderName === "string" ? errors.folderName : ""
            }
            classes={
              {
                textField: { "& p": { color: theme.palette.error.main } },
              } as any
            }
            error={errors.folderName}
            value={formData.folderName}
            onChange={(event) =>
              onChange({ ...formData, folderName: event.target.value })
            }
          />
        </div>
      )}
      <div>
        <label
          htmlFor="data-address-keyname"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="assets.new.fieldKeyname" />
        </label>
        <Input
          name="keyName"
          id="data-address-keyname"
          key="data-address-keyname"
          label={translator("assets.new.fieldKeyname")}
          placeholder={translator("assets.new.fieldKeyname")}
          helperText={typeof errors.keyName === "string" ? errors.keyName : ""}
          classes={
            { textField: { "& p": { color: theme.palette.error.main } } } as any
          }
          error={errors.keyName}
          value={formData.keyName}
          onChange={(event) =>
            onChange({ ...formData, keyName: event.target.value })
          }
        />
      </div>
    </>
  );
}
