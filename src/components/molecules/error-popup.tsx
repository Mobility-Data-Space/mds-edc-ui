import { Snackbar } from "@/components/molecules/snackbar";
import { useAppSnackbar } from "@/hooks/use-app-snackbar";
import { useTranslator } from "@/i18n";

interface ErrorPopupProps {
    errorMessageKey: string;
    errors: Error[] | null;
}

export function ErrorPopup({ errorMessageKey, errors }: ErrorPopupProps) {
    const { translator } = useTranslator();
    const {showSnackbar} = useAppSnackbar();
    if (errors && errors.length > 0) {
        errors.forEach(errorItem => {

            const message = translator(errorMessageKey);
            showSnackbar({
                type: "error",
                message,
                details: errorItem.message || undefined,
                persist: true
            })
        });
    }

    return null;
}
