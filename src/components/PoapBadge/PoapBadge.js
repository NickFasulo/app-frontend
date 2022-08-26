import { styled } from '@mui/material';
import YupImage from '../YupImage';
import { FlexBox, TruncateText } from '../styles';
import Link from '../Link';

const BadgeContainer = styled('div')(({ theme }) => ({
  border: `solid 1px ${theme.palette.M750}`,
  backgroundColor: `${theme.palette.M900}88`,
  padding: theme.spacing(3, 2.5),
  borderRadius: 16
}));

const PoapBadge = ({ image, text, link }) => {
  return (
    <Link href={link} target="_blank">
      <BadgeContainer>
        <FlexBox sx={{ justifyContent: 'center' }}>
          <YupImage
            src={image}
            alt={text}
            style={{
              width: '50%',
              height: 'auto',
              borderRadius: '100%'
            }}
          />
        </FlexBox>
        <TruncateText
          align="center"
          lines={2}
          sx={{
            mt: 4,
            lineHeight: `20px`,
            height: 40
          }}
        >
          {text}
        </TruncateText>
      </BadgeContainer>
    </Link>
  );
};

export default PoapBadge;
