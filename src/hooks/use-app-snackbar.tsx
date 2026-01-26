import { Snackbar, SnackbarType } from "@/components/molecules/snackbar";
import { useSnackbar } from "notistack";

type ShowSnackBarProps = {
  type: SnackbarType;
  message: string;
  details?: string;
  persist?: boolean;
  showDetails?: boolean;
  action?: React.ReactNode;
};
export function useAppSnackbar() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showSnackbar = ({
    type,
    message,
    details,
    persist = true,
    showDetails,
    action,
  }: ShowSnackBarProps) => {
    return enqueueSnackbar(message, {
      variant: type,
      persist: persist ?? false,
      content: (key) => (
        <Snackbar
          id={key as any}
          type={type}
          message={message}
          details={details}
          showDetails={showDetails}
          action={action}
          onClose={() => closeSnackbar(key)}
        />
      ),
    });
  };

  return { showSnackbar };
}
