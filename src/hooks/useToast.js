import { useSnackbar } from 'notistack';

const useToast = () => {
  const { enqueueSnackbar } = useSnackbar();

  const toastSuccess = (msg, options = {}) => {
    enqueueSnackbar(msg, { variant: 'success', ...options });
  };

  const toastError = (msg, options = {}) => {
    enqueueSnackbar(msg, { variant: 'error', ...options });
  };

  const toastInfo = (msg, options = {}) => {
    enqueueSnackbar(msg, { variant: 'info', ...options });
  };

  return {
    toastSuccess,
    toastError,
    toastInfo
  };
};

export default useToast;
