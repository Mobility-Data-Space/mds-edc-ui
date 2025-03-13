import { USE_CASES } from "@/constants/use-cases";
import { useConnectorDashboardState } from "@/hooks/use-connector-dashboard-state";
import { T } from "@/i18n";
import { Menu } from "@headlessui/react";
import { ChevronDown, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { Select } from "../atoms/select";
import { ConnectorStatus } from "../organisms/connector-status";

export function Wrapper({ children }: PropsWithChildren<{}>) {
  const router = useRouter();
  return (
    <>
      <header className=" fixed top-0 inset-x-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-white border-b border-gray-200 text-sm py-2 sm:py-0">
        <nav
          className="relative w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between"
          aria-label="Global"
        >
          <div className="flex items-center justify-between">
            <Link
              className="flex-none text-xl font-semibold"
              href="/"
              aria-label="Brand"
            >
              Brand
            </Link>
          </div>
          <div
            id="navbar-collapse-with-animation"
            className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block"
          >
            <div className="flex flex-col gap-y-4 gap-x-0 sm:flex-row sm:items-center sm:justify-end sm:gap-y-0 sm:gap-x-7 sm:mt-0 sm:ps-7">
              <a
                className="flex items-center gap-x-2 font-medium text-gray-500 hover:text-blue-600 sm:border-s sm:border-gray-300 sm:my-4 sm:ps-6"
                href="#"
              >
                <User className="w-8 h-4" />
                <T string="logIn" global />
              </a>
            </div>
          </div>
        </nav>
      </header>

      <main id="content">
        <div className="mx-auto">
          {children}
        </div>
      </main>

      <footer className="fixed bg-white bottom-0 w-full z-50 border-t border-gray-200">
        <Select
          unstyled
          id="lang"
          name="lang"
          aria-label="Select a language"
          onChange={(event) => {
            router.push(router.asPath, router.asPath, {
              locale: event.target.value,
            });
          }}
          value={router.locale}
          options={(router.locales ?? []).map((l) => ({
            text: l.toUpperCase(),
            value: l.toLowerCase(),
          }))}
        />
      </footer>
    </>
  );
}
