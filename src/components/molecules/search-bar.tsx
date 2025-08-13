import { T } from "@/i18n";
import { Input } from "@/components/atoms/input";
import { List, useListContext } from "../../../vendors/think-it-labs/edc-connector-ui/src/list";
import { SearchSpec } from "../../../vendors/think-it-labs/edc-connector-ui/src/types";
import { Button, Icon } from "@mui/material";
import React, { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/router";

interface SearchBarProps {
  placeholder: string;
  searchTarget: string | string[];
  searchOperator: SearchSpec["operator"]
}

export default function SearchBar({ placeholder, searchTarget, searchOperator }: SearchBarProps) {
  const { query, push } = useRouter()

  const { searchSpec, setSearchSpec, triggerSearch } = useListContext();

  const searchRef = useRef<HTMLInputElement>(null)

  const searchQuery = query.q

  useEffect(() => {
    setSearchSpec({ operator: searchOperator, operandLeft: searchTarget, })
  }, [setSearchSpec, searchTarget, searchOperator])

  useEffect(() => {
    setSearchSpec({ operandRight: searchQuery })
  }, [searchQuery, setSearchSpec])

  const handleSearch = useCallback(() => { // TODO: use useUpdateQueryParams when merged
    if (searchRef.current) {
      push({
        href: window.location.href,
        query: {
          ...query,
          q: searchRef.current.value,
          page: 0
        }
      })
    }
  }, [push, query])

  return (
    <div className="relative flex rounded-lg h-full" >
      <Input
        className="!pr-0 rounded"
        ref={searchRef}
        placeholder={placeholder}
        value={searchSpec.operandRight}
        onChange={(event) => setSearchSpec({ operandRight: event.currentTarget.value })}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleSearch()
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
              <span
                onClick={() => handleSearch()}
              >
                <T global string="search" />
              </span>
            </Button>
          },
        }}
      />
    </div>
  );
}
