import { useConnectorDashboardState } from "@/hooks/use-connector-dashboard-state";
import clsx from "clsx";
import {
  Boxes,
  Gauge,
  Handshake,
  ReceiptText,
  Ruler,
  SmartphoneNfc,
  Store,
  Truck,
} from "lucide-react";
import PostAddIcon from '@mui/icons-material/PostAdd';
import Link from "next/link";
import { PropsWithChildren } from "react";
import { Wrapper } from "./wrapper";

export function ConnectorDashboard({ children }: PropsWithChildren<{}>) {
  const { connector } = useConnectorDashboardState();

  if (!connector) {
    return "No connector";
  }

  return (
    <Wrapper>
      <div className="flex flex-row">
        <div className="
    fixed inset-y-0 start-0
    bg-white border-e border-gray-200
    lg:block lg:end-auto lg:bottom-0
   ">
          <nav
            className="flex pt-16 flex-col flex-wrap"
            data-hs-accordion-always-open
          >
            <ul className="space-y-1.5 py-2">
              <li>
                <Link
                  href={`/`}
                  title="Overview"
                  className="flex items-center py-2 px-4 text-sm text-neutral-700 rounded-lg hover:bg-gray-100"
                >
                  <Gauge className="w-6 h-6" />
                  <span className="sr-only">Overview</span>
                </Link>
              </li>
              <li>
                <hr className="border-gray-200 my-4 mx-3" />
              </li>
              <li>
                <Link
                  href={`/assets`}
                  title="Assets"
                  className="flex items-center py-2 px-4 text-sm text-neutral-700 rounded-lg hover:bg-gray-100"
                >
                  <Boxes className="w-6 h-6" />
                  <span className="sr-only">Assets</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/policy-definitions`}
                  title="Policy definitions"
                  className="flex items-center py-2 px-4 text-sm text-neutral-700 rounded-lg hover:bg-gray-100"
                >
                  <Ruler className="w-6 h-6" />
                  <span className="sr-only">Policy definitions</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/contract-definitions`}
                  title="Contract definitions"
                  className="flex items-center py-2 px-4 text-sm text-neutral-700 rounded-lg hover:bg-gray-100"
                >
                  <ReceiptText className="w-6 h-6" />
                  <span className="sr-only">Contract definitions</span>
                </Link>
              </li>
              <li>
                <hr className="border-gray-200 my-4 mx-3" />
              </li>
              <li>
                <Link
                  href={`/create-asset`}
                  title="Data offer"
                  className="flex items-center py-2 px-4 text-sm text-neutral-700 rounded-lg hover:bg-gray-100"
                >
                  <PostAddIcon className="w-6 h-6" />
                  <span className="sr-only">Data offer</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/catalog`}
                  title="Catalog"
                  className="flex items-center py-2 px-4 text-sm text-neutral-700 rounded-lg hover:bg-gray-100"
                >
                  <Store className="w-6 h-6" />
                  <span className="sr-only">Catalog</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/contract-agreements`}
                  title="Contract agreements"
                  className="flex items-center py-2 px-4 text-sm text-neutral-700 rounded-lg hover:bg-gray-100"
                >
                  <Handshake className="w-6 h-6" />
                  <span className="sr-only">Contract agreements</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/contract-negotiations`}
                  title="Contract negotiations"
                  className="flex items-center py-2 px-4 text-sm text-neutral-700 rounded-lg hover:bg-gray-100"
                >
                  <SmartphoneNfc className="w-6 h-6" />
                  <span className="sr-only">Contract negotiations</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/transfer-processes`}
                  title="Transfer processes"
                  className="flex items-center py-2 px-4 text-sm text-neutral-700 rounded-lg hover:bg-gray-100"
                >
                  <Truck className="w-6 h-6" />
                  <span className="sr-only">Transfer processes</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="w-full pt-10 px-4 sm:px-6 md:px-8 lg:ps-24">
          <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
            <div className="flex flex-col">
              <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

ConnectorDashboard.Body = function ConnectorDashboardBody(
  { children }: PropsWithChildren<{}>,
) {
  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ConnectorDashboard.Section = function ConnectorDashboardSection(
  { className, ...rest }: PropsWithChildren<{ className?: string }>,
) {
  return (
    <div
      className={clsx(
        "px-6 py-4 border-b border-gray-200",
        className,
      )}
      {...rest}
    />
  );
};

ConnectorDashboard.Title = function ConnectorDashboardDescription(
  { children, className = '' }: PropsWithChildren<{ className?: string }>,
) {
  return (
    <h2 className={`text-xl font-bold text-gray-800 ${className}`}>
      {children}
    </h2>
  );
};

ConnectorDashboard.Description = function ConnectorDashboardDescription(
  { children }: PropsWithChildren<{}>,
) {
  return (
    <p className="text-sm text-gray-600 mb-2">
      {children}
    </p>
  );
};
