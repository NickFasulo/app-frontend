import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { webAppUrl } from '../../config';
import ReactMarkdown from 'react-markdown';
import { Typography } from '@mui/material';
import { TruncateText } from '../styles';
import YupReactMarkdown from '../ReactMarkdown';

const SeeMore = ({ children, lines, postid }) => {
  const text =
    typeof children === 'string' ? children : children.props.children;
console.log(text.split(/[|]|[—]+/g, 1), {lines})

  return (
    <>  
          <TruncateText  lines={lines}>
            <YupReactMarkdown>
                          {text.split(/[|]|[—]+/g, 1)[0]}
            </YupReactMarkdown>
          </TruncateText>
        {/* {text.length > maxLength ? text.slice(0, maxLength) : text} */}
      {/* {text.length > maxLength ? (
        <Link href={`/post/${postid}`}>
            <Typography variant="body2"  sx={{ cursor:"pointer", fontStyle:'italic', color: 'gray'}}>
              See more</Typography>
        </Link>
      ) : null} */}
    </>
  );
};

SeeMore.propTypes = {
  children: PropTypes.object.isRequired,
  maxLength: PropTypes.number.isRequired,
  postId: PropTypes.string.isRequired
};

export default SeeMore;
