import { T } from "@/i18n";
import {Input} from "@/components/atoms/input";
import {List, useListContext} from "../../../vendors/think-it-labs/edc-connector-ui/src/list";
import { SearchSpec } from "../../../vendors/think-it-labs/edc-connector-ui/src/types";
import {Button, Icon, IconButton, Tooltip} from "@mui/material";
import React, {useEffect} from "react";
import {InfoOutlined} from "@mui/icons-material";

interface SearchBarProps {
    placeholder: string;
    searchTarget: string;
    searchOperator: SearchSpec["operator"]
}

export default function SearchBar({ placeholder, searchTarget, searchOperator }: SearchBarProps) {
  const { searchSpec, setSearchSpec, triggerSearch } = useListContext();

  useEffect(() => {
    setSearchSpec({ operator: searchOperator, operandLeft: searchTarget })
  }, [setSearchSpec, searchTarget, searchOperator])

    return (
      <div className="relative flex rounded-lg h-full" >
        <Input
          className="!pr-0 rounded"
          placeholder={placeholder}
          value={searchSpec.operandRight}
          onChange={(event) => setSearchSpec({operandRight: event.currentTarget.value})}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              triggerSearch();
            }
          }}
          slotProps={{
            input: {
              className: "!pr-0 h-full",
              startAdornment: <Icon className="size-5">search</Icon>,
              endAdornment: <Button
                data-testid="search-trigger"
                variant="contained"
                className="gap-x-2 font-medium h-full hover:cursor-pointer"
                style={{
                  borderTopRightRadius: 4,
                  borderBottomRightRadius: 4,
                  boxShadow: "0px 0px 1px -2px rgba(0,0,0,0.2),0px 0px 2px 0px rgba(0,0,0,0.14),0px 0px 5px 0px rgba(0,0,0,0.12)",
                }}
              >
                <List.SearchTrigger>
                  <T global string="search"/>
                </List.SearchTrigger>
              </Button>
            },
          }}
        />
      </div>
    );
}
