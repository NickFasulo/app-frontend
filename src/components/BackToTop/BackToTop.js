import { useAppUtils } from '../../contexts/AppUtilsContext';
import { Button, styled } from '@mui/material';
import IconTop from '@mui/icons-material/ArrowUpward';
import useDevice from '../../hooks/useDevice';

const BackToTopButton = styled(Button)(({ theme }) => ({
  minWidth: 0,
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  color: theme.palette.M900,
  [theme.breakpoints.down('md')]: {
    width: 50,
    height: 50,
    borderRadius: '100%'
  }
}));

const BackToTop = () => {
  const { isDesktop } = useDevice();
  const { windowScrolled } = useAppUtils();

  if (!windowScrolled) return null;

  const handleGoToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <BackToTopButton
        startIcon={isDesktop && <IconTop />}
        variant="contained"
        color="inherit"
        sx={{
          width: 'auto'
        }}
        onClick={handleGoToTop}
      >
        {isDesktop ? 'back to top' : <IconTop />}
      </BackToTopButton>
    </>
  );
};

export default BackToTop;
