import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ArticlePreview from '../LinkPreview/ArticlePreview';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { createRouteLoader } from 'next/dist/client/route-loader';
import FullArticle from '../LinkPreview/FullArticle';
import { useRouter } from 'next/router';

function ArticlePost(props) {
  const { web3Preview, previewData, postHOC: PostHOC, quantiles, rankCategory, url, createdAt, postid } = props;
  const { pathname } = useRouter();
  const isFullPost = () => {
    return pathname === '/post/[id]';
  };

  const ArticleComp = (_props) => (
  <>
    {isFullPost()?(
      <FullArticle
        description={web3Preview?.content}
        createdAt={createdAt}
        writerENS={web3Preview?.creator.ens}
        image={previewData?.img}
        title={previewData?.title}
        url={url}
        quantiles={quantiles}
        rankCategory={rankCategory}
        postid={postid}
      />):(
      <ArticlePreview
        description={web3Preview?.content}
        createdAt={createdAt}
        writerENS={web3Preview?.creator.ens}
        image={previewData?.img}
        title={previewData?.title}
        url={url}
        quantiles={quantiles}
        rankCategory={rankCategory}
        postid={postid}
      />)}
      </>
  );
  return (
    <ErrorBoundary>
      <PostHOC component={ArticleComp} {...props} />
    </ErrorBoundary>
  );
}

ArticlePost.propTypes = {
  previewData: PropTypes.object,
  quantiles: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  postHOC: PropTypes.element.isRequired,
  rankCategory: PropTypes.string
};

export default memo(ArticlePost);
