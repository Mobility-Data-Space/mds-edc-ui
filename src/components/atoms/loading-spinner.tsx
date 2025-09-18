interface LoadingSpinnerProps {
    containerClassName?: string;
}

export function LoadingSpinner({ containerClassName = "" }: LoadingSpinnerProps) {
    return (
        <div className={`max-w-20 mx-auto mt-4 flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5 ${containerClassName}`}>
            <span
                className="animate-spin mx-auto inline-block size-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
                role="status"
                aria-label="loading"
            >
                <span className="sr-only">Loading...</span>
            </span>
        </div>
    );
}


