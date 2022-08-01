import {
  Box,
  LinearProgress,
  linearProgressClasses,
  styled
} from '@mui/material';
import { useEffect, useState } from 'react';

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: 'transparent'
  },
  [`& .${linearProgressClasses.bar}`]: {
    background: `linear-gradient(270deg, #00E08E -2.12%, #A2CF7E 22.97%, #F0C909 49.29%, #FCA016 74.88%, #EB3650 100%)`
  }
}));

const PageLoadingBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setProgress((oldProgress) =>
        Math.min(oldProgress + Math.random() * 10, 98)
      );
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box position="fixed" top={0} left={0} right={0} zIndex={1500}>
      <StyledLinearProgress variant="determinate" value={progress} />
    </Box>
  );
};

export default PageLoadingBar;
