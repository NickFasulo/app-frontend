import qs from 'query-string';
import { AudisContentRoot } from './styles';
import { audisEmbedUrl } from '../../config';

function AudisContent({ id, ownerId }) {
  return (
    <AudisContentRoot>
      <iframe
        src={qs.stringifyUrl({
          url: audisEmbedUrl,
          query: {
            id,
            ownerId,
            flavor: 'compact'
          }
        })}
        allow="encrypted-media"
      />
    </AudisContentRoot>
  );
}

export default AudisContent;
