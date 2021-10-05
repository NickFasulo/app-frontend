
import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import Img from 'react-image'

const DEFAULT_IMG = `https://app-gradients.s3.amazonaws.com/gradient${Math.floor(Math.random() * 5) + 1}.png`

const styles = theme => ({
    link: {
      textDecoration: 'none',
      color: '#fff'
    },
    collectionImg: {
      height: '60px',
      width: '60px',
      objectFit: 'cover',
      borderRadius: '5px',
      [theme.breakpoints.down('md')]: {
        height: '50px',
        width: '50px'
      },
      [theme.breakpoints.down('xs')]: {
        height: '40px',
        width: '40px',
        marginTop: '5px'
      }
    },
    collection: {
        flexBasis: 'unset',
        padding: '8px 8px 8px 0px !important'
      },
    collectionContainer: {
      borderRadius: 10,
      margin: 0,
      '&:hover': {
        background: '#fafafa05'
      }
    }
  })
  function isValidHttpUrl (string) {
    let url
    try {
      url = new URL(string)
    } catch (_) {
      return false
    }
    return url.protocol === 'http:' || url.protocol === 'https:'
  }

const CollectionItem = ({ classes, collection, username }) => {
    const fmtCollectionName = collection && collection.name.replace(/\s+/g, '-').toLowerCase()
    const collectionLength = collection.postIds.length
    const collectionSubheader = username === collection.owner
        ? collectionLength === 1
          ? `1 post`
          : `${collectionLength} posts`
        : collection.owner

    return (
      <Link
        to={`/collections/${encodeURIComponent(fmtCollectionName)}/${collection._id}`}
        className={classes.link}
      >
        <Grid
          container
          direction='row'
          justify='flex-start'
          alignItems='center'
          spacing={3}
          className={classes.collectionContainer}
        >
          <Grid item
            xs={2}
            lg={3}
            xl={2}
            className={classes.collection}
          >
            <Img
              src={isValidHttpUrl(collection.imgSrcUrl) ? [collection.imgSrcUrl, DEFAULT_IMG] : DEFAULT_IMG}
              alt='thumbnail'
              className={classes.collectionImg}
            />
          </Grid>
          <Grid item
            xs={10}
            lg={9}
            xl={10}
          >
            <Typography variant='h5'>{collection.name}</Typography>
            <Typography variant='body2'>{collectionSubheader}</Typography>
          </Grid>
        </Grid>
      </Link>
    )
  }

  CollectionItem.propTypes = {
    classes: PropTypes.object.isRequired,
    collection: PropTypes.array.isRequired,
    username: PropTypes.string
  }

  export default (withStyles(styles)(CollectionItem))
