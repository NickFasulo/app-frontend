import { styled } from '@mui/material';
import { YupContainer } from '../styles';

export const TabsContainer = styled(YupContainer)(({ theme }) => ({
  paddingTop: 0,
  [theme.breakpoints.down('md')]: {
    paddingLeft: 0,
    paddingRight: 0
  }
}));
