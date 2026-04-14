import { T } from "@/i18n";
import { Input } from "@/components/atoms/input";
import { Button, Icon } from "@mui/material";
import { SyntheticEvent, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useListContext } from "@think-it-labs/edc-connector-ui/list";

interface SearchBarProps {
  placeholder: string;
  searchTarget: string | string[];
  searchOperator: "=" | "!=" | "in" | "like" | "ilike" | "contains";
}

export default function SearchBar({
  placeholder,
  searchTarget,
  searchOperator,
}: SearchBarProps) {
  const { query, push, pathname } = useRouter();

  const { searchSpec, setSearchSpec } = useListContext();

  const searchRef = useRef<HTMLInputElement>(null);

  const searchQuery = query.q;

  useEffect(() => {
    setSearchSpec({ operator: searchOperator, operandLeft: searchTarget });
  }, [setSearchSpec, searchTarget, searchOperator]);

  useEffect(() => {
    if (typeof searchQuery === "string") {
      setSearchSpec({ operandRight: searchQuery });
    }
  }, [searchQuery, setSearchSpec]);

  const handleSearch = useCallback((event: SyntheticEvent) => {
    event.preventDefault();
    // TODO: use useUpdateQueryParams when merged
    if (searchRef.current) {
      push(
        {
          pathname,
          query: {
            ...query,
            q: searchRef.current.value,
            page: 0,
          },
        },
        undefined,
        { shallow: true },
      );
    }
  }, [pathname, push, query]);

  return (
    <div className="relative flex rounded-lg h-full">
      <Input
        className="!pr-0 rounded"
        ref={searchRef}
        placeholder={placeholder}
        value={searchSpec.operandRight}
        onChange={(event) =>
          setSearchSpec({ operandRight: event.currentTarget.value })
        }
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleSearch(event);
          }
        }}
        slotProps={{
          input: {
            className: "!pr-0 h-full",
            startAdornment: <Icon className="size-5">search</Icon>,
            endAdornment: (
              <Button
                data-testid="search-trigger"
                variant="contained"
                type="button"
                className="gap-x-2 font-medium h-full hover:cursor-pointer"
                style={{
                  borderTopRightRadius: 4,
                  borderBottomRightRadius: 4,
                  boxShadow:
                    "0px 0px 1px -2px rgba(0,0,0,0.2),0px 0px 2px 0px rgba(0,0,0,0.14),0px 0px 5px 0px rgba(0,0,0,0.12)",
                }}
                onClick={(e) => handleSearch(e)}
              >
                <span>
                  <T global string="search" />
                </span>
              </Button>
            ),
          },
        }}
      />
    </div>
  );
}
