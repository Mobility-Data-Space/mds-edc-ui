import {
  AssetView,
  useAssetContext,
} from "@think-it-labs/edc-connector-ui/asset-view";
import { useRouter } from "next/router";

function DeleteAsset() {
//  const { deleteAsset } = useAssetContext();
  const { push } = useRouter();

  return (
    <button
      onClick={async () => {
//        await deleteAsset();
        push("/");
      }}
    >
      Delete
    </button>
  );
}

export default function AssetPage() {
  const id = useRouter().query.id as string;
  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <AssetView
        id={id}
        managementUrl="http://localhost:3000/api/3003/management"
      >
        <div className="flex flex-col bg-white border shadow-xs rounded-xl p-4 md:p-5 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            <AssetView.Name />
          </h3>
          <p className="mt-1 text-xs font-medium uppercase text-gray-500 dark:text-neutral-500">
            <AssetView.Id />
          </p>
          <div className="mt-2 text-gray-500 dark:text-neutral-400">
            <h2 className="mb-1">Data Address</h2>
            <ul className="marker:text-blue-600 list-disc ps-5 space-y-2 text-sm text-gray-600 dark:text-neutral-400">
              <li>
                <AssetView.DataAddress.Type />
              </li>
              <li>
                <AssetView.DataAddress.MandatoryValue
                  prefix="edc"
                  name="baseUrl"
                />
              </li>
            </ul>
          </div>
          <DeleteAsset />
        </div>
      </AssetView>
    </div>
  );
}
