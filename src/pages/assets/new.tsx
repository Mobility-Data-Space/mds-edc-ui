import { Button } from "@/components/atoms/button";
import { ConnectorDashboard } from "@/components/templates/connector-dashboard";
import { AssetForm } from "@think-it-labs/edc-connector-ui/asset-form";
import { useConnectorDashboardState } from "@/hooks/use-connector-dashboard-state";
import { T, useTranslator } from "@/i18n";

export default function CreateAssetPage() {
  const { push, connector } = useConnectorDashboardState();
  const { translator } = useTranslator();
  if (!connector) {
    return "No connector";
  }
  return (
    <ConnectorDashboard>
      <ConnectorDashboard.Section>
        <ConnectorDashboard.Title>
          <T string="title" />
        </ConnectorDashboard.Title>
        <ConnectorDashboard.Description>
          <T string="description" />
        </ConnectorDashboard.Description>
      </ConnectorDashboard.Section>

      <AssetForm
        managementUrl={connector.managementUrl}
        onSuccess={() => push("/assets")}
      >
        <ConnectorDashboard.Section>
          <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="id"
                className="inline-block text-sm text-gray-800 mt-2.5"
              >
                <T string="fieldId" />
              </label>
            </div>

            <div className="sm:col-span-9">
              <div className="grid sm:grid-cols-12 gap-2 sm:gap-6 w-full">
                <AssetForm.Id
                  id="id"
                  type="text"
                  className="py-2 px-3 sm:col-span-6 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder={translator("fieldIdPlaceholder")}
                />
                <AssetForm.Properties.Input
                  name="['http://www.w3.org/ns/dcat#version']"
                  id="properties-version"
                  type="text"
                  className="py-2 px-3 sm:col-span-6 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder={translator("fieldVersionPlaceholder")}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="properties-title"
                className="inline-block text-sm text-gray-800 mt-2.5"
              >
                <T string="fieldTitle" />
              </label>
            </div>

            <div className="sm:col-span-9">
              <AssetForm.Properties.Input
                name="['http://purl.org/dc/terms/title']"
                id="properties-title"
                type="text"
                className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                placeholder={translator("fieldTitlePlaceholder")}
              />
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="properties-contenttype"
                className="inline-block text-sm text-gray-800 mt-2.5"
              >
                <T string="fieldContentType" />
              </label>
            </div>

            <div className="sm:col-span-9">
              <AssetForm.Properties.Select
                name="['http://www.w3.org/ns/dcat#distribution'].['http://www.w3.org/ns/dcat#mediaType']"
                id="properties-contenttype"
                options={[
                  {
                    value: "application/json",
                  },
                  {
                    value: "text/csv",
                  },
                  {
                    value: "text/xml",
                  },
                ]}
                className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="properties-description"
                className="inline-block text-sm text-gray-800 mt-2.5"
              >
                <T string="fieldDescription" />
              </label>
            </div>

            <div className="sm:col-span-9">
              <AssetForm.Properties.Textarea
                name="['http://purl.org/dc/terms/description']"
                id="properties-description"
                className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                rows={6}
                placeholder={translator("fieldDescriptionPlaceholder")}
              />
            </div>
          </div>
        </ConnectorDashboard.Section>

        <ConnectorDashboard.Section>
          <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="data-address-type"
                className="inline-block text-sm text-gray-800 mt-2.5"
              >
                <T string="fieldDataAddressType" />
              </label>
            </div>

            <div className="sm:col-span-9">
              <AssetForm.DataAddress.Select
                name="type"
                id="data-address-type"
                options={[
                  {
                    value: "HttpData",
                  },
                ]}
                className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="data-address-base-url"
                className="inline-block text-sm text-gray-800 mt-2.5"
              >
                <T string="fieldDataAddressUrl" />
              </label>
            </div>

            <div className="sm:col-span-9">
              <div className="grid sm:grid-cols-12 gap-2 sm:gap-6 w-full">
                <AssetForm.DataAddress.Input
                  name="baseUrl"
                  id="data-address-base-url"
                  type="text"
                  className="sm:col-span-6 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder={translator("fieldDataAddressBaseUrlPlaceholder")}
                />
                <AssetForm.DataAddress.Input
                  name="path"
                  id="data-address-path"
                  type="text"
                  className="sm:col-span-6 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder={translator("fieldDataAddressPathPlaceholder")}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="data-address-method"
                className="inline-block text-sm text-gray-800 mt-2.5"
              >
                <T string="fieldDataAddressMethodAndContentType" />
              </label>
            </div>

            <div className="sm:col-span-9">
              <div className="grid sm:grid-cols-12 gap-2 sm:gap-6 w-full">
                <AssetForm.DataAddress.Select
                  name="method"
                  id="data-address-method"
                  options={[
                    {
                      value: "GET",
                    },
                    {
                      value: "POST",
                    },
                  ]}
                  className="sm:col-span-6 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                />
                <AssetForm.DataAddress.Select
                  name="contentType"
                  id="data-address-contenttype"
                  options={[
                    {
                      value: "application/json",
                    },
                    {
                      value: "text/csv",
                    },
                    {
                      value: "text/xml",
                    },
                  ]}
                  className="sm:col-span-6 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="data-address-auth-key"
                className="inline-block text-sm text-gray-800 mt-2.5"
              >
                <T string="fieldDataAddressAuth" />
              </label>
            </div>

            <div className="sm:col-span-9">
              <div className="grid sm:grid-cols-12 gap-2 sm:gap-6 w-full">
                <AssetForm.DataAddress.Input
                  name="authKey"
                  id="data-address-auth-key"
                  type="text"
                  className="sm:col-span-6 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder={translator("fieldDataAddressAuthKeyPlaceholder")}
                />
                <AssetForm.DataAddress.Input
                  name="authCode"
                  id="data-address-auth-code"
                  type="text"
                  className="sm:col-span-6 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder={translator(
                    "fieldDataAddressAuthCodePlaceholder",
                  )}
                />
              </div>
            </div>
          </div>
        </ConnectorDashboard.Section>

        <ConnectorDashboard.Section>
          <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
            <div className="sm:col-span-3">
              <div className="inline-block">
                <label
                  htmlFor="af-account-phone"
                  className="inline-block text-sm text-gray-800 mt-2.5"
                >
                  <T string="fieldPrivateNotes" />
                </label>
              </div>
            </div>

            <div className="sm:col-span-9">
              <AssetForm.PrivateProperties.Textarea
                id="private-properties-description"
                name="notes"
                className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                rows={6}
                placeholder={translator("fieldPrivateNotesPlaceholder")}
              />
            </div>
          </div>
        </ConnectorDashboard.Section>

        <ConnectorDashboard.Section className="flex justify-between">
          <Button
            variant="secondary"
            onClick={() => push("/assets")}
          >
            <T string="buttonCancel" />
          </Button>
          <Button
            variant="primary"
            type="submit"
          >
            <T string="buttonSave" />
          </Button>
        </ConnectorDashboard.Section>
      </AssetForm>
    </ConnectorDashboard>
  );
}
