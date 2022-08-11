import { FEED_CATEGORIES } from '../../constants/data';
import { FlexBox } from '../styles';
import { CategoryImage } from './styles';
import { List, ListItemButton, Typography } from '@mui/material';
import Link from '../Link';
import shuffle from 'lodash/shuffle';
import { useMemo } from 'react';

const Categories = [
  FEED_CATEGORIES.DAILY_HIT,
  FEED_CATEGORIES.CRYPTO,
  FEED_CATEGORIES.NFT,
  FEED_CATEGORIES.MIRROR,
  FEED_CATEGORIES.FARCASTER,
  FEED_CATEGORIES.LENS
];

const FeedCategoryList = ({ currentCategoryId }) => {
  const categoryList = useMemo(() => {
    return shuffle(Categories)
      .filter((category) => category.id !== currentCategoryId)
      .slice(0, 5);
  }, [currentCategoryId]);

  return (
    <List>
      {categoryList.map((category) => (
        <ListItemButton component={Link} href={`/feed/${category.id}`}>
          <FlexBox alignItems="center">
            <CategoryImage
              src={category.image}
              alt={category.title}
              height="40rem"
              width="40rem"
              aspectRatio="1 / 1"
            />
            <Typography variant="body" sx={{ ml: 2 }}>
              {category.title}
            </Typography>
          </FlexBox>
        </ListItemButton>
      ))}
    </List>
  );
};

export default FeedCategoryList;
