import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
// import Img from 'react-image'
import { Grid, Tooltip, Typography } from '@material-ui/core'
import LinesEllipsis from 'react-lines-ellipsis'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import axios from 'axios'
import CldImg from '../../components/Miscellaneous/CldImg'
import CldVid from '../../components/Miscellaneous/CldVid'
import { trimURL, getFavicon } from '../../utils/url'

const { RARIBLE_API } = process.env

// TODO: Simplify regex, put in utils file

const ZORA_TAGS = ['zora.co']
const zoraSearch = `.*(${ZORA_TAGS.join(').*|.*(')}).*`
const zoraQuery = new RegExp(zoraSearch, 'i')

const SUPERRARE_TAGS = ['superrare.co/artwork-v2', 'superrare.com/artwork-v2']
const superrareSearch = `.*(${SUPERRARE_TAGS.join(').*|.*(')}).*`
const superrareQuery = new RegExp(superrareSearch, 'i')

const RARIBLE_TAGS = ['app.rarible.com/token', 'rarible.com/token']
const raribleSearch = `.*(${RARIBLE_TAGS.join(').*|.*(')}).*`
const raribleQuery = new RegExp(raribleSearch, 'i')

const knownOriginSearch = '^((http:|https:)([/][/]))?(www.)?knownorigin.io/gallery/[^/]*[/]?$'
const knownOriginQuery = new RegExp(knownOriginSearch, 'i')

const foundationSearch = '^((http:|https:)([/][/]))?(www.)?foundation.app/(.+)/(.+)[^/]$'
const foundationQuery = new RegExp(foundationSearch, 'i')

const styles = theme => ({
  container: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    [theme.breakpoints.down('sm')]: {
      borderTopLeftRadius: '0px',
      borderTopRightRadius: '0px'
    }
  },
  link: {
    textDecoration: 'none',
    color: '#fff',
    '&:visited': {
      textDecoration: 'none',
      color: '#fff'
    }
  },
  linkImg: {
    width: '100%',
    minHeight: '15rem',
    maxHeight: '30rem',
    objectFit: 'cover',
    background: 'linear-gradient(0deg,#1b1b1b,#ffffff00,#ffffff00)',
    objectPosition: '50% 50%',
    alignItems: 'center',
    borderRadius: '0.5rem 0.5rem 0px 0px',
    position: 'relative',
    [theme.breakpoints.up('1700')]: {
      maxHeight: '25rem',
      width: '100%'
    },
    [theme.breakpoints.down('xs')]: {
      borderRadius: '0px'
    }
  },
  previewContainer: {
    textDecoration: 'none',
    color: theme.palette.common.first,
    '&:visited': {
      textDecoration: 'none',
      color: theme.palette.common.first
    },
    maxHeight: '500px'
  },
  title: {
    position: 'relative',
    textShadow: `0px 0px 5px ${theme.palette.alt.first}aa`,
    color: theme.palette.common.first,
    opacity: 0.9,
    [theme.breakpoints.down('md')]: {
      width: 'auto'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.2rem'
    }
  },
  description: {
    position: 'relative',
    fontSize: '12px',
    textShadow: `0px 0px 5px ${theme.palette.alt.first}88`,
    fontWeight: 300,
    lineHeight: 1.3,
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px'
    }
  },
  credits: {
    position: 'relative',
    fontSize: '14px',
    textShadow: `0px 0px 5px ${theme.palette.alt.first}88`,
    fontWeight: 400,
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px'
    }
  },
  url: {
    position: 'relative',
    fontSize: '10px',
    fontWeight: '100',
    overflowWrap: 'break-word',
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    width: '70%',
    marginTop: '0px',
    display: 'none'
  },
  previewData: {
    position: 'absolute',
    bottom: '0px',
    textAlign: 'left',
    width: '100%',
    zIndex: 5,
    background: `linear-gradient(${theme.palette.alt.second}00, ${theme.palette.alt.second}46, ${theme.palette.alt.second}ae, ${theme.palette.alt.second}dd, ${theme.palette.alt.second}ed, ${theme.palette.alt.second}fe, ${theme.palette.alt.second}, ${theme.palette.alt.second})`,
    padding: '2% 3% 3% 3%',
    backdropFilter: 'blur(2px)'
  }
})

class NFTPreview extends Component {
  state = {
    creator: '',
    owners: []
  }

  async getCreatorAndOwners () {
    await this.getCreator()
    await this.getOwners()
  }

  async getCreator () {
    const { previewData } = this.props
    const raribleNFT = previewData.url && previewData.url.match(raribleQuery)
    const superrareNFT = previewData.url && previewData.url.match(superrareQuery)
    const foundationNFT = previewData.url && previewData.url.match(foundationQuery)
    const zoraNFT = previewData.url && previewData.url.match(zoraQuery)
    const knownOriginNFT = previewData.url && previewData.url.match(knownOriginQuery)

    if (raribleNFT && previewData[0] && previewData[0].item) {
      const res = await axios.get(
        `${RARIBLE_API}/${previewData[0].item.creator}`
      )
      this.setState({
        creator: res.data.username
      })
    } else if (superrareNFT && previewData.createdBy) {
      this.setState({
        creator: previewData.createdBy
      })
    } else if (
      (foundationNFT || zoraNFT || knownOriginNFT) &&
      previewData.creator
    ) {
      this.setState({
        creator: previewData.creator
      })
    }
  }

