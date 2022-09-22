import { useTheme } from '@mui/styles';
import { useMediaQuery } from '@mui/material';

const useDevice = () => {
  const theme = useTheme();

  return {
    isTiny: useMediaQuery(theme.breakpoints.down('sm')),
    isMobile: useMediaQuery(theme.breakpoints.down('md')),
    isTinyDesktop: useMediaQuery(theme.breakpoints.down('lg')),
    isDesktop: useMediaQuery(theme.breakpoints.up('md'))
  };
};

export default useDevice;
