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
import { timeSince } from '../../utils/post_helpers';
import Avatar from "boring-avatars";

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
  eventContainer: {
    borderRadius: '12px',
    border: `1.5px solid ${theme.palette.M700}22`
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

const EventPreview = ({ title, description, url, classes, creator, eventImg, eventSite, createdAt }) => {
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
        <a
          className={classes.link}
          href={url}
          rel="noopener noreferrer"
          target="_blank"
        >
          <div className={classes.previewData}>
            <Grid container>
              <Grid item xs={12} pb={1}>
                <Grid alignItems="start" container direction="row" rowSpacing={3}>
                  <Grid item xs={10} sm={11}>
                    <Grid container direction='row'  alignItems="center" columnSpacing={2}>
                           
                      <Grid item>               
                      <Avatar
                        size={16}
                        name={creator}
                        variant="marble"
                        colors={["#EB3650", "#FCA016", "#F0C909", "#00E08E"]}
                      /></Grid> 
                      <Grid item >  
                       <Grid container direction={{sm:'column', md:'row'}} spacing={1} >
                      <Grid item >
                        <Typography variant="body3"  noWrap>
                          {creator === undefined ? trimURL(url).split(/[/]+/g, 1) : creator }
                        </Typography>
                      </Grid>
                      <Grid item >
                        <Typography variant="body2"  noWrap>
                            attended:
                        </Typography>
                      </Grid></Grid></Grid>
                      
                    </Grid>
                  </Grid>
                  <Grid item xs={2} sm={1}>
                    <Grid container direction='row' center>
                      <Grid item>
                        <YupImage
                          align="right"
                          href={url}
                          src={faviconURL}
                          className={classes.linkImg}
                          target="_blank"
                        />
                      </Grid>
                      <Grid item
                        sx={{marginBottom: '0.09375rem'}}>
                        <Typography
                                variant="bodyS2"
                                className={classes.userHandle}
                              >
                                { timeSince(new Date(createdAt)) }
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} className={classes.eventContainer}>
                <Grid container direction='row' spacing={1} p={2}>
                  <Grid item xs={1}>
                    <img src={eventImg} width='100%'/>
                  </Grid>
                  <Grid item xs={11}>
                    <Grid container>
                      <Grid item xs={12}>
                        <TruncateText variant="subtitle2" lines={2}>
                          {title.split(/[|]|[—]+/g, 1)}
                        </TruncateText>
                      </Grid>
                      <Grid item xs={12}>
                        <TruncateText
                          variant="body2"
                          className={classes.description}
                          lines={5}
                        >
                          {description}
                        </TruncateText>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" className={classes.url}>
                          {eventSite === undefined ? trimURL(eventSite).split(/[/]+/g, 1) : eventSite }
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </a>
      </div>
    </ErrorBoundary>
  );
};

EventPreview.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  creator: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  eventImg: PropTypes.string.isRequired,
  eventSite: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EventPreview);
