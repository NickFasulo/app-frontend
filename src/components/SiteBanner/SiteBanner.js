import React, { useState } from 'react'
import { Snackbar, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const styles = () => ({
  root: {
    width: '100vw',
    textAlign: 'center'
  },
  message: {
    width: '95vw'
  }
})
const SiteBanner = ({ classes }) => {
  const [open, setOpen] = useState(true)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') { return }
    setOpen(false)
  }

  const action = (
    <IconButton
      size='small'
      aria-label='close'
      color='inherit'
      className={classes.icon}
      onClick={handleClose}
    >
      <CloseIcon fontSize='small' />
    </IconButton>
  )

  const message = (
    <a
      href='https://yup.mirror.xyz/rzRK52lDvnsO3Hxp8Tctdt2gjcVVmb4Jp6mxGVSi1KQ'
      target='_blank'
      style={{ textDecoration: 'none', color: 'black' }}
    >
      We just raised our $3.5M seed round! 🥳 Learn more here.
    </a>
  )

  return (
    <Snackbar
      open={open}
      width={800}
      autoHideDuration={1000000000}
      onClose={handleClose}
      action={action}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      style={{ marginTop: -22 }}
      message={message}
      ContentProps={{
        classes: {
          root: classes.root,
          message: classes.message
        }
      }}
    />
  )
}

SiteBanner.propTypes = {
   classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SiteBanner)
