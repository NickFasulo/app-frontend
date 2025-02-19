import React from 'react'
import PropTypes from 'prop-types'
import { TextField } from '@material-ui/core'
import { withStyles, useTheme } from '@material-ui/core/styles'

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

const YupInput = ({ classes, maxLength, ...restProps }) => {
  const theme = useTheme()
  return (
    <TextField
      {...restProps}
      className={classes.textField}
      inputProps={{ maxLength, borderBottomColor: theme.palette.second }}
      InputProps={{
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
    maxLength: PropTypes.number
  }

export default (withStyles(styles)(YupInput))
