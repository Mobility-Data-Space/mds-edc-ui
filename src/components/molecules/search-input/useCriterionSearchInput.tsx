import { CriterionInput } from "@think-it-labs/edc-connector-client";
import { useState, useEffect } from "react";

type UseCriterionSearchProps = {
  searchTerm: string;
  operandLeft: string | string[];
  operator: CriterionInput["operator"];
};

export const useCriterionSearchInput = (props: UseCriterionSearchProps) => {
  const { searchTerm, operandLeft, operator } = props;
  const [searchCriteria, setSearchCriteria] = useState<CriterionInput[]>([]);

  useEffect(() => {
    function listenForSearchChange() {
      if (searchTerm) {
        const operandRight =
          operator === "ilike" ? `%${searchTerm}%` : searchTerm;

        const opLeft = Array.isArray(operandLeft) ? operandLeft : [operandLeft];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSearchCriteria(
          opLeft.map((item) => ({ operandLeft: item, operator, operandRight })),
        );
      } else {
        setSearchCriteria([]);
      }
    }

    listenForSearchChange();
  }, [operandLeft, operator, searchTerm]);

  return searchCriteria;
};
