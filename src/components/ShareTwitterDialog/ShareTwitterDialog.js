import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Dialog, DialogTitle, DialogContent, DialogContentText, Typography, Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import LoaderButton from '../Miscellaneous/LoaderButton'
import {
TwitterShareButton
} from 'react-share'
import Colors from '../../utils/colors'

const WEB_APP_URL = process.env.WEB_APP_URL

const styles = theme => ({
  dialog: {
    width: '100%'
  },
  twitterButton: {
    width: '100%'
  },
  loaderButton: {
    background: Colors.Green
  }
})
class ShareTwitterDialog extends Component {
    render () {
        const { handleDialogClose, dialogOpen, classes, rewards } = this.props
        return (
          <ErrorBoundary >
            <Dialog open={dialogOpen}
              onClose={() => handleDialogClose()}
              aria-labelledby='form-dialog-title'
              className={classes.dialog}
            ><DialogTitle style={{ paddingBottom: '10px' }}>
              <Typography
                align='left'
                className={classes.dialogTitleText}
                variant='h3'
              >
                {`You have been allocated ${Math.round(rewards)} YUP!`}
              </Typography>
            </DialogTitle>
              <DialogContent>
                <DialogContentText style={{ padding: '20px 0px' }}>
                  <Typography
                    align='left'
                    className={classes.dialogContentText}
                    variant='h5'
                  >
                    <span className={classes.desktop}>
                      Please share on Twitter to claim your rewards. You should receive your tokens within a few minutes.
                    </span>
                  </Typography>
                </DialogContentText>
                <TwitterShareButton
                  className={classes.twitterButton}
                  url={`${WEB_APP_URL}/rewards`}
                  title={`Claiming creator rewards on @yup_io`}
                  hashtags={['YUP']}
                  windowWidth={20000}
                  windowHeight={20000}
                  onShareWindowClose={() => handleDialogClose()}
                > <Grid container
                  alignItems='center'
                  spacing={1}
                  className={classes.twitterButton}
                  >
                  <Grid item
                    className={classes.twitterButton}
                  >
                    <LoaderButton
                      className={classes.loaderButton}
                      fullWidth
                      buttonText='Share on Twitter'
                      variant='contained'
                    />
                  </Grid>
                </Grid>
                </TwitterShareButton>
              </DialogContent>
            </Dialog>
          </ErrorBoundary>
              )
    }
}

ShareTwitterDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    dialogOpen: PropTypes.bool.isRequired,
    handleDialogClose: PropTypes.func.isRequired,
    rewards: PropTypes.number
  }
  export default withStyles(styles)(ShareTwitterDialog)
