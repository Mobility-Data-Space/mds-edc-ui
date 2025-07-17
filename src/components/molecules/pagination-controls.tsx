import {Icon, IconButton} from '@mui/material';
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
    const firstItemIndex = page ? maxItems * page + 1 : 1
    const lastItemIndex = page ? page * maxItems + itemsCount : itemsCount

    if (!itemsCount) {
        return <></>
    }

    return (
        <div className="flex items-center">
            <h5 data-testid={`${dataTestIdPrefix}-info`}>
                {firstItemIndex}-{lastItemIndex}
            </h5>
            <div className="inline-flex float-right gap-x-2">
                <IconButton
                    onClick={decrementPage}
                    disabled={!hasPrev}
                    data-testid={`${dataTestIdPrefix}-prev`}
                    aria-label="Previous page"
                >
                    <Icon style={{ fontSize: "28px" }} >chevron_left</Icon>
                </IconButton>
                <IconButton
                    onClick={incrementPage}
                    disabled={!hasNext}
                    data-testid={`${dataTestIdPrefix}-next`}
                    aria-label="Next page"
                >
                    <Icon style={{ fontSize: "28px" }} >chevron_right</Icon>
                </IconButton>
            </div>
        </div>
    );
};

export default PaginationControls;
