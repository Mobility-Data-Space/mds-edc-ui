interface ListPropsBase {
  shouldFetch?: boolean
}

interface ListPropsWithoutPagination extends ListPropsBase {
  usePagination?: false;
}

interface ListPropsWithPagination extends ListPropsBase {
  usePagination: true;
  currentPage: number;
  firstPage?: number;
  navigate: (newPage: number) => void;
}

export type ListProps =
  | ListPropsWithoutPagination
  | ListPropsWithPagination;

export interface SearchSpec {
  operandLeft: string | string[]
  operator: "=" | "!=" | "in" | "like" | "ilike" | "contains"
  operandRight: string | string[]
}
