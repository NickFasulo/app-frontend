import React from 'react'
import PropTypes from 'prop-types'
import { Dialog, Grid, DialogContent, DialogTitle, Typography, Icon } from '@material-ui/core'
import IconButton from '@mui/material/IconButton'
import { withStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const styles = theme => ({
  dialog: {
    marginLeft: '200px',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 'inherit'
    }
  },
  dialogTitle: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(1.5)
  },
  dialogTitleText: {
    fontSize: '1.3rem',
    fontFamily: 'Gilroy',
    fontWeight: '300',
    color: theme.palette.M100
  },
  dialogContent: {
    root: {
      margin: 0,
      padding: theme.spacing(2),
      color: theme.palette.M100
    }
  },
  dialogContentText: {
    root: {
      paddingBottom: '2rem',
      paddingTop: '2rem'
    }
  },
  firstButton: {
    flexGrow: 1
  }
})

function YupPopup (props) {
  const { classes, firstButton, secondButton, buttonPosition, headline, description, children, ...restProps } = props
  const full = buttonPosition === 'full'
  const reverse = buttonPosition === 'right'
  return (
    <Dialog
      {...restProps}
    >
      <DialogTitle
        style={{ paddingBottom: '10px' }}
      >
        <Typography variant='h5'>
          {headline}
        </Typography>
        {restProps.onClose ? (
          <IconButton
            aria-label='close'
            onClick={restProps.onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <Icon fontSize='small'
              className='fal fa-close'
            />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent>
        <Grid container
          spacing={2}>
          <Grid item>
            <Typography variant='b2'>{description}</Typography>
          </Grid>

          <Grid >{children}</Grid>
          <Grid container
            item
            spacing={2}
            xs={12}
            direction={reverse && 'row-reverse'}
            alignItems='stretch'>
            {firstButton && (<Grid item
              className={clsx(full && classes.firstButton)}>
              {firstButton}
            </Grid>)}

            {secondButton && (<Grid item
              xs={full && 6}>
              {secondButton}
            </Grid>)}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

YupPopup.propTypes = {
  classes: PropTypes.object.isRequired,
  firstButton: PropTypes.object,
  secondButton: PropTypes.object,
  buttonPosition: PropTypes.string,
  headline: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.object,
  handleDialogClose: PropTypes.func

}

export default (withStyles(styles)(YupPopup))
