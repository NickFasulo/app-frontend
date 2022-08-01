import {
  Box,
  Drawer as MuiDrawer,
  Fab,
  ListItemButton,
  Skeleton,
  styled
} from '@mui/material';

export const Drawer = styled(MuiDrawer)(({ theme, open }) => ({
  position: 'fixed',
  top: theme.spacing(2),
  left: theme.spacing(2),
  bottom: theme.spacing(2),
  zIndex: 1200,
  ...(!open && {
    width: 56,
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  }),
  ...(open && {
    width: 170,
    right: theme.spacing(2),
    '& .MainLink .MuiListItemIcon-root': {
      width: 20
    },
    [theme.breakpoints.down('md')]: {
      width: 'auto',
      '& .MainLink svg': {
        height: 20
      },
      '& .FeedLink .MuiTypography-bodyS2': {
        fontSize: 15
      }
    }
  }),
  '& .MainLink': {
    height: 40
  },
  '& .LogoLink': {
    height: 50
  },
  '& .MuiDrawer-paper': {
    position: 'relative',
    width: '100%',
    height: '100%',
    visibility: 'visible !important',
    transform: 'none !important',
    padding: theme.spacing(3.5, 1.5),
    background: `${theme.palette.M850}66`,
    border: `solid 1px ${theme.palette.M750}66`,
    borderRadius: 12,
    backdropFilter: 'blur(25px)',
    [theme.breakpoints.down('xs')]: {
      background: `${theme.palette.M850}AA`,
      border: `solid 1px ${theme.palette.M750}AA`
    },
    rowGap: theme.spacing(5)
  }
}));

export const DrawerLogo = styled('img')(({ theme }) => ({
  width: 26,
  height: 26
}));

Drawer.defaultProps = {
  variant: 'persistent'
};

export const ExternalLinkList = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
  '& > a::after': {
    content: '","',
    color: theme.palette.M500
  }
}));

export const ExternalLinkA = styled('a')(({ theme }) => ({
  textDecorationLine: 'underline',
  textDecorationColor: theme.palette.M500
}));

export const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  left: theme.spacing(3),
  bottom: theme.spacing(3),
  backgroundColor: `${theme.palette.M800}A6`,
  border: `solid 1px ${theme.palette.M750}`,
  zIndex: 1150,
  '& img': {
    width: 45
  }
}));

export const MenuItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(1)
}));
