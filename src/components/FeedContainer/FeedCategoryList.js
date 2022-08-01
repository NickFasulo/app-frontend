import { FEED_CATEGORIES } from '../../constants/data';
import { FlexBox } from '../styles';
import { CategoryImage } from './styles';
import { Typography } from '@mui/material';
import Link from '../Link';

const FeedCategoryList = ({ currentCategoryId }) => {
  const categoryList = Object.values(FEED_CATEGORIES).filter((category) => !!category.id && category.id !== currentCategoryId);

  return (
    <FlexBox flexDirection="column" gap={2}>
      {categoryList.map((category) => (
        <Link
          href={`/feed/${category.id}`}
        >
          <FlexBox alignItems="center">
            <CategoryImage
              src={category.image}
              alt={category.title}
              width={60}
              height={60}
            />
            <Typography variant="body" sx={{ ml: 2 }}>
              {category.title}
            </Typography>
          </FlexBox>
        </Link>
      ))}
    </FlexBox>
  );
};

export default FeedCategoryList;
