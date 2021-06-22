import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Select, MenuItem, InputLabel, FormControl } from '@material-ui/core'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { parseSettings } from '../../utils/yup-list'
import uniqBy from 'lodash/uniqBy'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

const styles = (theme) => ({
  formControl: {
    minWidth: 100,
    margin: 0,
    [theme.breakpoints.down('xs')]: {
      minWidth: 20
    }
  },
  textField: {
    fontFamily: 'Gilroy',
    color: 'white',
    fontSize: '12px',
    [theme.breakpoints.down('xs')]: {
      padding: 4
    }
  },
  menu: {
    fontFamily: 'Gilroy', fontSize: '11px'
  }
})

class SiteMenu extends Component {
  handleChange = (e) => {
    const { history, config, listOptions } = this.props
    const newSite = e.target.value
    const newSettings = parseSettings({
      ...config,
      site: newSite
    }, listOptions)
    const { site, subject, category } = newSettings
    const levelsUrl = `/leaderboard?site=${site.name}&subject=${subject.name}&category=${category.name}`
    history.push(levelsUrl)
}

  render () {
    const { classes, settings, listOptions } = this.props
    const { site: currSite } = settings

    const filteredOpts = uniqBy([{ location: { name: 'all', displayName: 'all' } }, ...listOptions], 'location.name')
    return (
      <ErrorBoundary>
        <FormControl className={classes.formControl}
          variant='outlined'
        >
          <InputLabel
            style={{ fontSize: '12px' }}
          >Platform</InputLabel>
          <Select
            type='dark'
            label='Where?'
            labelWidth='52'
            className={classes.textField}
            inputProps={{
              className: classes.textField
            }}
            value={currSite.name}
            onChange={this.handleChange}
            MenuProps={{
           getContentAnchorEl: null,
           anchorOrigin: {
             vertical: 'bottom'
           }
         }}
          >{
          filteredOpts.map((opt) => (
            <MenuItem
              className={classes.menu}
              value={opt.location.name}
            >
              {opt.location.displayName}
            </MenuItem>
          ))
        }
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

SiteMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  listOptions: PropTypes.array.isRequired
}

export default connect(mapStateToProps)(withRouter(withStyles(styles)(SiteMenu)))
