import { Box, styled } from '@mui/material';
import Link from '../Link';
import YupImage from '../YupImage';
import { TruncateText } from '../styles';
import { convertIPFSSrcToHttps } from '../../utils/post_helpers';

const CardContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  border: `solid 1px ${theme.palette.M750}`,
  backgroundColor: `${theme.palette.M900}88`,
  padding: theme.spacing(2.5),
  borderRadius: 16
}));

const CaptionContainer = styled('div')(({ theme }) => ({
  backgroundColor: `${theme.palette.M800}77`,
  border: `solid 1px ${theme.palette.M750}`,
  borderRadius: 12,
  position: 'absolute',
  left: theme.spacing(4.5),
  right: theme.spacing(4.5),
  bottom: theme.spacing(4.5),
  padding: theme.spacing(1.5),
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center'
}));

const CollectionImage = styled(YupImage)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: 100,
  border: `solid 1px ${theme.palette.P500}`
}));

const VerifiedImage = styled(YupImage)(({ theme }) => ({
  width: 20,
  height: 20,
  position: 'absolute',
  right: 0,
  bottom: 0
}));

const NftCard = ({ image, collectionName, collectionImage, link, verified }) => (
  <Link href={link} target="_blank">
    <CardContainer>
      <YupImage
        src={image}
        alt={collectionName}
        style={{
          width: '100%',
          aspectRatio: 1,
          borderRadius: 16,
          objectFit: 'contain'
        }}
      />
      <CaptionContainer>
        <Box position="relative">
          <CollectionImage
            src={convertIPFSSrcToHttps(collectionImage)}
            alt={collectionName}
          />
          {verified && (
            <VerifiedImage
              src="/images/icons/nft_verified.svg"
              alt="Verified NFT"
            />
          )}
        </Box>
        <TruncateText
          lines={2}
          sx={{
            lineHeight: '20px',
          }}
        >
          {collectionName}
        </TruncateText>
      </CaptionContainer>
    </CardContainer>
  </Link>
);

export default NftCard;
