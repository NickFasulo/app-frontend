import { ListItemButton, styled } from '@mui/material';

export const NotificationItemRoot = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(2.5),
  background: `${theme.palette.M850}88`,
  border: `1.5px solid ${theme.palette.M700}22`,
  borderRadius: theme.shape.borderRadius * 2,
  marginBottom: theme.spacing(2)
}));
