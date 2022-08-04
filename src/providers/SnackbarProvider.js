import { SnackbarProvider as NotistackProvider } from 'notistack';
import { makeStyles } from '@mui/styles';

// TODO: Convert to Mui v5 styling
const useSnackbarStyles = makeStyles((theme) => ({
  snackbar: {
    backgroundColor: `${theme.palette.M100} !important`,
    color: `${theme.palette.M900} !important`
  }
}));

const SnackbarProvider = ({ children }) => {
  const classes = useSnackbarStyles();

  return (
    <NotistackProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      classes={{
        variantError: classes.snackbar,
        variantSuccess: classes.snackbar,
        variantInfo: classes.snackbar,
        variantWarning: classes.snackbar
      }}
    >
      {children}
    </NotistackProvider>
  );
};

export default SnackbarProvider;
