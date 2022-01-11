import React from 'react'
import PropTypes from 'prop-types'
import { TextField, InputAdornment, IconButton } from '@material-ui/core'
import { withStyles, useTheme } from '@material-ui/core/styles'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

const styles = theme => ({
  input: {
    color: theme.palette.common.fifth,
    cssUnderline: {
      '&:after': {
        borderBottomColor: theme.palette.common.fifth
      }
    },
    fontFamily: 'Gilroy'
  },
  inputRoot: {
    color: theme.palette.common.fifth
  },
  inputInput: {
    color: theme.palette.common.fifth
  },
  inputUnderline: {
    borderBottomColor: theme.palette.common.fifth
  },
  textField: {
    color: theme.palette.common.fifth,
    flexWrap: 'none',
    fontFamily: 'Gilroy'
  }
})

const YupInput = ({ classes, maxLength, onSubmit, inputIsValid, ...restProps }) => {
  console.log(`inputIsValid`, inputIsValid)
  const theme = useTheme()
  const endAdornment = onSubmit
    ? <InputAdornment position='end'>
      <IconButton
        onClick={onSubmit}
        edge='end'
      >
        <ArrowForwardIcon style={{ opacity: inputIsValid ? 1 : 0.5 }} />
      </IconButton>
    </InputAdornment> : null

  return (
    <TextField
      {...restProps}
      className={classes.textField}
      inputProps={{ maxLength, borderBottomColor: theme.palette.second }}
      InputProps={{
                endAdornment,
                classes: {
                    root: classes.inputRoot,
                    input: classes.inputInput,
                    underline: classes.inputUnderline
                },
                className: classes.input }}
      InputLabelProps={{
                style: {
                    color: theme.palette.third
                }
            }}
    />
  )
}

YupInput.propTypes = {
    classes: PropTypes.object.isRequired,
    maxLength: PropTypes.number,
    onSubmit: PropTypes.func,
    inputIsValid: PropTypes.bool.isRequired
  }

export default (withStyles(styles)(YupInput))
