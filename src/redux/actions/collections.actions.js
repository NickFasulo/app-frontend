import { collectionsConstants as constants } from '../constants'
import axios from 'axios'
const BACKEND_API = process.env.BACKEND_API

export function fetchUserCollections (eosname) {
  return async dispatch => {
    dispatch(request(eosname))
    try {
      const collections = (await axios.get(`${BACKEND_API}/accounts/${eosname}/collections`)).data
      dispatch(success(eosname, collections))
    } catch (err) {
      dispatch(failure(eosname, err))
    }
  }

  function request (eosname) {
    return { type: constants.FETCH_USER_COLLECTIONS, eosname }
  }

  function success (eosname, collections) {
    return { type: constants.FETCH_USER_COLLECTIONS_SUCCESS, eosname, collections }
  }

  function failure (eosname, error) {
    return { type: constants.FETCH_USER_COLLECTIONS_FAILURE, eosname, error }
  }
}

export function addUserCollection (eosname, collection) {
  return { type: constants.ADD_USER_COLLECTION, eosname, collection }
}

export function addPostToCollection (eosname, collection, postid) {
  return { type: constants.ADD_POST_TO_COLLECTION, eosname, collection, postid }
}

export function removePostFromCollection (eosname, collection, postid) {
  return { type: constants.REM_POST_FROM_COLLECTION, eosname, collection, postid }
}

export function fetchCollectionById (collectionId) {
  return async dispatch => {
    dispatch(request(collectionId))
    try {
      const collection = (await axios.get(`${BACKEND_API}/collections/placeholder_name/${collectionId}`)).data
      dispatch(success(collection))
    } catch (err) {
      dispatch(failure(collectionId, err))
    }
  }

  function request (collectionId) {
    return { type: constants.FETCH_COLLECTION_ID, collectionId }
  }

  function success (collection) {
    return { type: constants.FETCH_COLLECTION_ID_SUCCESS, collection }
  }

  function failure (collectionId, error) {
    return { type: constants.FETCH_COLLECTION_ID_FAILURE, collectionId, error }
  }
}
