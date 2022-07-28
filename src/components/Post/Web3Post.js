import React from 'react';
import CustomWeb3PostEmbed from '../CustomWeb3PostEmbed/CustomWeb3PostEmbed';
import PropTypes from 'prop-types';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import './tweet.module.css';
import { styled } from '@mui/material/styles';

const PostContainer = styled("div")(
  ({ theme }) => `
  transition: 'opacity 2s ease-in',
    padding: '0% 0% 0% 0%',
    overflow: 'hidden',
    border-top-left-radius: '10px',
    border-top-right-radius: '10px',
    ${[theme.breakpoints.down('md')]}: {
      border-radius: 0,
      min-height: 0
    }
`
);

const Web3Post = (props) => {
    const { postHOC: PostHOC, web3Preview } = props;

    const Web3PostComp = (_props) => (
      <PostContainer>
        <CustomWeb3PostEmbed web3Preview={web3Preview} />
      </PostContainer>
    );

    return (
      <ErrorBoundary>
        <PostHOC component={Web3PostComp} {...props} />
      </ErrorBoundary>
    );
  }


Web3Post.propTypes = {
  url: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  web3Preview: PropTypes.object,
  tweetObject: PropTypes.object,
  postHOC: PropTypes.element.isRequired
};

export default Web3Post;
