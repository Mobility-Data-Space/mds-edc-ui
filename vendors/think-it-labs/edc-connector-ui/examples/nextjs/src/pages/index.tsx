import { Button } from "@/components/atoms/button";
import { AssetsList } from "../../../../src/assets-list";
import { useRouter } from "next/router";

export default function AssetListPage() {
  const router = useRouter();
  return (
    <AssetsList managementUrl="http://localhost:3000/api/3003/management">
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden dark:bg-neutral-900 dark:border-neutral-700">
                <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200 dark:border-neutral-700">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                    Assets
                  </h2>
                  <Button
                    onClick={() => router.push("/assets/new")}
                    variant="primary"
                  >
                    Add new asset
                  </Button>
                </div>

                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead className="bg-gray-50 dark:bg-neutral-800">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start whitespace-nowrap"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                          #
                        </span>
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3 text-start whitespace-nowrap min-w-64"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                          Name
                        </span>
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3 text-start whitespace-nowrap"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                          Content type
                        </span>
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3 text-start whitespace-nowrap"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                          Data address name
                        </span>
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3 text-start whitespace-nowrap"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                          Data address type
                        </span>
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3 text-start whitespace-nowrap"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                          Data address URL
                        </span>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                    <AssetsList.Items
                      limit={10}
                      offset={0}
                    >
                      {({ item, index }) => (
                        <AssetsList.Asset asset={item}>
                          <tr
                            onClick={() => router.push(`/assets/${item.id}`)}
                          >
                            <td className="size-px whitespace-nowrap px-6 py-3">
                              <button
                                type="button"
                                className="flex items-center gap-x-2"
                              >
                                <span className="text-sm text-gray-800 dark:text-neutral-200">
                                  {index + 1}
                                </span>
                              </button>
                            </td>
                            <td className="size-px whitespace-nowrap px-6 py-3">
                              <div className="flex items-center gap-x-3">
                                <span className="font-semibold text-sm text-gray-800 dark:text-white">
                                  <AssetsList.Asset.Name />
                                </span>
                              </div>
                            </td>
                            <td className="size-px whitespace-nowrap px-6 py-3">
                              <span className="text-sm text-gray-800 dark:text-white">
                                <AssetsList.Asset.ContentType />
                              </span>
                            </td>
                            <td className="size-px whitespace-nowrap px-6 py-3">
                              <span className="text-sm text-gray-800 dark:text-white">
                                <AssetsList.Asset.DataAddress.Name />
                              </span>
                            </td>
                            <td className="size-px whitespace-nowrap px-6 py-3">
                              <span className="text-sm text-gray-800 dark:text-white">
                                <AssetsList.Asset.DataAddress.Type />
                              </span>
                            </td>
                            <td className="size-px whitespace-nowrap px-6 py-3">
                              <span className="text-sm text-gray-800 dark:text-white">
                                <AssetsList.Asset.DataAddress.MandatoryValue
                                  prefix="edc"
                                  name="baseUrl"
                                />
                              </span>
                            </td>
                          </tr>
                        </AssetsList.Asset>
                      )}
                    </AssetsList.Items>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AssetsList.Loading />
    </AssetsList>
  );
}
