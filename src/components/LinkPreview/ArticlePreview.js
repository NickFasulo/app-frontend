import React from 'react';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { trimURL, getFavicon } from '../../utils/url';
import { defaultPostImageUrl } from '../../config';
import { TruncateText } from '../styles';
import YupImage from '../YupImage';
import removeMd from'remove-markdown';
import Link from '../Link/Link';

const styles = (theme) => ({
  container: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px'
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.M100,
    '&:visited': {
      textDecoration: 'none',
      color: theme.palette.M100
    }
  },
  linkImg: {
    width: '16px',
    aspectRatio: '1 / 1',
    border: 'none',
    borderRadius: '0.5rem',
    [theme.breakpoints.down('sm')]: {
      maxHeight: 10,
      maxWidth: 10
    }
  },
  previewContainer: {
    textDecoration: 'none',
    color: theme.palette.M100,
    '&:visited': {
      textDecoration: 'none',
      color: theme.palette.M100
    },
    maxHeight: '500px'
  },
  title: {
    position: 'relative',
    fontSize: '1rem',
    fontWeight: 600,
    textShadow: `0px 0px 5px ${theme.palette.M900}aa`,
    color: theme.palette.M100,
    opacity: 0.9
  },
  description: {
    position: 'relative',
    textShadow: `0px 0px 5px ${theme.palette.M900}88`
  },
  url: {
    position: 'relative',
    overflowWrap: 'break-word',
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    width: '70%',
    marginTop: 0,
    opacity: '0.5'
  },
  previewData: {
    bottom: 0,
    textAlign: 'left',
    zIndex: 5,
    padding: '16px 16px 0 16px',
    width: '100%',
    boxShadow: `0px 2px ${theme.palette.M850}`
  }
});

const ArticlePreview = ({ title, description, url, classes, writerENS, postid }) => {
  const addDefaultSrc = (e) => {
    e.target.onerror = null;
    e.target.src = defaultPostImageUrl;
  };

  let faviconURL = null;

  if (url != null) {
    faviconURL = getFavicon(url);
  }

  return (
    <ErrorBoundary>
      <div className={classes.container} href={url} target="_blank">       
        <Link href={`/post/${postid}`} >
          <div className={classes.previewData}>
            <Grid container rowSpacing={1} >
              <Grid item xs={12}>
                <Grid alignItems="start" container direction="row" spacing={0}>
                  <Grid item xs={10} sm={11}>
                    <Grid container direction='row'>
                      <Grid item xs={12}>
                        <TruncateText variant="h6" lines={2}>
                          {title.split(/[|]|[—]+/g, 1)}
                        </TruncateText>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" className={classes.url}>
                          {writerENS === undefined ? trimURL(url).split(/[/]+/g, 1) : writerENS }
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={2} sm={1}>
                    <YupImage
                      align="right"
                      href={url}
                      src={faviconURL}
                      className={classes.linkImg}
                      target="_blank"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TruncateText
                variant="body2"
                className={classes.description}
                lines={5}
              >
                {removeMd(description)}
              </TruncateText>
            </Grid>
          </div>
        </Link>
      </div>
    </ErrorBoundary>
  );
};

ArticlePreview.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  writerENS: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ArticlePreview);
