import React, { Component, Fragment } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import withStyles from '@mui/styles/withStyles';
import Grid from '@mui/material/Grid';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { levelColors } from '../../utils/colors';
import UserAvatar from '../UserAvatar/UserAvatar';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { fetchSocialLevel } from '../../redux/actions';
import { accountInfoSelector } from '../../redux/selectors';
import { apiBaseUrl, yupCreator } from '../../config';
import YupLink from '../YupLink';

const styles = (theme) => ({
  interactionBar: {
    opacity: '0.7',
    padding: '0 0 4px 0',
    marginTop: 0,
    [theme.breakpoints.down('sm')]: {
      padding: '4px 0'
    }
  },
  keyUser: {
    opacity: '80%'
  },
  time: {
    paddingRight: '2px',
    marginLeft: 'auto',
    color: theme.palette.M500,
    fontSize: '14px',
    lineHeight: '14px',
    paddingTop: 0,
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px'
    }
  },
  voterOpacity: {
    opacity: '80%'
  },
  avatarImage: {
    fontSize: '14px',
    display: 'grid',
    border: '2px solid',
    borderRadius: '100%',
    width: '22px',
    marginRight: '7px',
    height: '22px'
  }
});

class PostHeader extends Component {
  state = {
    postInteractions: [],
    isLoading: true
  };

  componentDidMount() {
    try {
      axios
        .post(`${apiBaseUrl}/posts/interactions/${this.props.postid}`)
        .then((res) => {
          this.setState({
            postInteractions: res.data,
            isLoading: false
          });
        })
        .catch((_) => {
          this.setState({ isLoading: false });
        });
    } catch (_) {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { isLoading, postInteractions } = this.state;
    const { levels, author, classes, hideInteractions, dispatch, router } =
      this.props;
    const { query } = router;

    if (!isLoading && !postInteractions.length) {
      return <div />;
    }

    if (isLoading || !postInteractions.length) {
      return <div className={classes.interactionBar} />;
    }

    const vote = postInteractions[0];
    if (!levels[vote.voter]) {
      dispatch(fetchSocialLevel(vote.voter));
      return <div />;
    }
    if (levels[vote.voter].isLoading || hideInteractions) {
      return <div />;
    }
    const formattedVoteTime = moment(vote.timestamp, 'x').fromNow(true);

    const voterQuantile =
      levels[vote.voter] && levels[vote.voter].levelInfo.quantile;
    const voterLevelColor = voterQuantile
      ? levelColors[voterQuantile]
      : levelColors.sixth;

    const voterAvatar =
      levels[vote.voter] && levels[vote.voter].levelInfo.avatar;
    const voterUsername =
      levels[vote.voter] && levels[vote.voter].levelInfo.username;

    const voterInfo = levels[vote.voter] && levels[vote.voter].levelInfo;
    const voterIsMirror =
      voterInfo && voterInfo.twitterInfo && voterInfo.twitterInfo.isMirror;
    const voterIsAuth =
      voterInfo && voterInfo.twitterInfo && voterInfo.twitterInfo.isAuthUser;

    const authorQuantile = levels[author] && levels[author].levelInfo.quantile;
    const authorAvatar = levels[author] && levels[author].levelInfo.avatar;
    const authorUsername = levels[author] && levels[author].levelInfo.username;
    const authorLevelColor = authorQuantile
      ? levelColors[authorQuantile]
      : levelColors.sixth;
    const voterTwitterUsername =
      voterInfo && voterInfo.twitterInfo ? voterInfo.twitterInfo.username : '';
    const headerDisplayName =
      voterIsMirror &&
      voterInfo.twitterInfo.isTracked &&
      voterInfo.twitterInfo.isMirror
        ? voterTwitterUsername
        : voterUsername || vote.voter;

    const VoterHeader = (props) => (
      <Grid container direction="row" alignItems="center">
        <Grid item className={classes.voterOpacity}>
          <UserAvatar
            alt={voterUsername}
            className={classes.avatarImage}
            src={voterAvatar}
            style={{
              borderColor: voterLevelColor
            }}
            username={voterUsername}
          />
        </Grid>
        <Grid className={classes.keyUser} item>
          <YupLink
            style={{ textDecoration: 'none', color: '#fff' }}
            href={`/account/${voterUsername || vote.voter}`}
          >
            <Typography variant="body2" sx={{ mr: 1 }}>
              {headerDisplayName}
            </Typography>
          </YupLink>
        </Grid>
        <Grid item>
          {voterIsMirror && !voterIsAuth ? (
            <img
              src="/images/icons/twitter.svg"
              style={{
                height: '0.8rem',
                paddingLeft: '8px',
                paddingRight: '8px',
                display: 'grid'
              }}
              alt="twitter"
            />
          ) : null}
        </Grid>
      </Grid>
    );

    return (
      <ErrorBoundary>
        <div
          className={classes.interactionBar}
          style={hideInteractions ? { marginBottom: '-9px' } : {}}
        >
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid item>
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                {' '}
                {hideInteractions ? null : (
                  <Grid item>
                      <Grid container direction="row" alignItems="center">
                        <Grid item className={classes.voterOpacity}>
                          <VoterHeader />
                        </Grid>
                      </Grid>
                    </Grid>
                )}
                <Grid item className={classes.voterOpacity}>
                  <FontAwesomeIcon
                    className={classes.voterOpacity}
                    icon={vote.like ? faThumbsUp : faThumbsDown}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="body2" className={classes.time}>
                {formattedVoteTime}
              </Typography>
            </Grid>
          </Grid>
        </div>
      </ErrorBoundary>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  const account = accountInfoSelector(state);
  return {
    ...ownProps,
    account,
    username: account && account.name,
    levels: state.socialLevels.levels || {
      isLoading: true,
      levels: {}
    }
  };
};

PostHeader.propTypes = {
  dispatch: PropTypes.func.isRequired,
  levels: PropTypes.object.isRequired,
  postid: PropTypes.string.isRequired,
  hideInteractions: PropTypes.bool,
  author: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  username: PropTypes.string,
  account: PropTypes.object
};

export default connect(mapStateToProps)(
  withRouter(withStyles(styles)(PostHeader))
);
