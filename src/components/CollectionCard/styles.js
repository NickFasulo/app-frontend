import { styled } from '@mui/material';
import { FlexBox } from '../styles';
import { DEFAULT_IMAGE_PATH } from '../../utils/helpers';

export const CollectionCardRoot = styled('div')(({ theme }) => ({
  position: 'relative',
  height: 120,
  borderRadius: 12,
  overflow: 'hidden'
}));

export const CollectionOverlay = styled('div')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  background: `linear-gradient(to bottom, transparent 0%, ${theme.palette.M900}DD 50%, ${theme.palette.M900}EF 80%)`,
  border: `solid 1px ${theme.palette.M850}`,
  outline: `solid 1px ${theme.palette.M900}`
}));

export const CollectionCoverWrapper = styled('div')(() => ({
  position: 'absolute',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  background: `url(${DEFAULT_IMAGE_PATH})`
}));

export const CollectionContent = styled(FlexBox)(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  padding: theme.spacing(1.5)
}));
