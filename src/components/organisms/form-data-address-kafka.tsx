import { Input } from "@/components/atoms/input";
import { T } from "@/i18n";
import { DataAddress } from "@think-it-labs/edc-connector-client";
import React from "react";
import { Checkbox } from "../atoms/checkbox";
import { MuiSelect } from "../atoms/mui-select";

export interface FormDataAddressKafkaProps {
  translator: (key: string) => string;
  formData: DataAddress;
  isDestination?: boolean;
  onChange: any;

  errors: { [key: string]: boolean | string };
}
export function FormDataAddressKafka({
  isDestination,
  ...props
}: FormDataAddressKafkaProps) {
  return isDestination ? (
    <ConsumerFormDataAddressKafka {...props} />
  ) : (
    <ProviderFormDataAddressKafka {...props} />
  );
}

export function ConsumerFormDataAddressKafka({
  formData,
  errors,
  onChange,
  translator,
}: FormDataAddressKafkaProps): React.ReactElement {
  if (!formData.isPull) {
    onChange({ ...formData, isPull: true });
  }
  return (
    <div className="flex flex-col gap-y-5">
      <Checkbox
        label={<T string="Provide Callback Address" />}
        value={!!formData.isTransactional}
        onChange={(event) =>
          onChange({ ...formData, isTransactional: event.target.checked })
        }
      />

      {formData.isTransactional && (
        <>
          <label
            htmlFor="data-address-uri"
            className="inline-block text-sm text-black font-medium mb-2"
          >
            <T string="Callback URL" />
          </label>
          <div className="sm:col-span-1 flex flex-col gap-y-3">
            <Input
              name="data-address-uri"
              id="data-address-uri"
              data-testid="data-address-uri"
              required
              placeholder={"https://example.com"}
              label={translator("Callback URL")}
              error={errors.uri}
              value={formData.uri}
              onChange={(event) =>
                onChange({ ...formData, uri: event.target.value })
              }
            />
          </div>
        </>
      )}
    </div>
  );
}

export function ProviderFormDataAddressKafka({
  formData,
  errors,
  onChange,
  translator,
}: FormDataAddressKafkaProps): React.ReactElement {
  return (
    <>
      <div className="flex flex-col gap-y-5">
        <label
          htmlFor="data-address-topic"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="Kafka Topic" />
        </label>
        <div className="sm:col-span-1 flex flex-col gap-y-3">
          <Input
            name="data-address-topic"
            id="data-address-topic"
            data-testid="data-address-topic"
            required
            placeholder={"Kafka Topic"}
            label={translator("Kafka Topic")}
            error={errors.topic}
            value={formData.topic}
            onChange={(event) =>
              onChange({ ...formData, topic: event.target.value })
            }
          />
        </div>

        <label
          htmlFor="data-address-oidcDiscoveryUrl"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="Oidc Discovery Url" />
        </label>
        <div className="sm:col-span-1 flex flex-col gap-y-3">
          <Input
            name="data-address-oidcDiscoveryUrl"
            id="data-address-oidcDiscoveryUrl"
            data-testid="data-address-oidcDiscoveryUrl"
            required
            placeholder={"Oidc Discovery Url"}
            label={translator("Oidc Discovery Url")}
            error={errors.oidcDiscoveryUrl}
            value={formData.oidcDiscoveryUrl}
            onChange={(event) =>
              onChange({ ...formData, oidcDiscoveryUrl: event.target.value })
            }
          />
        </div>
        <label
          htmlFor="data-address-endpoint"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="Endpoint URL" />
        </label>
        <div className="sm:col-span-1 flex flex-col gap-y-3">
          <Input
            name="data-address-endpoint"
            id="data-address-endpoint"
            data-testid="data-address-endpoint"
            required
            type="url"
            placeholder={"Endpoint URL"}
            label={translator("Endpoint URL")}
            error={errors.endpoint}
            value={formData.endpoint}
            onChange={(event) =>
              onChange({ ...formData, endpoint: event.target.value })
            }
          />
        </div>
        <label
          htmlFor="data-address-mechanism"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="SASL Kafka Mechanism" />
        </label>
        <div className="sm:col-span-1 flex flex-col gap-y-3">
          <MuiSelect
            name="data-address-mechanism"
            id="data-address-mechanism"
            label={translator("SASL Kafka Mechanism")}
            required
            options={[
              {
                text: "oAuth bearer",
                value: "OAUTHBEARER",
              },
            ]}
            error={errors.mechanism}
            value={formData.mechanism}
            onChange={(event) =>
              onChange({ ...formData, mechanism: event.target.value })
            }
          />
        </div>
        <label
          htmlFor="data-address-protocol"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="Security Protocol" />
        </label>
        <div className="sm:col-span-1 flex flex-col gap-y-3">
          <MuiSelect
            name="data-address-protocol"
            id="data-address-protocol"
            label={translator("Security Protocol")}
            required
            options={[
              {
                text: "plaintext",
                value: "SASL_PLAINTEXT",
              },
              {
                text: "SSL",
                value: "SASL_SSL",
              },
            ]}
            error={errors.protocol}
            value={formData.protocol}
            onChange={(event) =>
              onChange({ ...formData, protocol: event.target.value })
            }
          />
        </div>
        <label
          htmlFor="data-address-oidc-token"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="OIDC Register Token" />
        </label>
        <div className="sm:col-span-1 flex flex-col gap-y-3">
          <Input
            name="data-address-oidc-token"
            id="data-address-oidc-token"
            data-testid="data-address-oidc-token"
            required
            placeholder={"OIDC Register Client Token"}
            label={translator("OIDC Register Client Token")}
            error={errors.oidcRegisterClientTokenKey}
            value={formData.oidcRegisterClientTokenKey}
            onChange={(event) =>
              onChange({
                ...formData,
                oidcRegisterClientTokenKey: event.target.value,
              })
            }
          />
        </div>
        <label
          htmlFor="data-address-admin-key"
          className="inline-block text-sm text-black font-medium mb-2"
        >
          <T string="Admin Properties Key" />
        </label>
        <div className="sm:col-span-1 flex flex-col gap-y-3">
          <Input
            name="data-address-admin-key"
            id="data-address-admin-key"
            data-testid="data-address-admin-key"
            required
            placeholder={"Kafka Admin Properties Key"}
            label={translator("Kafka Admin Properties Key")}
            error={errors.kafkaAdminPropertiesKey}
            value={formData.kafkaAdminPropertiesKey}
            onChange={(event) =>
              onChange({
                ...formData,
                kafkaAdminPropertiesKey: event.target.value,
              })
            }
          />
        </div>
      </div>
    </>
  );
}
