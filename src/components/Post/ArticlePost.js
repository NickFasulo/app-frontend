import React, { memo } from 'react'
import PropTypes from 'prop-types'
import ArticlePreview from '../LinkPreview/ArticlePreview'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

function ArticlePost (props) {
  const { previewData, postHOC: PostHOC, quantiles, rankCategory, caption } = props

  const ArticleComp = (_props) => (
    <ArticlePreview
      description={previewData && previewData.description}
      image={previewData && previewData.img}
      title={previewData && previewData.title}
      url={previewData && previewData.url}
      caption={caption}
      quantiles={quantiles}
      rankCategory={rankCategory}
    />
  )
  return (
    <ErrorBoundary>
      <PostHOC
        component={ArticleComp}
        {...props}
      />
    </ErrorBoundary>
  )
}

ArticlePost.propTypes = {
  previewData: PropTypes.object,
  quantiles: PropTypes.object.isRequired,
  caption: PropTypes.string.isRequired,
  postHOC: PropTypes.element.isRequired,
  rankCategory: PropTypes.string
}

export default memo(ArticlePost)
