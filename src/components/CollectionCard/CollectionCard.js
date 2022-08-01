import {
  CollectionCardRoot,
  CollectionContent,
  CollectionCoverWrapper,
  CollectionImage,
  CollectionOverlay
} from './styles';
import { Typography } from '@mui/material';
import { TruncateText } from '../styles';
import Link from 'next/link';
import CollectionCover from '../CollectionCover';

const CollectionCard = ({ data }) => {
  const { _id: id, name, postIds, imgSrcUrl } = data;

  return (
    <Link href={`/collections/${name}/${id}`}>
      <a>
        <CollectionCardRoot>
          <CollectionCoverWrapper>
            <CollectionCover id={id} />
          </CollectionCoverWrapper>
          <CollectionOverlay />
          <CollectionContent flexDirection="column" justifyContent="flex-end">
            <TruncateText>{name}</TruncateText>
            <Typography
              variant="body2"
              sx={{ color: (theme) => theme.palette.M400 }}
            >
              {postIds.length} posts
            </Typography>
          </CollectionContent>
        </CollectionCardRoot>
      </a>
    </Link>
  );
};

export default CollectionCard;
