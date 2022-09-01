import { Typography } from '@mui/material';
import { LeaderboardItemTitleRoot } from './styles';
import { webAppUrl } from '../../config';
import { TruncateText } from '../styles';

function LeaderboardItemTitle({ url, title }) {
  return (
    <LeaderboardItemTitleRoot
      href={url}
      target={url?.startsWith(webAppUrl) ? '' : '_blank'}
    >
      <TruncateText variant="h5" align="left" lines={1}>
        {title}
      </TruncateText>
    </LeaderboardItemTitleRoot>
  );
}

export default LeaderboardItemTitle;
