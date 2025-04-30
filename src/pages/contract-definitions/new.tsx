import { Button } from "@/components/atoms/button";
import { ConnectorDashboard } from "@/components/templates/connector-dashboard";
import {
  ContractDefinitionForm,
} from "@think-it-labs/edc-connector-ui/contract-definition-form";
import { useConnectorDashboardState } from "@/hooks/use-connector-dashboard-state";
import { T } from "@/i18n";
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import React, { useState } from "react";
import SideDrawer from "@/components/organisms/side-drawer.tsx";

function Policy() {
  // const [selected, setSelected] = useState(people[0]);
  const [query, setQuery] = useState("");
  // const filteredPeople = query === ""
  //   ? people
  //   : people.filter((person) =>
  //     person.name
  //       .toLowerCase()
  //       .replace(/\s+/g, "")
  //       .includes(query.toLowerCase().replace(/\s+/g, ""))
  // );

  return (
//    <Combobox value={selected} onChange={setSelected}>
    <Combobox>
      <div className="relative mt-1">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
          <Combobox.Input
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
            // displayValue={(person) => person.name}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronsUpDown
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>

        <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden sm:text-sm">
          {
            /* {filteredPeople.length === 0 && query !== ""
              ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nothing found.
                </div>
              )
              : (
                filteredPeople.map((person) => (
                  <Combobox.Option
                    key={person.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-teal-600 text-white" : "text-gray-900"
                      }`}
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {person.name}
                        </span>
                        {selected
                          ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? "text-white" : "text-teal-600"
                              }`}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          )
                          : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )} */
          }
        </Combobox.Options>
      </div>
    </Combobox>
  );
}

export default function CreateAssetPage() {
  const { push, connector } = useConnectorDashboardState();
  const managementUrl = connector?.managementUrl as string;
  return (
    <SideDrawer title={<T string="contractDefinitions.new.title" />}>
      <ContractDefinitionForm managementUrl={managementUrl}>
        <ConnectorDashboard.Section>
        </ConnectorDashboard.Section>

        <ConnectorDashboard.Section className="flex justify-between">
          <Button
            variant="secondary"
            onClick={() => push("/contract-definitions")}
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
      </ContractDefinitionForm>
    </SideDrawer>
  );
}
