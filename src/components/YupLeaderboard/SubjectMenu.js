import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Select, MenuItem, InputLabel } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import PropTypes from 'prop-types'
import { parseSettings } from '../../utils/yup-list'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

const styles = (theme) => ({
  formControl: {
    minWidth: 100,
    color: 'black',
    [theme.breakpoints.down('xs')]: {
      minWidth: 20
    }
  },
  textField: {
    fontFamily: 'Gilroy',
    fontSize: '12px'
  },
  menu: {
    fontFamily: 'Gilroy', fontSize: '11px'
  }
})

class SubjectMenu extends Component {
  handleChange = (e) => {
    const newSubject = e.target.value
    const { history, config, listOptions } = this.props
    const newSettings = parseSettings({
      ...config,
      subject: newSubject
    }, listOptions)
    const { site, subject, category } = newSettings
    const listsUrl = `/leaderboard?site=${site.name}&subject=${subject.name}&category=${category.name}`
    history.push(listsUrl)
}

  render () {
    const { classes, settings } = this.props
    const { subject: currSubject, siteSubjs } = settings

    return (
      <ErrorBoundary>
        <FormControl className={classes.formControl}
          variant='outlined'
        >
          <InputLabel htmlFor='age-native-helper'
            style={{ fontSize: '12px' }}
          >Subject</InputLabel>
          <Select
            className={classes.textField}
            inputProps={{
              className: classes.textField
            }}
            labelWidth='44'
            value={currSubject.name}
            onChange={this.handleChange}
            MenuProps={{
           getContentAnchorEl: null,
           anchorOrigin: {
             vertical: 'bottom'
           }
         }}
            color='third'
          >
            { siteSubjs.map(subj => (
              <MenuItem
                className={classes.menu}
                value={subj.name}
                color='third'
              > {subj.displayName} </MenuItem>))}
          </Select>
        </FormControl>
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = (state) => {
  const { router, yupListSettings } = state
  const config = {
    site: router.location.query.site,
    subject: router.location.query.subject,
    category: router.location.query.category
  }
  const { listOptions } = yupListSettings
  const settings = parseSettings(config, listOptions)
  return { config, settings, listOptions }
}

SubjectMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  listOptions: PropTypes.array.isRequired
}

export default connect(mapStateToProps)(withRouter(withStyles(styles)(SubjectMenu)))
