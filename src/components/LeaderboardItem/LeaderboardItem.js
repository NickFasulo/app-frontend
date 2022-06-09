import { LeaderboardItemRank, LeaderboardItemRoot } from './styles';
import AudisContent from './AudisContent';
import { isCollectionUrl, isMirrorUrl } from '../../utils/helpers';
import {
  MIRROR_THUMBNAIL_IMAGE,
  YUP_THUMBNAIL_IMAGE
} from '../../constants/const';
import LeaderboardItemThumbnail from './LeaderboardItemThumbnail';
import LeaderboardItemTitle from './LeaderboardItemTitle';
import VoteComp from '../VoteComp/VoteComp';
import CollectionThumbnail from './CollectionThumbnail'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

const LeaderboardItem = ({ data, rank }) => {
  const { previewData, caption, quantiles, weights, rating } = data;
  const { trackId, ownerId, img, url, title } = previewData;
  const thumbnail = img ?
    img :
    isMirrorUrl(caption) ?
      MIRROR_THUMBNAIL_IMAGE :
      YUP_THUMBNAIL_IMAGE;

  const isAudiusPost = Boolean(trackId) || Boolean(ownerId);
  const isCollection = isCollectionUrl(url);

  return (
    <LeaderboardItemRoot>
      <LeaderboardItemRank variant="h6">{rank}</LeaderboardItemRank>
      {isAudiusPost ? (
        <AudisContent id={trackId} ownerId={ownerId}/>
      ) : (
        <>
          {isCollection ? (
            <ErrorBoundary>
              <CollectionThumbnail url={url} />
            </ErrorBoundary>
          ) : (
            <LeaderboardItemThumbnail url={thumbnail}/>
          )}
          <LeaderboardItemTitle url={url} title={title}/>
        </>
      )}
      <VoteComp
        postInfo={{ post: data }}
        caption={caption}
        postid={data._id.postid}
        rating={rating}
        weights={weights}
        quantiles={quantiles}
      />
    </LeaderboardItemRoot>
  );
};

export default LeaderboardItem;
