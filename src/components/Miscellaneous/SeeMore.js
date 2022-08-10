import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { webAppUrl } from '../../config';
import ReactMarkdown from 'react-markdown';
import { Typography } from '@mui/material';
import { TruncateText } from '../styles';
import YupReactMarkdown from '../ReactMarkdown';
import TruncateMarkup from 'react-truncate-markup';

const SeeMore = ({ children, maxChars, postid }) => {
  // const [isTruncated, setIsTruncated] = React.useState();
  // const [wasHandled, setWasHandled] = React.useState();
  const text = typeof children === 'string' ? children : children.props.children;
  text += " "
  const isTrimmed = text.length > maxChars;
  var trimmedString = text.substr(0, maxChars);
  trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
  // const wordsLeftEllipsis = (rootEl) => {
  //   const originalWordCount = text.match(/\S+/g).length;
  //   const newTruncatedText = rootEl.props.children;
  //   const currentWordCount = newTruncatedText.match(/\S+/g).length;
  //   console.log({rootEl, wasHandled})
  //   return <YupReactMarkdown>
  //   {newTruncatedText}
  // </YupReactMarkdown>;
  // }
  

  return (
    <>
    {/* <YupReactMarkdown> */}
     {/* <TruncateMarkup lines={20} ellipsis={wordsLeftEllipsis} 
     tokenize='words' 
     onTruncate={(truncated)=>{setIsTruncated(truncated);setWasHandled(true); }}>
      <div >
        {text}
      </div>
     </TruncateMarkup> */}
              <YupReactMarkdown>
                {trimmedString}
              </YupReactMarkdown>
      {isTrimmed&&(
        <Link href={`/post/${postid}`}>
            <Typography variant="body2"  sx={{ cursor:"pointer", fontStyle:'italic', color: 'gray'}}>
              See more</Typography>
        </Link>
        )}
    </>
  );
};

SeeMore.propTypes = {
  children: PropTypes.object.isRequired,
  maxLength: PropTypes.number.isRequired,
  postId: PropTypes.string.isRequired
};

export default SeeMore;
