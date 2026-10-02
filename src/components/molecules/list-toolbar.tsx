import React, { ReactNode } from "react";

interface ListToolbarProps {
  search: ReactNode;
  actions?: ReactNode;
  pagination: ReactNode;
}

export function ListToolbar({ search, actions, pagination }: ListToolbarProps): React.ReactElement {
  return (
    <div className="flex justify-between pb-6">
      <div className="flex justify-start gap-x-5 items-center">
        <div className="min-w-xl h-full">{search}</div>
        {actions && <div className="flex gap-x-4">{actions}</div>}
      </div>
      <div className="flex justify-end items-center">{pagination}</div>
    </div>
  );
}
