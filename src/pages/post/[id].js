import { useRouter } from 'next/router';
import React from 'react';
import { Typography } from '@mui/material';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import PostDisplay from '../../components/Post/PostDisplay';
import { CreateCollectionFab } from '../../components/Miscellaneous';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import YupPageHeader from '../../components/YupPageHeader';
import { useAppUtils } from '../../contexts/AppUtilsContext';
import FeedCategoryList from '../../components/FeedContainer/FeedCategoryList';
import { YupPageWrapper, YupContainer } from '../../components/styles';
import GridLayout from '../../components/GridLayout';
import { usePost } from '../../hooks/queries';
import withSuspense from '../../hoc/withSuspense';
import { LOADER_TYPE, REACT_QUERY_KEYS } from '../../constants/enum';
import callYupApi from '../../apis/base_api';
import PostCard from '../../components/PostCard/PostCard';
import {
  getAbsolutePath,
  isWeb3Post,
  summarizeContent
} from '../../utils/helpers';
import { COMPANY_NAME } from '../../constants/const';
import YupHead from '../../components/YupHead';

function PostDetails() {
  const router = useRouter();
  const { windowScrolled } = useAppUtils();
  const { id } = router.query;
  const post = usePost(id);

  const isWeb3 = isWeb3Post(post.tag);
  const metaOg = {};
  const metaTwitter = {};
  const metaOther = {};
  let metaTitle;
  let metaDescription;
  let metaImage;

  if (isWeb3) {
    const { web3Preview = {} } = post;
    const { attachments = [], linkPreview = [] } = web3Preview;
    const author =
      web3Preview.creator?.fullname || web3Preview.meta?.displayName;

    metaTitle = `Post by ${author} | ${COMPANY_NAME}`;
    metaDescription = `${summarizeContent(web3Preview.content)}`;

    if (attachments.length > 0 && attachments[0].images?.length > 0) {
      [metaImage] = attachments[0].images;
    } else if (linkPreview.length > 0) {
      metaImage = linkPreview[0].img;
    }

    metaImage ||= getAbsolutePath('/images/metaImages/main-meta.jpg');

    metaOg.author = author;
    metaOg.url = getAbsolutePath(`/post/${id}`);
    metaOg.site_name = COMPANY_NAME;
    metaOg.type = 'article';

    metaTwitter.card = 'summary_large_image';

    metaOther.author = author;
  }

  return (
    <ErrorBoundary>
      <YupHead
        title={metaTitle}
        description={metaDescription}
        image={metaImage}
        metaOg={metaOg}
        metaOther={metaOther}
        metaTwitter={metaTwitter}
      />
      <YupPageWrapper>
        <YupPageHeader scrolled={windowScrolled} noborder>
          <YupContainer>
            <Typography variant="h5">Post</Typography>
          </YupContainer>
        </YupPageHeader>
        <YupContainer>
          <GridLayout
            contentLeft={<PostDisplay post={post} />}
            contentRight={<PostCard post={post} />}
          />
          <CreateCollectionFab />
        </YupContainer>
      </YupPageWrapper>
    </ErrorBoundary>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  const qc = new QueryClient();

  await qc.prefetchQuery([REACT_QUERY_KEYS.POST, id], () => {
    if (!id) return null;

    return callYupApi({
      url: `/posts/post/${id}`
    });
  });

  return {
    props: {
      dehydratedState: dehydrate(qc)
    }
  };
}

export default withSuspense(LOADER_TYPE.TOP_BAR)(PostDetails);
