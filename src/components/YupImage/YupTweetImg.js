import { DEFAULT_IMAGE_PATH } from '../../utils/helpers';
import { useState } from 'react';

const YupTweetImg = ({ src, alt, ...restProps }) => {
 const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true)
    
    console.log({hasError})
  };
  if (hasError) {   
    return
  }
  else {
    return <img src={src} alt={alt} onError={handleError} {...restProps} />;
  }
};

export default YupTweetImg;
