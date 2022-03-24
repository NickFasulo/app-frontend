import React from 'react'
import { withStyles, AppBar } from '@material-ui/core'

const drawerWidth = 200

const styles = theme => ({
  topBar: {
    background: 'transparent',
    zIndex: theme.zIndex.drawer + 5,
    boxShadow: `0 0 0 ${theme.palette.M100}`,
    borderBottom: `0 solid ${theme.palette.M100}`,
    [theme.breakpoints.up('lg')]: {
      padding: '16px 316px'
    },
    [theme.breakpoints.down('lg')]: {
      padding: '16px 316px'
    },
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
    },
    [theme.breakpoints.down('md')]: {
      padding: '16px 103px'
    },
    [theme.breakpoints.down('sm')]: {
      padding: '16px 117px'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '16px 24px'
    }
  }
})

const TopBar = withStyles(styles)(function TopBar ({
  classes, children, ...restProps
}) {
  return (
    <AppBar
      className={classes.topBar}
      {...restProps}
    >
      {children}
    </AppBar>
  )
})

export default TopBar
