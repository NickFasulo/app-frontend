import { useState } from 'react';
import { DEFAULT_IMAGE_PATH } from '../../utils/helpers';

function YupTweetImg({ src, alt, ...restProps }) {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);

    console.log({ hasError });
  };
  if (hasError) {
  } else {
    return <img src={src} alt={alt} onError={handleError} {...restProps} />;
  }
}

export default YupTweetImg;
