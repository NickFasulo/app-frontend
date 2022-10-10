import { Typography } from '@mui/material';
import { FlexBox, GradientTypography, YupCountUp } from '../styles';
import { useAuth } from '../../contexts/AuthContext';
import { useYupAccount } from '../../hooks/queries';
import YupLogoEmoji from '../ProfileHeader/YupLogoEmoji';
import { formatDecimal } from '../../utils/helpers';
import { levelColors } from '../../utils/colors';

export default function HomePageUserHeader() {
  const { username } = useAuth();
  const { data: profile } = useYupAccount(username);

  if (!profile) return null;

  const { fullname, score, quantile, balance } = profile;
  const userColor = levelColors[quantile || 'none'];

  return (
    <FlexBox flexDirection="column" alignItems="center" sx={{ mt: 3, mb: 5 }}>
      <Typography>Hello there</Typography>
      <GradientTypography variant="h3">
        {fullname || username}
      </GradientTypography>
      <FlexBox alignItems="center" gap={2}>
        <FlexBox alignmItems="center">
          <YupCountUp
            end={score || 1}
            duration={0.5}
            useEasing={false}
            color={userColor}
          />
          <Typography variant="body2">Yup Score</Typography>
        </FlexBox>
        <FlexBox alignItems="center">
          <YupLogoEmoji />
          <Typography variant="body2" sx={{ ml: 1, color: '' }}>
            {formatDecimal(balance?.YUP || 0)}
          </Typography>
        </FlexBox>
      </FlexBox>
    </FlexBox>
  );
}
