import React, { memo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  CloudinaryContext,
  Transformation,
  Placeholder
} from 'cloudinary-react';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { cloudinaryName } from '../../config';
import { Grid } from '@mui/material';

const ROOT_CLOUDINARY_URL = `https://res.cloudinary.com/yup-io/image/upload/`;
const FOUNDATION_IMG_URI = `https://f8n`;

const foundationOptimizeParams = {
  q: 30,
  auto: 'format,compress',
  cs: 'srbg',
  h: 640,
  fm: 'png'
};

const CldImg = ({ postid, src, alt, isWeb3Post, ...restProps }) => {
  const imgRef = useRef(null);
  const [isHigherRatio, setIsHigherRatio] = useState(false);

  if (src.startsWith('ipfs://')) {
    src = `https://ipfs.io/ipfs/${src.substring(7)}`;
  }

  const isUploadedToCloud = src && src.startsWith(ROOT_CLOUDINARY_URL);
  const isFoundationImg = src && src.split('-')[0] === FOUNDATION_IMG_URI;

  const handleLoad = () => {
    const imgElement = imgRef.current;

    if (!imgElement) return;

    const width = imgElement.naturalWidth;
    const height = imgElement.naturalHeight;

    if (width >= height) {
      // Ratio >= 1
      imgElement.style.width = '100%';
      imgElement.style.objectFit = 'cover';
      imgElement.style.minHeight = '200px';
      imgElement.style.maxHeight = '500px';
    } else {
      setIsHigherRatio(true);
      // Ratio < 1
      imgElement.style.maxHeight = '400px';
      imgElement.style.objectFit = 'fit-content';
    }
  };
  if (isFoundationImg) {
    return (
      <img
        ref={imgRef}
        src={`${src}?${new URLSearchParams(
          foundationOptimizeParams
        ).toString()}`}
        alt={alt}
        onLoad={handleLoad}
        {...restProps}
      />
    );
  }

  if (isWeb3Post ) {
    return (
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={handleLoad}
        {...restProps}
      />
    );
  }

  return (
    <ErrorBoundary>
      <CloudinaryContext cloudName={cloudinaryName}>
       
        <Image
          innerRef={imgRef}
          publicId={isUploadedToCloud ? postid : src}
          type={isUploadedToCloud ? undefined : 'fetch'}
          secure="true"
          dpr="auto"
          responsive
          height="auto"
          onLoad={handleLoad}
          alt={alt}
          {...restProps}
        >
          <Placeholder type="vectorize" />
          <Transformation quality="auto" fetchFormat="auto" />
        </Image>     
      </CloudinaryContext>
    </ErrorBoundary>
  );
};

CldImg.propTypes = {
  postid: PropTypes.string,
  src: PropTypes.string,
  alt: PropTypes.string
};

export default memo(CldImg);
