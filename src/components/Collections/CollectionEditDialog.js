import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  DialogActions,
  SnackbarContent,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import axios from 'axios'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import YupInput from '../Miscellaneous/YupInput'
import LoaderButton from '../Miscellaneous/LoaderButton'

const BACKEND_API = process.env.BACKEND_API
const TITLE_LIMIT = 30
const DESC_LIMIT = 140

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
    color: '#fafafa'
  },
  dialogContent: {
    root: {
      margin: 0,
      padding: theme.spacing(2),
      color: '#fafafa'
    }
  },
  snack: {
    justifyContent: 'center'
  }
})

const CollectionEditDialog = ({
  collection,
  classes,
  dialogOpen,
  handleDialogClose,
  history,
  authToken
}) => {
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')
  const [snackbarMsg, setSnackbarMsg] = useState('')
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isLoadingDelete, setIsLoadingDelete] = useState(false)

  const handleNameChange = ({ target }) => setName(target.value)
  const handleDescriptionChange = ({ target }) => setDescription(target.value)
  const handleSnackbarOpen = msg => setSnackbarMsg(msg)
  const handleSnackbarClose = () => setSnackbarMsg('')

  const handleEditCollection = async () => {
    try {
      setIsLoadingUpdate(true)
      if (authToken.account && authToken.account.eosname) {
        authToken.eosname = authToken.account.eosname
      }
      const params = { name, description, ...authToken }
      await axios.put(`${BACKEND_API}/collections/${collection._id}`, params)
      setIsLoadingUpdate(false)
      handleSnackbarOpen('Succesfully updated your collection')
      handleDialogClose()
    } catch (err) {
      handleSnackbarOpen('There was a problem updating your collection')
      console.error(err)
      setIsLoadingUpdate(false)
    }
  }

  const handleDeleteCollection = async () => {
    try {
      setIsLoadingDelete(true)
      if (authToken.account && authToken.account.eosname) {
        authToken.eosname = authToken.account.eosname
      }
      const params = { ...authToken }
      await axios.delete(`${BACKEND_API}/collections/${collection._id}`, {
        data: params
      })
      history.push(`/${authToken.eosname}`)
    } catch (err) {
      handleSnackbarOpen('There was a problem deleting your collection')
      console.error(err)
      setIsLoadingDelete(false)
    }
  }

  return (
    <>
      <Snackbar
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        open={!!snackbarMsg}
      >
        <SnackbarContent className={classes.snack}
          message={snackbarMsg}
        />
      </Snackbar>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle className={classes.dialogTitleText}
          id='form-dialog-title'
        >
          <Typography variant='h3'>Update {collection.name}</Typography>
        </DialogTitle>
        <DialogContent>
          <YupInput
            fullWidth
            maxLength={TITLE_LIMIT}
            onChange={handleNameChange}
            id='name'
            defaultValue={collection.name}
            label='Name'
            type='text'
          />
          <YupInput
            maxLength={DESC_LIMIT}
            fullWidth
            id='description'
            defaultValue={collection.description}
            onChange={handleDescriptionChange}
            label='Description'
            type='text'
          />
        </DialogContent>
        <DialogActions>
          <LoaderButton onClick={handleDeleteCollection}
            fullWidth
            buttonText='Delete'
            isLoading={isLoadingDelete}
            variant='outlined'
          />
          <LoaderButton onClick={handleEditCollection}
            fullWidth
            buttonText='Update'
            isLoading={isLoadingUpdate}
            variant='contained'
          />
        </DialogActions>
      </Dialog>
    </>
  )
}

const mapStateToProps = (state, ownProps) => {
  const authToken = state.authInfo
  return {
    authToken
  }
}

CollectionEditDialog.propTypes = {
  collection: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  authToken: PropTypes.object
}

export default withRouter(
  connect(mapStateToProps)(withStyles(styles)(CollectionEditDialog))
)
