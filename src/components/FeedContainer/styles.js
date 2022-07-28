import { styled } from '@mui/material';
import Image from 'next/image';

export const HeaderRoot = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 0, 3, 0),
  [theme.breakpoints.down('md')]: {
    paddingLeft: theme.spacing(3)
  }
}));

export const HeaderImageWrapper = styled('div')(({ theme, isMinimize }) => ({
  marginRight: theme.spacing(2),
  width: `${!isMinimize ? 90 : 45}px;`,
  [theme.breakpoints.down('sm')]: {
    width: `${!isMinimize ? 80 : 40}px;`
  }
}));

export const HeaderImage = styled(Image)(({ theme }) => ({
  borderRadius: '15%'
}));
