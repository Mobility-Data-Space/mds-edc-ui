import { Button } from "@/components/atoms/button";
import { ConnectorDashboard } from "@/components/templates/connector-dashboard";
import { AssetForm } from "@think-it-labs/edc-connector-ui/asset-form";
import { useConnectorDashboardState } from "@/hooks/use-connector-dashboard-state";
import { T, useTranslator } from "@/i18n";
import {LANGUAGE_SELECT_DATA} from "@/constants/languages.ts";
import {DATA_ADDRESS_SELECT_DATA} from "@/constants/data-address-types.ts";

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
                  htmlFor="properties-title"
                  className="inline-block text-sm text-gray-800 mt-2.5"
              >
                <T string="fieldTitle"/>
              </label>
            </div>

            <div className="sm:col-span-9">
              <div className="grid sm:grid-cols-12 gap-2 sm:gap-6 w-full">
                <AssetForm.Properties.Input
                    name="['http://purl.org/dc/terms/title']"
                    id="properties-title"
                    type="text"
                    className="py-2 px-3 sm:col-span-6 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder={translator("fieldTitlePlaceholder")}
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
                  htmlFor="id"
                  className="inline-block text-sm text-gray-800 mt-2.5"
              >
                <T string="fieldId"/>
              </label>
            </div>

            <div className="sm:col-span-9">
              <AssetForm.Id
                  id="id"
                  type="text"
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder={translator("fieldIdPlaceholder")}
              />
            </div>

            <div className="sm:col-span-3">
              <label
                  htmlFor="properties-description"
                  className="inline-block text-sm text-gray-800 mt-2.5"
              >
                <T string="fieldDescription"/>
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

            <div className="sm:col-span-3">
              <label
                  htmlFor="properties-keywords"
                  className="inline-block text-sm text-gray-800 mt-2.5"
              >
                <T string="fieldKeywords"/>
              </label>
            </div>

            <div className="sm:col-span-9">
              <AssetForm.Properties.Input
                  name="keywords"
                  id="properties-keywords"
                  type="text"
                  className="py-2 px-3 sm:col-span-6 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder={translator("fieldKeywordsPlaceholder")}
              />
            </div>

            <div className="sm:col-span-3">
              <label
                  htmlFor="properties-language"
                  className="inline-block text-sm text-gray-800 mt-2.5"
              >
                <T string="fieldlanguage"/>
              </label>
            </div>

            <div className="sm:col-span-9">
              <AssetForm.Properties.Select
                  name="language"
                  id="properties-language"
                  options={LANGUAGE_SELECT_DATA}
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label
                  htmlFor="properties-contenttype"
                  className="inline-block text-sm text-gray-800 mt-2.5"
              >
                <T string="fieldContentType"/>
              </label>
            </div>

            <div className="sm:col-span-9">
              <AssetForm.Properties.Select
                  name="['http://www.w3.org/ns/dcat#distribution'].['http://www.w3.org/ns/dcat#mediaType']"
                  id="properties-contenttype"
                  options={[
                    {value: "application/json"},
                    {value: "text/csv"},
                    {value: "text/xml"},
                  ]}
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label
                  htmlFor="properties-endpoint-documentation"
                  className="inline-block text-sm text-gray-800 mt-2.5"
              >
                <T string="fieldEndpointDocumentation"/>
              </label>
            </div>

            <div className="sm:col-span-9">
              <AssetForm.Properties.Input
                  name="endpointDocumentation"
                  id="properties-endpoint-documentation"
                  type="url"
                  className="py-2 px-3 sm:col-span-6 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder={translator("fieldEndpointDocumentationPlaceholder")}
              />
            </div>

            <div className="sm:col-span-3">
              <label
                  htmlFor="properties-publisher"
                  className="inline-block text-sm text-gray-800 mt-2.5"
              >
                <T string="fieldPublisher"/>
              </label>
            </div>

            <div className="sm:col-span-9">
              <div className="grid sm:grid-cols-12 gap-2 sm:gap-6 w-full">
                <AssetForm.Properties.Input
                    name="publisher"
                    id="properties-publisher"
                    type="text"
                    className="py-2 px-3 sm:col-span-6 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder={translator("fieldPublisherPlaceholder")}
                />
                <AssetForm.Properties.Input
                    name="standardLicense"
                    id="properties-standard-license"
                    type="text"
                    className="py-2 px-3 sm:col-span-6 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder={translator("fieldStandardLicensePlaceholder")}
                />
              </div>
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
                <T string="fieldDataAddressType"/>
              </label>
            </div>

            <div className="sm:col-span-9">
              <AssetForm.DataAddress.Select
                  name="type"
                  id="data-address-type"
                  options={DATA_ADDRESS_SELECT_DATA}
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label
                  htmlFor="data-address-method"
                  className="inline-block text-sm text-gray-800 mt-2.5"
              >
                <T string="fieldDataAddressMethodAndContentType"/>
              </label>
            </div>

            <div className="sm:col-span-9">
              <AssetForm.DataAddress.Select
                  name="method"
                  id="data-address-method"
                  options={[
                    { value: "GET" },
                    { value: "POST" },
                  ]}
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label
                  htmlFor="data-address-base-url"
                  className="inline-block text-sm text-gray-800 mt-2.5"
              >
                <T string="fieldDataAddressUrl"/>
              </label>
            </div>

            <div className="sm:col-span-9">
              <AssetForm.DataAddress.Input
                  name="baseUrl"
                  id="data-address-base-url"
                  type="text"
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder={translator("fieldDataAddressBaseUrlPlaceholder")}
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
