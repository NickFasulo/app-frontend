import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { webAppUrl } from '../../config';
import ReactMarkdown from 'react-markdown';

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
          <p>...see more</p>
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
