import React from 'react';
import PropTypes from 'prop-types';

const SeeMore = ({ children }) => {
  const text = typeof children === 'string' ? children : children.props.children;

  const handleClick = () => {
    
  };

  return (
    <>
      {text.length > 500 ? text.slice(0, 500) : text}
      {text.length > 500 ? 
      (<p onClick={handleClick}>
        ...see more
      </p>) : null}
    </>
  );
};

SeeMore.propTypes = {
  children: PropTypes.object.isRequired
};

export default SeeMore;
