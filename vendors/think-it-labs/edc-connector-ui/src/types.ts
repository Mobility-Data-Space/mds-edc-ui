interface ListPropsBase {
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
  operandLeft: string
  operator: "=" | "!=" | "in" | "like" | "ilike" | "contains"
  operandRight: string | string[]
}
