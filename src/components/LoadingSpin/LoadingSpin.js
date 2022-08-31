import { CircularProgress } from '@mui/material';
import { FlexBox } from '../styles';

function LoadingSpin() {
  return (
    <FlexBox justifyContent="center">
      <CircularProgress />
    </FlexBox>
  );
}

export default LoadingSpin;
