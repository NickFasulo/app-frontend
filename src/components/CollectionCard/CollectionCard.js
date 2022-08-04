import {
  CollectionCardRoot,
  CollectionContent,
  CollectionCoverWrapper,
  CollectionOverlay
} from './styles';
import { Typography } from '@mui/material';
import { TruncateText } from '../styles';
import Link from 'next/link';
import CollectionCover from '../CollectionCover';
import { generateCollectionUrl } from '../../utils/helpers';

const CollectionCard = ({ data }) => {
  const { _id: id, name, postIds } = data;

  return (
    <Link href={generateCollectionUrl(name, id)}>
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
