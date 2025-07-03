import { IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface PaginationControlsProps {
    page: number;
    hasPrev: boolean;
    hasNext: boolean;
    decrementPage: () => void;
    incrementPage: () => void;
    itemsCount: number;
    maxItems: number
    dataTestIdPrefix?: string;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
    page,
    hasPrev,
    hasNext,
    decrementPage,
    incrementPage,
    itemsCount,
    maxItems,
    dataTestIdPrefix = "pagination"
}) => {
    const firstPageItemIndex = page ? maxItems * page + 1 : 1
    return (
        <div className="flex items-center">
            <h5 data-testid={`${dataTestIdPrefix}-info`}>
                {firstPageItemIndex}-{itemsCount}
            </h5>
            <div className="inline-flex float-right gap-x-2">
                <IconButton
                    onClick={decrementPage}
                    disabled={!hasPrev}
                    data-testid={`${dataTestIdPrefix}-prev`}
                    aria-label="Previous page"
                >
                    <ChevronLeft className="size-6" />
                </IconButton>
                <IconButton
                    onClick={incrementPage}
                    disabled={!hasNext}
                    data-testid={`${dataTestIdPrefix}-next`}
                    aria-label="Next page"
                >
                    <ChevronRight className="size-6" />
                </IconButton>
            </div>
        </div>
    );
};

export default PaginationControls;
