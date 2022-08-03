import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { webAppUrl } from '../../config';
import ReactMarkdown from 'react-markdown';
import { Typography } from '@mui/material';

const SeeMore = ({ children, maxLength, postid }) => {
  const text =
    typeof children === 'string' ? children : children.props.children;

  return (
    <>
      <ReactMarkdown>
        {text.length > maxLength ? text.slice(0, maxLength) : text}
      </ReactMarkdown>
      {text.length > maxLength ? (
        <Link href={`/post/${postid}`}>
            <Typography variant="body2"  sx={{ fontStyle:'italic', color: 'gray'}}>
              ...see more</Typography>
        </Link>
      ) : null}
    </>
  );
};

SeeMore.propTypes = {
  children: PropTypes.object.isRequired,
  maxLength: PropTypes.number.isRequired,
  postId: PropTypes.string.isRequired
};

export default SeeMore;
