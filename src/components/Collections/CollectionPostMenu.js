import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { IconButton, MenuItem, Menu, Snackbar, SnackbarContent } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import axios from 'axios'
import CollectionPostDialog from './CollectionPostDialog.js'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { addPostToCollection, removePostFromCollection } from '../../redux/actions'
import { accountInfoSelector } from '../../redux/selectors'

const BACKEND_API = process.env.BACKEND_API

const styles = theme => ({
  button: {
    color: '#c4c4c4',
    marginBottom: '25px'
  },
  snack: {
    justifyContent: 'center'
  },
  menuItem: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '10px'
    }
  }
})

class CollectionPostMenu extends Component {
  state = {
    anchorEl: null,
    dialogOpen: false,
    snackbarMsg: ''
  }

  handleMenuClick = ({ currentTarget }) => this.setState({ anchorEl: currentTarget })
  handleMenuClose = () => this.setState({ anchorEl: null })
  handleDialogOpen = () => this.setState({ dialogOpen: true })
  handleDialogClose = () => this.setState({ dialogOpen: false })
  handleSnackbarOpen = (msg) => this.setState({ snackbarMsg: msg })
  handleSnackbarClose = () => this.setState({ snackbarMsg: '' })

  addToCollection = async (collection) => {
    try {
      const { postid, addPostRedux, account, authToken } = this.props
      this.handleMenuClose()
      const params = { postId: postid, ...authToken }
      await axios.put(`${BACKEND_API}/collections/${collection._id}`, params)
      this.handleSnackbarOpen(`Succesfully added to ${collection.name}`)
      addPostRedux(account && account.name, collection, postid)
    } catch (err) {
      console.error(err)
      this.handleSnackbarOpen(`An error occured. Try again later.`)
    }
  }

  removeFromCollection = async (collection) => {
    try {
      const { postid, removePostRedux, account, authToken } = this.props
      this.handleMenuClose()
      const params = { postId: postid, ...authToken }
      await axios.put(`${BACKEND_API}/collections/remove/${collection._id}`, params)
      this.handleSnackbarOpen(`Succesfully removed post from ${collection.name}`)
      removePostRedux(account && account.name, collection, postid)
    } catch (err) {
      console.error(err)
      this.handleSnackbarOpen(`An error occured. Try again later.`)
    }
  }

  render () {
    const { postid, classes, account, collections } = this.props
    if (!postid || !account.name) return null
    const { anchorEl, snackbarMsg, dialogOpen } = this.state
    const accountName = account && account.name
    const collectionsPageId = window.location.href.split('/').pop()
    const menuOpen = Boolean(anchorEl)
    return (
      <>
        <Snackbar
          autoHideDuration={4000}
          onClose={this.handleSnackbarClose}
          open={!!snackbarMsg}
        >
          <SnackbarContent
            className={classes.snack}
            message={snackbarMsg}
          />
        </Snackbar>
        <IconButton
          aria-label='more'
          aria-controls='long-menu'
          aria-haspopup='true'
          onClick={this.handleMenuClick}
          className={classes.button}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id='long-menu'
          anchorEl={anchorEl}
          keepMounted
          open={menuOpen}
          onClose={this.handleMenuClose}
          PaperProps={{
            style: {
              width: '35ch',
              backgroundColor: 'black'
            }
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          <MenuItem dense
            onClick={this.handleDialogOpen}
            className={classes.menuItem}
          >
            New Collection...
          </MenuItem>
          {collections && accountName && collections.length > 0 && (
            collections.map((collection) => {
              if (!collection.postIds.includes(postid) && collectionsPageId !== collection._id) {
              return (
                <MenuItem dense
                  key={collection._id}
                  className={classes.menuItem}
                  onClick={() => this.addToCollection(collection)}
                >
                  Add to {collection.name}
                </MenuItem>
            )
              } else {
                return (
                  <MenuItem dense
                    key={collection._id}
                    className={classes.menuItem}
                    onClick={() => this.removeFromCollection(collection)}
                  >
                    Remove from {collection.name}
                  </MenuItem>
                )
              }
          })
          )}
        </Menu>
        <CollectionPostDialog
          account={account}
          dialogOpen={dialogOpen}
          postid={postid}
          handleDialogClose={this.handleDialogClose}
        />
      </>
  )
      }
}

CollectionPostMenu.propTypes = {
  postid: PropTypes.string,
  classes: PropTypes.object.isRequired,
  authToken: PropTypes.object,
  account: PropTypes.object.isRequired,
  collections: PropTypes.array.isRequired,
  addPostRedux: PropTypes.func.isRequired,
  removePostRedux: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => {
  const account = accountInfoSelector(state)
  const { collections } = state.userCollections[account.name] || {}
  const authToken = state.authInfo

  return {
    authToken,
    account,
    collections
  }
}
const mapActionToProps = (dispatch) => {
  return {
    addPostRedux: (eosname, collection, postid) => dispatch(addPostToCollection(eosname, collection, postid)),
    removePostRedux: (eosname, collection, postid) => dispatch(removePostFromCollection(eosname, collection, postid))
    }
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(CollectionPostMenu))
