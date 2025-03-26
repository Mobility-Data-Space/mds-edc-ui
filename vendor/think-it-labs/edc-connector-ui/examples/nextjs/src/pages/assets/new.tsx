import { Button } from "@/components/atoms/button";
import { AssetForm } from "@think-it-labs/edc-connector-ui/asset-form";
import { useRouter } from "next/router";

export default function CreateAssetPage() {
  const { push } = useRouter();
  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <AssetForm managementUrl="http://localhost:3000/api/3003/management">
        <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="id"
              className="inline-block text-sm text-gray-800 mt-2.5"
            >
              Identifier
            </label>
          </div>

          <div className="sm:col-span-9">
            <div className="grid sm:grid-cols-12 gap-2 sm:gap-6 w-full">
              <AssetForm.Id
                id="id"
                type="text"
                className="py-2 px-3 sm:col-span-6 pe-11 block w-full border-gray-200 shadow-xs text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                placeholder="Unique asset identifier"
              />
              <AssetForm.Properties.Input
                name="['http://www.w3.org/ns/dcat#version']"
                id="properties-version"
                type="text"
                className="py-2 px-3 sm:col-span-6 pe-11 block w-full border-gray-200 shadow-xs text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                placeholder="The asset version"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="properties-title"
              className="inline-block text-sm text-gray-800 mt-2.5"
            >
              Title
            </label>
          </div>

          <div className="sm:col-span-9">
            <AssetForm.Properties.Input
              name="['http://purl.org/dc/terms/title']"
              id="properties-title"
              type="text"
              className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-xs text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              placeholder="Human readable asset identifier"
            />
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="properties-contenttype"
              className="inline-block text-sm text-gray-800 mt-2.5"
            >
              Content Type
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
              className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-xs text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            />
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="properties-description"
              className="inline-block text-sm text-gray-800 mt-2.5"
            >
              Description
            </label>
          </div>

          <div className="sm:col-span-9">
            <AssetForm.Properties.Textarea
              name="['http://purl.org/dc/terms/description']"
              id="properties-description"
              className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              rows={6}
              placeholder="A detailed description of the asset content and its purpose"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="data-address-type"
              className="inline-block text-sm text-gray-800 mt-2.5"
            >
              Data address type
            </label>
          </div>

          <div className="sm:col-span-9">
            <AssetForm.DataAddress.Select
              name="type"
              id="data-address-type"
              defaultValue="HttpData"
              options={[
                {
                  value: "HttpData",
                },
              ]}
              className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-xs text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            />
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="data-address-base-url"
              className="inline-block text-sm text-gray-800 mt-2.5"
            >
              URL
            </label>
          </div>

          <div className="sm:col-span-9">
            <div className="grid sm:grid-cols-12 gap-2 sm:gap-6 w-full">
              <AssetForm.DataAddress.Input
                name="baseUrl"
                id="data-address-base-url"
                type="text"
                className="sm:col-span-6 py-2 px-3 pe-11 block w-full border-gray-200 shadow-xs text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                placeholder="The base URL (e.g., https://example.com)"
              />
              <AssetForm.DataAddress.Input
                name="path"
                id="data-address-path"
                type="text"
                className="sm:col-span-6 py-2 px-3 pe-11 block w-full border-gray-200 shadow-xs text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                placeholder="The default path suffix (e.g., /content)"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="data-address-method"
              className="inline-block text-sm text-gray-800 mt-2.5"
            >
              Method and content type§
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
                className="sm:col-span-6 py-2 px-3 pe-11 block w-full border-gray-200 shadow-xs text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
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
                className="sm:col-span-6 py-2 px-3 pe-11 block w-full border-gray-200 shadow-xs text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="data-address-auth-key"
              className="inline-block text-sm text-gray-800 mt-2.5"
            >
              Authorisation
            </label>
          </div>

          <div className="sm:col-span-9">
            <div className="grid sm:grid-cols-12 gap-2 sm:gap-6 w-full">
              <AssetForm.DataAddress.Input
                name="authKey"
                id="data-address-auth-key"
                type="text"
                className="sm:col-span-6 py-2 px-3 pe-11 block w-full border-gray-200 shadow-xs text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                placeholder="Header authorization key"
              />
              <AssetForm.DataAddress.Input
                name="authCode"
                id="data-address-auth-code"
                type="text"
                className="sm:col-span-6 py-2 px-3 pe-11 block w-full border-gray-200 shadow-xs text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                placeholder="Authorisation code"
              />
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
          <div className="sm:col-span-3">
            <div className="inline-block">
              <label
                htmlFor="private-properties-notes"
                className="inline-block text-sm text-gray-800 mt-2.5"
              >
                Private notes
              </label>
            </div>
          </div>

          <div className="sm:col-span-9">
            <AssetForm.PrivateProperties.Textarea
              id="private-properties-notes"
              name="notes"
              className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              rows={6}
              placeholder="Internal notes which won't be shared with other participants"
            />
          </div>
        </div>
        <Button
          variant="secondary"
          onClick={() => push("/")}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Add asset
        </Button>
      </AssetForm>
    </div>
  );
}
