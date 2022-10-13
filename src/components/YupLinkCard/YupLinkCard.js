import { styled, Typography } from '@mui/material';
import Link from '../Link';

const CardRoot = styled('div')(({ theme }) => ({
  position: 'relative',
  backgroundColor: `${theme.palette.M900}88`,
  padding: theme.spacing(2, 3),
  overflow: 'hidden',
  borderRadius: 16,
  [theme.breakpoints.up('lg')]: {
    minHeight: 160
  }
}));

const CardImage = styled('img')(({ theme }) => ({
  position: 'absolute',
  top: 20,
  right: 0,
  opacity: 0.5,
  maxWidth: '35%'
}));

export default function YupLinkCard({ to, title, description, image }) {
  return (
    <Link href={to}>
      <CardRoot>
        <Typography variant="h5" gutter>
          {title}
        </Typography>
        <Typography variant="body2">{description}</Typography>
        <CardImage src={image} alt={title} />
      </CardRoot>
    </Link>
  );
}
