import { T } from "@/i18n";
import { Search } from "lucide-react";
import { List } from "../../../vendors/think-it-labs/edc-connector-ui/src/list";
import { SearchSpec } from "../../../vendors/think-it-labs/edc-connector-ui/src/types";

interface SearchBarProps {
    placeholder: string;
    searchTarget: string;
    searchOperator: SearchSpec["operator"]
}

export default function SearchBar({ placeholder, searchTarget, searchOperator }: SearchBarProps) {
    return (
        <div className="relative flex rounded-lg shadow-sm">
            <List.Search
                data-testid="search-input"
                className="py-[15px] px-4 ps-11 block w-full border border-black/25 hover:border-black rounded-s-sm text-md focus:z-10 focus:outline-black focus:ring-black disabled:opacity-50 disabled:pointer-events-none"
                placeholder={placeholder}
                searchOperation={searchOperator}
                searchTarget={searchTarget}
            />
            <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
                <Search className="size-5" />
            </div>
            <List.SearchTrigger
                data-testid="search-trigger"
                className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-black bg-[#ffff26] text-sm font-semibold rounded-e-md border border-transparent  hover:bg-yellow-300 disabled:opacity-50 disabled:pointer-events-none">
                <T global string="search" />
            </List.SearchTrigger>
        </div>
    );
}