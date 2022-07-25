import { FlexBox } from '../styles';
import PostController from '../Post/PostController';

const CollectionList = ({ collection }) => {
  const { posts } = collection;

  return (
    <FlexBox
      flexDirection="column"
      overflow="auto"
      textAlign="center"
      className="Tour-CollectionPosts"
    >
      {posts
        .map((post) => (
          <PostController
            key={post?._id.postid}
            post={post}
            hideInteractions
            renderObjects
          />
        ))}
    </FlexBox>
  );
};

export default CollectionList;
