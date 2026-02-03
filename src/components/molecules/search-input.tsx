import { T } from "@/i18n";
import { Input } from "@/components/atoms/input";
import { Button, Icon } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { CriterionInput } from "@think-it-labs/edc-connector-client";

type UseCriterionSearchProps = {
  searchTerm: string;
  operandLeft: string | string[];
  operator: CriterionInput["operator"];
};

export const useCriterionSearchInput = (props: UseCriterionSearchProps) => {
  const { searchTerm, operandLeft, operator } = props;
  const [searchCriteria, setSearchCriteria] = useState<CriterionInput[]>([]);

  useEffect(() => {
    if (searchTerm) {
      const operandRight =
        operator === "ilike" ? `%${searchTerm}%` : searchTerm;

      const opLeft = Array.isArray(operandLeft)? operandLeft : [operandLeft];
      setSearchCriteria(opLeft.map(item=> ({ operandLeft: item, operator, operandRight })));
    } else {
      setSearchCriteria([]);
    }
  }, [searchTerm]);

  return searchCriteria;
};
interface SearchInputProps {
  placeholder: string;
}

export default function SearchInput({ placeholder }: SearchInputProps) {
  const { query, replace } = useRouter();
  const [searchTerm, setSearchTerm] = useState(query.q);

  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(() => {
    // TODO: use useUpdateQueryParams when merged
    if (searchRef.current) {
      replace({
        query: {
          ...query,
          q: searchRef.current.value,
          page: 0,
        },
      });
    }
  }, [replace, query]);

  return (
    <div className="relative flex rounded-lg h-full">
      <Input
        className="!pr-0 rounded"
        ref={searchRef}
        placeholder={placeholder}
        value={searchTerm}
        onChange={(event) => {
          setSearchTerm(event.target.value);

          if (event.target.value === "") {
            handleSearch();
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleSearch();
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
                className="gap-x-2 font-medium h-full hover:cursor-pointer"
                style={{
                  borderTopRightRadius: 4,
                  borderBottomRightRadius: 4,
                  boxShadow:
                    "0px 0px 1px -2px rgba(0,0,0,0.2),0px 0px 2px 0px rgba(0,0,0,0.14),0px 0px 5px 0px rgba(0,0,0,0.12)",
                }}
                onClick={() => handleSearch()}
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
