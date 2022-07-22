import { Box, styled } from '@mui/material';
import Image from 'next/image';
import { PageBody } from '../../_pages/pageLayouts';

export const ContainerRoot = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  maxWidth: '100vw',
  overflowY: 'hidden'
}));

export const PageContainer = styled(PageBody)(({ theme }) => ({
  width: '100%',
  overflowX: 'hidden',
  [theme.breakpoints.down('md')]: {
    backgroundSize: 'contain'
  }
}));

export const FeedWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    marginLeft: '0%',
    padding: '0%'
  }
}));

export const HeaderRoot = styled('div')(({ theme, isMinimize }) => ({
  width: '600px',
  margin: '0 auto',
  position: 'relative',
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
