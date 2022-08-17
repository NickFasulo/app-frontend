import { FlexBox } from '../styles';
import PostController from '../Post/PostController';
import { Typography } from '@mui/material';
import RecommendedPosts from '../RecommendedPosts';

const CollectionList = ({ collection }) => {
  const { name, posts } = collection;

  return (
    <>
      <FlexBox
        flexDirection="column"
        overflow="auto"
        textAlign="center"
        className="Tour-CollectionPosts"
      >
        {posts.map((post) => (
          <PostController
            key={post?._id.postid}
            post={post}
            hideInteractions
            renderObjects
          />
        ))}
      </FlexBox>
      <Typography variant="h6" sx={{ my: 2 }}>
        Recommended
      </Typography>
      <RecommendedPosts query={name} />
    </>
  );
};

export default CollectionList;
