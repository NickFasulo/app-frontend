import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import FollowButton from './FollowButton'
import { Link } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import { levelColors } from '../../utils/colors'
import UserAvatar from '../UserAvatar/UserAvatar'
import numeral from 'numeral'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import { fetchSocialLevel } from '../../redux/actions'
import { accountInfoSelector } from '../../redux/selectors'

const styles = theme => ({
  dialogTitle: {
    margin: 0,
    padding: theme.spacing(1.5)
  },
  gridRoot: {
    flexGrow: 1
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(),
    top: theme.spacing(),
    color: 'black',
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  followButton: {
    margin: theme.spacing()
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  dialogContent: {
    root: {
      margin: 0,
      padding: theme.spacing(2)
    }
  },
  user: {
    display: 'flex',
    padding: '3% 0% 3% 0%',
    paddingTop: '2%',
    alignItems: 'center'
  },
  avatar: {
    height: '30px',
    paddingRight: '5%'
  },
  avatarImage: {
    width: '30px',
    height: '30px',
    borderRadius: '50%'
  },
  progress: {
    margin: theme.spacing(2),
    color: '#ffffff'
  },
  Typography: {
    fontFamily: 'Gilroy'
  }
})

class FollowersDialog extends Component {
  state = {
    open: false
  }

  handleClickOpen = () => {
    this.setState({
      open: true
    })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render () {
    const { account, classes, followersInfo, levels, dispatch } = this.props
    const { isLoading, followers } = followersInfo
    const formattedFollowers = numeral(followers.length)
      .format('0a')
      .toUpperCase()
    return (
      <ErrorBoundary>
        <Fragment>
          <Button
            disableRipple
            onClick={this.handleClickOpen}
          >
            <Typography
              align='left'
              variant='body2'
            >
              <a style={{ fontWeight: 700 }}>{formattedFollowers} </a> followers
            </Typography>
          </Button>
          <Dialog
            aria-labelledby='customized-dialog-title'
            fullWidth
            maxWidth='xs'
            onClose={this.handleClose}
            open={this.state.open}
          >
            <DialogTitle
              className={classes.dialogTitle}
              disableTypography
              id='customized-dialog-title'
              onClose={this.handleClose}
            >
              <Typography variant='h3'>Followers</Typography>
              <IconButton
                aria-label='Close'
                className={classes.closeButton}
                disableRipple
                onClick={this.handleClose}
              >
                <CloseIcon style={{ marginTop: '4px', color: '#a0a0a0' }} />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              {isLoading ? (
                <div align='center'>
                  <CircularProgress className={classes.progress} />
                </div>
              ) : (
                <Grid container
                  direction='column'
                >
                  {' '}
                  {followers.length === 0 ? (
                    <Typography
                      variant='h5'
                    >
                      No followers
                    </Typography>
                  ) : (
                    followers.map(follower => {
                    if (!levels[follower._id]) {
                      dispatch(fetchSocialLevel(follower._id))
                      return <div />
                     } if (levels[follower._id].isLoading) {
                      return <div />
                    }
                      const eosname = follower._id
                      const level = levels[eosname]
                      const username = level && level.levelInfo.username
                      const quantile = level && level.levelInfo.quantile
                      let socialLevelColor = levelColors[quantile]

                      return (
                        <Grid item
                          key={follower._id}
                        >
                          <div className={classes.user}>
                            <Grid
                              alignItems='center'
                              container
                              direction='row'
                              justify='space-between'
                            >
                              <Grid item>
                                <Grid
                                  alignItems='center'
                                  container
                                  direction='row'
                                  spacing='16'
                                >
                                  <Grid item>
                                    <UserAvatar
                                      username={username || eosname}
                                      className={classes.avatarImage}
                                      src={follower.avatar}
                                    />
                                  </Grid>
                                  <Grid item>
                                    <Link
                                      onClick={this.handleClose}
                                      style={{
                                        textDecoration: 'none',
                                        color: 'inherit'
                                      }}
                                      to={`/${follower._id}`}
                                    >
                                      <Typography
                                        style={{
                                          textDecoration: socialLevelColor
                                            ? 'underline'
                                            : 'none',
                                          textDecorationColor: socialLevelColor,
                                          textDecorationStyle: socialLevelColor
                                            ? 'solid'
                                            : 'none',
                                          marginLeft: '1rem'
                                        }}
                                        variant='caption'
                                      >
                                        {username || eosname}
                                      </Typography>
                                    </Link>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item>
                                <FollowButton
                                  account={account}
                                  className={classes.followButton}
                                  eosname={eosname}
                                  isLoggedIn={
                                    account && account.name === eosname
                                  }
                                  style={{ fontFamily: 'Gilroy' }}
                                />
                              </Grid>
                            </Grid>
                          </div>
                        </Grid>
                      )
                    })
                  )}
                </Grid>
              )}
            </DialogContent>
          </Dialog>
        </Fragment>
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { username } = ownProps
  const account = accountInfoSelector(state)
  return {
    account,
    levels: state.socialLevels.levels || {
      isLoading: true,
      levels: {}
    },
    followersInfo: state.followersByUser[username] || {
      isLoading: true,
      followers: [],
      error: false
    }
  }
}

FollowersDialog.propTypes = {
  dispatch: PropTypes.func.isRequired,
  account: PropTypes.object,
  levels: PropTypes.object,
  classes: PropTypes.object.isRequired,
  followersInfo: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(withStyles(styles)(FollowersDialog))
