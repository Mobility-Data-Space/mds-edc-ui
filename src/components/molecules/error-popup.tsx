import { Snackbar } from "@/components/molecules/snackbar";
import { useAppSnackbar } from "@/hooks/use-app-snackbar";
import { useTranslator } from "@/i18n";
import { useEffect } from "react";

interface ErrorPopupProps {
  errorMessageKey: string;
  errors: Error[] | null;
}

export function ErrorPopup({ errorMessageKey, errors }: ErrorPopupProps) {
  const { translator } = useTranslator();
  const { showSnackbar } = useAppSnackbar();
  useEffect(() => {
    console.log('errors==.', errors)
    if (errors && errors.length > 0) {
      console.log("Running", errors.length)
      errors.forEach((errorItem) => {
        const message = translator(errorMessageKey);
        showSnackbar({
          type: "error",
          message,
          details: errorItem.message || undefined,
          persist: true,
        });
      });
    }
  }, [errorMessageKey, errors, showSnackbar, translator]);

  return null;
}