  async getOwners () {
    const { previewData } = this.props
    const raribleNFT = previewData.url && previewData.url.match(raribleQuery)
    const foundationNFT = previewData.url && previewData.url.match(foundationQuery)
    const zoraNFT = previewData.url && previewData.url.match(zoraQuery)

    if (raribleNFT && previewData[0] && previewData[0].item) {
      previewData[0].item.owners.forEach(async owner => {
        const res = await axios.get(`${RARIBLE_API}/${owner}`)
        if (res.data.username && res.data.username !== this.state.creator) {
          this.setState({
            owners: [...this.state.owners, res.data.username]
          })
        }
      })
    } else if ((foundationNFT || zoraNFT) && previewData.owner) {
      if (previewData.owner !== this.state.creator) {
        this.setState({
          owners: [...this.state.owners, previewData.owner]
        })
      }
    }
  }

  componentDidMount () {
    if (!this.props.previewData) { return }
    this.getCreatorAndOwners()
  }

  render () {
    const {
      image,
      title,
      description,
      url,
      classes,
      caption,
      mimeType,
      postid
    } = this.props
    let faviconURL = null

    if (url != null) {
      faviconURL = getFavicon(url)
    }

    const isVideo = image && ((image.substring(image.lastIndexOf('.') + 1, image.length) === 'mp4') || (mimeType && mimeType.includes('video')))

    return (
      <ErrorBoundary>
        <div className={classes.container}
          href={url}
          target='_blank'
        >
          <a
            className={classes.link}
            href={url || window.location.href}
            rel='noopener noreferrer'
            target='_blank'
          >
            <div
              className={classes.previewContainer}
              href={url}
              rel='noopener noreferrer'
              target='_blank'
            >
              {isVideo ? (
                <CldVid
                  className={classes.linkImg}
                  style={{ overFlow: 'hidden', maxHeight: '1000px' }}
                  src={image}
                  postid={postid}
                  alt={description}
                  height='auto'
                  width='100%'
                  playing
                  muted
                  loop
                  playsinline
                />
              ) : (
                <CldImg
                  className={classes.linkImg}
                  postid={postid}
                  src={image}
                  alt={description}
                />
              )}
              <div className={classes.previewData}>
                <Grid container
                  direction='column'
                  spacing={1}
                  justify='center'
                >
                  <Grid item>
                    <Grid alignItems='center'
                      container
                      direction='row'
                    >
                      <Grid item>
                        <CldImg
                          align='right'
                          href={url}
                          src={faviconURL}
                          style={{
                            height: 30,
                            width: 30,
                            marginRight: '0.5rem',
                            border: 'none'
                          }}
                          target='_blank'
                          alt={faviconURL}
                        />
                      </Grid>
                      <Grid item>
                        <Typography variant='h6'
                          className={classes.title}
                        >
                          <LinesEllipsis
                            basedOn='letters'
                            ellipsis='...'
                            maxLine='2'
                            text={title}
                            trimRight
                          />
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  {(this.state.creator || this.state.owners.length > 0) && (
                    <Grid item>
                      <Grid
                        justify='left'
                        container
                        direction='row'
                        alignItems='center'
                        spacing={0}
                        style={{ height: '30px' }}
                      >
                        {this.state.creator && (
                          <Grid item
                            xs={this.state.owners.length > 0 ? 4 : 6}
                          >
                            <Tooltip
                              title='Creator'
                              placement='top'
                              arrow
                              disableTouchListener
                            >
                              <Typography variant='body2'>
                                <LinesEllipsis
                                  basedOn='letters'
                                  ellipsis='...'
                                  maxLine='1'
                                  text={
                                    `🧑‍🎨` +
                                    `\u00A0` +
                                    ` ${this.state.creator}`
                                  }
                                  trimRight
                                />
                              </Typography>
                            </Tooltip>
                          </Grid>
                        )}
                        {this.state.owners.length > 0 && (
                          <Grid item
                            xs={this.state.creator ? 4 : 4}
                          >
                            <Tooltip
                              title='Owner'
                              placement='top'
                              arrow
                              disableTouchListener
                            >
                              <Typography variant='body2'>
                                <LinesEllipsis
                                  basedOn='letters'
                                  ellipsis='...'
                                  maxLine='1'
                                  text={
                                    `🗝` +
                                    `\u00A0\u00A0` +
                                    `${this.state.owners.join(', ')}`
                                  }
                                  trimRight
                                />
                              </Typography>
                            </Tooltip>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  )}
                  <Grid item>
                    <Typography variant='body2'>
                      <LinesEllipsis
                        basedOn='letters'
                        ellipsis='...'
                        maxLine='2'
                        text={description || caption}
                        trimRight
                      />
                    </Typography>
                    <Typography className={classes.url}>{url && trimURL(url)}</Typography>
                  </Grid>
                </Grid>
              </div>
            </div>
          </a>
        </div>
      </ErrorBoundary>
    )
  }
}

NFTPreview.propTypes = {
  previewData: PropTypes.object,
  image: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  mimeType: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  postid: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(NFTPreview)
