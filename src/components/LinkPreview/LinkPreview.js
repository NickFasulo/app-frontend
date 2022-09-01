import React, { Component } from 'react';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { trimURL, getFavicon } from '../../utils/url';
import { defaultPostImageUrl } from '../../config';
import { TruncateText } from '../styles';
import YupImage from '../YupImage';
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
    color: '#fff',
    '&:visited': {
      textDecoration: 'none',
      color: '#fff'
    }
  },
  linkImg: {
    width: '100%',
    minHeight: '12rem',
    maxHeight: '15rem',
    [theme.breakpoints.down('sm')]: {
      minHeight: '15rem',
      maxHeight: '18rem'
    },
    objectFit: 'cover',
    backgroundColor: theme.palette.M500,
    objectPosition: '50% 50%',
    alignItems: 'center',
    borderRadius: '0.75rem',
    position: 'relative',
    [theme.breakpoints.up('1700')]: {
      maxHeight: '25rem',
      width: '100%'
    }
  },
  previewContainer: {
    textDecoration: 'none',
    padding: '8px',
    color: theme.palette.M100,
    '&:visited': {
      textDecoration: 'none',
      color: theme.palette.M100
    },
    maxHeight: '500px'
  },
  title: {
    position: 'relative',
    textShadow: `0px 0px 5px ${theme.palette.M900}aa`,
    color: theme.palette.M100,
    opacity: 0.9
  },
  description: {
    position: 'relative',
    textShadow: `0px 0px 5px ${theme.palette.M900}88`,
    margin: '0.25rem 0',
    fontWeight: '300'
  },
  url: {
    position: 'relative',
    fontSize: '0.625rem',
    fontWeight: 100,
    marginTop: 0,
    opacity: '0.5'
  },
  previewData: {
    textAlign: 'left',
    borderRadius: '0.75rem',
    zIndex: 5,
    background: `${theme.palette.M800}AA`,
    padding: '2% 3% 2% 3%',
    width: '100%',
    backdropFilter: 'blur(40px)',
    overflow: 'hidden'
  },
  previewDataContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: `${theme.spacing(2)} ${theme.spacing(2)} ${theme.spacing(
      3
    )} ${theme.spacing(2)}`,
    width: '100%'
  }
});

function LinkPreview({ image, title, description, url, classes }) {
  let faviconURL = null;
  console.log(url, 'WURST');

  if (url != null) {
    faviconURL = getFavicon(url);
  }

  return (
    <ErrorBoundary>
      <Link className={classes.container} href={url}>
        <a className={classes.link} rel="noopener noreferrer" target="_blank">
          <div className={classes.previewContainer} href={url} target="_blank">
            <YupImage
              alt={title}
              className={classes.linkImg}
              src={[image, defaultPostImageUrl]}
              target="_blank"
            />
            <div className={classes.previewDataContainer}>
              <div className={classes.previewData}>
                <Grid alignItems="center" container direction="row" spacing={2}>
                  <Grid item xs={2} sm={1}>
                    <YupImage
                      align="right"
                      src={faviconURL}
                      style={{
                        width: '100%',
                        aspectRatio: '1 / 1',
                        border: 'none',
                        borderRadius: 12
                      }}
                      target="_blank"
                    />
                  </Grid>
                  <Grid item xs={10} sm={11}>
                    <Typography variant="h6" className={classes.title}>
                      <TruncateText lines={2}>{title}</TruncateText>
                    </Typography>
                  </Grid>
                </Grid>
                <Grid direction="row" spacing={1}>
                  <Grid item xs>
                    <TruncateText lines={4}>
                      <Typography
                        variant="body2"
                        className={classes.description}
                      >
                        {description || url}
                      </Typography>
                    </TruncateText>
                  </Grid>
                  <Grid item xs>
                    <TruncateText lines={1} className={classes.url}>
                      <Typography variant="bodyS2">
                        {url && trimURL(url)}
                      </Typography>
                    </TruncateText>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </ErrorBoundary>
  );
}

LinkPreview.propTypes = {
  image: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LinkPreview);
