import { Snackbar } from "@/components/molecules/snackbar";
import { useTranslator } from "@/i18n";
import { enqueueSnackbar, useSnackbar } from "notistack";

interface ErrorPopupProps {
    errorMessageKey: string;
    errors: Error[] | null;
}

export function ErrorPopup({ errorMessageKey, errors }: ErrorPopupProps) {
    const { translator } = useTranslator();
    const { closeSnackbar } = useSnackbar();

    if (errors && errors.length > 0) {
        errors.forEach(errorItem => {
            enqueueSnackbar(translator(errorMessageKey), {
                variant: "error",
                content: (key) => (
                    <Snackbar
                        type="error"
                        message={translator(errorMessageKey)}
                        details={errorItem.message || undefined}
                        onClose={() => { closeSnackbar(key); }}
                    />
                )
            });
        });
    }

    return null;
}
