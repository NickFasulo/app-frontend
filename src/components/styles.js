import {
  Avatar,
  Box,
  Button,
  Container,
  Menu,
  styled,
  Typography
} from '@mui/material';
import CountUp from 'react-countup';
import { PROFILE_PICTURE_SIZE } from '../config';

export const FlexBox = styled(Box)(({ theme }) => ({
  display: 'flex'
}));

export const PageContainer = styled(Container)(({ theme }) => ({
  height: '100vh'
}));

export const PageLayout = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '100vh',
  width: '100vw',
  overflowX: 'hidden',
  overflowY: 'auto',
  paddingTop: 'var(--header-height)',
  display: 'flex',
  flexDirection: 'column',
  rowGap: theme.spacing(2)
}));

export const TruncateText = styled(Typography)(({ lines }) =>
  lines
    ? {
        overflow: 'hidden',
        display: '-webkit-box',
        textOverflow: 'ellipsis',
        '-webkit-box-orient': 'vertical',
        '-webkit-line-clamp': `${lines || 1}`
      }
    : null
);

export const YupMenu = styled(Menu)(({ theme }) => ({
  '& svg': {
    marginRight: theme.spacing(1.5)
  }
}));

export const YupContainer = styled(Box)(({ theme, visible }) => ({
  position: 'relative',
  padding: `${theme.spacing(1.5)} ${theme.spacing(1.5)} 0 ${theme.spacing(
    1.5
  )}`,
  marginLeft: 'auto',
  marginRight: 'auto',
  [theme.breakpoints.down('md')]: {
    width: '100%'
  },
  [theme.breakpoints.only('md')]: {
    width: 800
  },
  [theme.breakpoints.only('lg')]: {
    width: 1050
  },
  [theme.breakpoints.only('xl')]: {
    width: 1232
  }
}));

export const YupPageWrapper = styled('div')(({ theme }) => ({
  minHeight: '100vh'
}));

export const GradientTypography = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(270deg, #00E08E 0%, #A2CF7E 24.57%, #F0C909 50.35%, #FCA016 75.4%, #EB3650 100%)`,
  '-webkit-background-clip': 'text',
  '-webkit-text-fill-color': 'transparent',
  backgroundClip: 'text',
  textFillColor: 'transparent'
}));

export const ProfilePicture = styled(Avatar)(({ theme, border, size }) => {
  const _size = size || 'lg';
  const imageSize = PROFILE_PICTURE_SIZE[_size];
  const borderSize = _size === 'lg' ? 3 : 1;

  return {
    backgroundColor: theme.palette.M900,
    width: imageSize,
    height: imageSize,
    border: `solid ${borderSize}px ${border}`,
    fontSize: _size === 'lg' && 60
  };
});

export const ConnectionAvatar = styled(Avatar)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: '100%',
  backgroundColor: theme.palette.M900,
  fontFamily: 'Gilroy',
  fontWeight: '600',
  [theme.breakpoints.down('xl')]: {
    width: 50,
    height: 50
  },
  [theme.breakpoints.down('md')]: {
    width: 40,
    height: 40
  }
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  background: `${theme.palette.M100}10`
}));

ActionButton.defaultProps = {
  size: 'small',
  variant: 'default'
};

export const YupCountUp = styled(CountUp)(({ color, theme }) => ({
  marginRight: theme.spacing(0),
  color,
  fontSize: 24,
  width: '1.7rem',
  fontWeight: 700
}));

export const YupCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: 12,
  backgroundColor: `${theme.palette.M900}88`
}));
