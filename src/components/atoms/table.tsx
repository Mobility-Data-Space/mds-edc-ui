import clsx from "clsx";
import {
  BaseHTMLAttributes,
  PropsWithChildren,
  TableHTMLAttributes,
} from "react";

interface TableProps extends TableHTMLAttributes<HTMLTableElement> {}

export function Table(
  { children, className, ...rest }: PropsWithChildren<TableProps>,
) {
  return (
    <div className="overflow-x-auto">
      <table
        {...rest}
        className={clsx("min-w-full divide-y divide-gray-200", className)}
      >
        {children}
      </table>
    </div>
  );
}

interface TableSectionProps
  extends BaseHTMLAttributes<HTMLTableSectionElement> {}

function TableHead(
  { children, className, ...rest }: PropsWithChildren<TableSectionProps>,
) {
  return (
    <thead {...rest} className={clsx("bg-gray-50", className)}>
      {children}
    </thead>
  );
}
Table.Head = TableHead;

interface TableCellProps extends BaseHTMLAttributes<HTMLTableCellElement> {}

Table.Heading = function TableHeading(
  { children, className, ...rest }: PropsWithChildren<TableCellProps>,
) {
  return (
    <th
      scope="col"
      className={clsx(
        "px-6 py-3 text-start whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-gray-800",
        className,
      )}
      {...rest}
    >
      {children}
    </th>
  );
};

Table.Body = function TableBody(
  { children, className, ...rest }: PropsWithChildren<TableSectionProps>,
) {
  return (
    <tbody
      className={clsx(
        "divide-y divide-gray-200",
        className,
      )}
      {...rest}
    >
      {children}
    </tbody>
  );
};

interface TableRowProps extends BaseHTMLAttributes<HTMLTableRowElement> {}

Table.Row = function TableBodyRow(
  { children, ...rest }: PropsWithChildren<
    TableRowProps
  >,
) {
  return <tr {...rest}>{children}</tr>;
};

Table.Cell = function TableBodyCell(
  { children, className, ...rest }: PropsWithChildren<TableCellProps>,
) {
  return (
    <td
      className={clsx(
        "size-px whitespace-nowrap px-6 py-3 text-sm text-gray-800",
        className,
      )}
      {...rest}
    >
      {children}
    </td>
  );
};
