import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  Grid,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import withStyles from '@mui/styles/withStyles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/pro-light-svg-icons';
import clsx from 'clsx';
import { FlexBox } from '../styles';

const styles = (theme) => ({
  dialog: {
    marginLeft: '200px',
    [theme.breakpoints.down('md')]: {
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
  },
  secondButton: {
    marginRight: '10px'
  }
});

function YupDialog(props) {
  const {
    classes,
    firstButton,
    secondButton,
    buttonPosition,
    headline,
    description,
    children,
    ...restProps
  } = props;
  const full = buttonPosition === 'full';
  const reverse = buttonPosition === 'right';
  return (
    <Dialog {...restProps}>
      <DialogTitle style={{ paddingBottom: '10px' }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h6">{headline}</Typography>
          </Grid>
          <Grid item>
            {restProps.onClose ? (
              <IconButton
                aria-label="close"
                onClick={restProps.onClose}
                sx={{
                  width: 35,
                  height: 35,
                  color: (theme) => theme.palette.M150
                }}
                size="small"
              >
                <FontAwesomeIcon icon={faXmark} />
              </IconButton>
            ) : null}
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Typography variant="b2">{description}</Typography>
          </Grid>
          <Grid item>{children}</Grid>
          <Grid item>
            <Grid
              container
              xs={12}
              direction={reverse ? 'row-reverse' : 'row'}
              alignItems="stretch"
            >
              {firstButton && (
                <Grid item className={clsx(full && classes.firstButton)}>
                  {firstButton}
                </Grid>
              )}

              {secondButton && (
                <Grid item xs={full && 6} className={classes.secondButton}>
                  {secondButton}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

YupDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  firstButton: PropTypes.object,
  secondButton: PropTypes.object,
  buttonPosition: PropTypes.string,
  headline: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.object,
  handleDialogClose: PropTypes.func
};

export default withStyles(styles)(YupDialog);
