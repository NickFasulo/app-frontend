import { LinearProgress } from '@mui/material';
import { useState } from 'react';

const PageLoader = () => {
  const [progress, setProgress] = useState(0);

  return (
    <>
      <LinearProgress />
    </>
  );
};

export default PageLoader;
