import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Feed from '../../components/Feed/Feed'
import { withStyles } from '@material-ui/core/styles'
import Img from 'react-image'
import { Fab, Typography, Grid, Button, IconButton, Icon, SnackbarContent, Snackbar, Fade, Tabs, Tab, Hidden, ThemeProvider, Menu, MenuItem } from '@material-ui/core'
import SideDrawer from '../../components/SideDrawer/SideDrawer'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import Tour from 'reactour'
import '../../components/Tour/tourstyles.css'
import axios from 'axios'
import DotSpinner from '../../components/DotSpinner/DotSpinner'
import MenuIcon from '@material-ui/icons/Menu'
import { Link } from 'react-router-dom'
import CollectionEditDialog from '../../components/Collections/CollectionEditDialog.js'
import CollectionReorderDialog from '../../components/Collections/CollectionReorderDialog'
import RecommendedCollections from '../../components/Collections/RecommendedCollections.js'
import { Helmet } from 'react-helmet'
import { levelColors } from '../../utils/colors'
import CreateCollectionFab from '../../components/Miscellaneous/CreateCollectionFab.js'
import { fetchSocialLevel } from '../../redux/actions'
import { accountInfoSelector } from '../../redux/selectors'

const BACKEND_API = process.env.BACKEND_API
const DEFAULT_IMG = `https://app-gradients.s3.amazonaws.com/gradient${Math.floor(
  Math.random() * 5
) + 1}.png`
const showTabs = window.innerWidth <= 960

const styles = theme => ({
  accountErrorHeader: {
    paddingTop: '15%',
    fontFamily: '"Gilroy", sans-serif',
    fontWeight: '600',
    fontSize: '1.5rem',
    color: '#ffffff'
  },
  accountErrorSub: {
    fontFamily: '"Gilroy", sans-serif',
    fontWeight: '500',
    fontSize: '1rem'
  },
  container: {
    height: '100vh',
    width: '100vw',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'scroll'
  },
  feedPage: {
    marginLeft: '40px',
    [theme.breakpoints.down('lg')]: {
      marginLeft: '30px',
      maxWidth: '550px'
    },
    [theme.breakpoints.down('xs')]: {
      width: '90vw',
      marginLeft: '5vw'
    }
  },
  collectionHeader: {
    position: 'sticky',
    top: '60px',
    background: `linear-gradient(${theme.palette.alt.second} 100%, ${theme.palette.alt.second}dd 10%)`,
    borderRadius: '5px',
    zIndex: 1000,
    marginBottom: '25px',
    paddingLeft: '60px !important',
    [theme.breakpoints.down('lg')]: {
      paddingLeft: '40px !important'
    },
    [theme.breakpoints.down('xs')]: {
      paddingLeft: '20px !important',
      top: 0,
      marginBottom: '0px',
      marginLeft: '0px'
    }
  },
  menuItem: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '10px'
    }
  },
  collectionContainer: {
    [theme.breakpoints.down('xs')]: {
      width: '100vw',
      margin: '0px'
    }
  },
  Mask: {
    outline: 'solid 0px #FAFAFA44'
  },
  page: {
    width: '100vw',
    marginTop: '50px',
    [theme.breakpoints.down('md')]: {
      marginLeft: 0
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: 50
    },
    [theme.breakpoints.up('md')]: {
      marginLeft: '200px',
      width: `calc(100vw - 200px)`,
      marginTop: '50px'
    },
    [theme.breakpoints.down('xs')]: {
      backgroundSize: 'contain',
      overflowX: 'hidden'
    },
    flex: 1
  },
  Tour: {
    fontFamily: '"Gilroy", sans-serif',
    padding: '20px 40px 20px 30px !important'
  },
  tourText: {
    color: theme.palette.alt.second
  },
  tourFab: {
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(12),
    background: theme.palette.common.first,
    color: theme.palette.alt.second,
    zIndex: 1000,
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  headerText: {
    marginBottom: '10px'
  },
  headerTitle: {
    [theme.breakpoints.down('xs')]: {
      lineHeight: 1,
      fontSize: '1.6rem'
    }
  },
  recommended: {
    display: 'inline-block',
    position: 'sticky',
    top: 200,
    margin: '0 0 0 20px',
    opacity: 0.7,
    '&:hover': {
      opacity: 1
    },
    [theme.breakpoints.down('md')]: {
      margin: '0px 0px 0px 50px',
      width: '500px'
    },
    [theme.breakpoints.down('xs')]: {
      margin: '0px 0px 0px 30px'
    }
  },
  recommendedMobile: {
    overflowY: 'hidden'
  },
  headerImg: {
    width: '100%',
    maxWidth: '100px',
    aspectRatio: '1 / 1',
    objectFit: 'cover',
    borderRadius: '0.5rem',
    [theme.breakpoints.down('xs')]: {
      marginBottom: '0px'
    }
  },
  icons: {
    color: `${theme.palette.common.first} !important`
  },
  curatedByName: {
    color: theme.palette.common.first
  },
  hidden: {
    display: 'none'
  },
  minimize: {
    height: '50px',
    width: '50px',
    [theme.breakpoints.down('xs')]: {
      height: '35px',
      width: '35px'
    }
  },
  minimizeHeader: {
    padding: '0px 16px',
    overflow: 'hidden',
    [theme.breakpoints.down('xs')]: {
      maxHeight: '60px'
    }
  },
  snack: {
    justifyContent: 'center'
  },
  tabs: {
    color: '#fff',
    fontSize: '1.2rem',
    marginLeft: '35px',
    textTransform: 'capitalize',
    [theme.breakpoints.down('xs')]: {
      marginLeft: '15px'
    }
  }
})

function TabPanel (props) {
  const { children, value, index } = props

  return (
    <div role='tabpanel'
      hidden={value !== index}
    >
      <div>{children}</div>
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

class Collections extends Component {
  state = {
    collection: null,
    posts: [],
    isLoading: true,
    isMinimize: false,
    snackbarMsg: '',
    recommended: [],
    isTourOpen: false,
    socialLevelColor: '',
    activeTab: 0,
    anchorEl: null,
    openReorderDialog: false,
    editDialogOpen: false
  }

  fetchCollectionInfo = async () => {
    const decodedURL = decodeURI(window.location.href)
    const url = decodedURL.split('/')
    const id = url[5]

    let collection, recommended
    try {
      collection = (await axios.get(`${BACKEND_API}/collections/name/${id}`)).data
      const requQuery = `name=${collection.name}&description=${collection.description}&id=${id}`
      recommended = (await axios.get(`${BACKEND_API}/collections/recommended?${requQuery}`)).data
    } catch (err) {
      this.setState({ isLoading: false })
      console.log(err)
    }

    this.setState({
      isLoading: false,
      collection,
      recommended,
      posts: collection.posts.reverse()
    })
  }

  componentDidMount () {
    this.fetchCollectionInfo()
  }

  componentDidUpdate ({ location: prevLocation }) {
    const currLocation = this.props.location
    if (prevLocation.pathname !== currLocation.pathname) {
      this.fetchCollectionInfo()
    }
  }

  shareCollection = e => {
    e.preventDefault()
    navigator.clipboard.writeText(window.location.href)
    this.handleSnackbarOpen('Copied collection to clipboard')
  }

  handleScroll = e => {
    if (this.state.posts.length <= 2) return
    const { isMinimize } = this.state
    let element = e.target

    if (element.scrollTop > this.prev && !isMinimize) {
      this.setState({ isMinimize: true })
    }
    if (element.scrollTop === 0 && isMinimize) {
      this.setState({ isMinimize: false })
    }

    this.prev = element.scrollTop
  }

  handleSnackbarOpen = snackbarMsg => this.setState({ snackbarMsg })
  handleSnackbarClose = () => this.setState({ snackbarMsg: '' })

  handleMenuOpen = ({ currentTarget }) => this.setState({ anchorEl: currentTarget })
  handleMenuClose = () => this.setState({ anchorEl: null })

  handleReorderDialogOpen = () => this.setState({ openReorderDialog: true, anchorEl: null })
  handleReorderDialogClose = () => this.setState({ openReorderDialog: false })

  handleEditDialogOpen = () => this.setState({ editDialogOpen: true, anchorEl: null })
  handleEditDialogClose = () => this.setState({ editDialogOpen: false })

  closeTour = () => this.setState({ isTourOpen: false })
  openTour = () => this.setState({ isTourOpen: true })

  getSocialLevel = async id => {
    const res = (await axios.get(`${BACKEND_API}/levels/user/${id}`)).data
    this.setState({
      socialLevelColor: levelColors[res.quantile]
    })
  }

  handleChange = (e, newTab) => {
    this.setState({ activeTab: newTab })
  }

  render () {
    const { classes, account, levels, dispatch, authToken } = this.props
    const {
      collection,
      posts,
      isLoading,
      isMinimize,
      snackbarMsg,
      recommended,
      activeTab,
      anchorEl,
      socialLevelColor,
      openReorderDialog,
      editDialogOpen
    } = this.state

    let color = socialLevelColor
    const menuOpen = Boolean(anchorEl)

    if (account && account.name) {
      if (!levels[account.name]) {
        dispatch(fetchSocialLevel(account.name))
      }
      if (levels[account.name] && !levels[account.name].isLoading) {
      color = levelColors[levels[account.name].levelInfo.quantile]
      }
    }

    const hidden = isMinimize ? classes.hidden : null
    const minimize = isMinimize ? classes.minimize : null
    const minimizeHeader = isMinimize ? classes.minimizeHeader : null
    const isLoggedUserCollection =
      (account && account.name) === (collection && collection.ownerId)

    const len = posts.length - 1
    let headerImgSrc =
      posts &&
      ((posts[len] && posts[len].previewData.img) ||
        (posts[len - 1] && posts[len - 1].previewData.img))

    if (!isLoading && !collection) {
      return (
        <ErrorBoundary>
          <div className={classes.container}>
            <div className={classes.page}>
              <Grid
                container
                direction='column'
                spacing={5}
                style={{ width: '50%', margin: 'auto', alignItems: 'center' }}
              >
                <Grid item>
                  <Typography
                    className={classes.accountErrorHeader}
                    color='#ffffff'
                    variant='h3'
                  >
                    <strong>Sorry this page is not available.</strong>
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    className={classes.accountErrorSub}
                    color='#ffffff'
                    variant='h4'
                  >
                    The page you're looking for does not exist.
                  </Typography>
                </Grid>
                <Grid item>
                  <Button variant='contained'
                    size='large'
                    href='/'
                  >
                    Go Home
                  </Button>
                </Grid>
              </Grid>
            </div>
          </div>
        </ErrorBoundary>
      )
    }

    if (isLoading) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          }}
        >
          <DotSpinner />
        </div>
      )
    }

    return (
      <ErrorBoundary>
        <Helmet>
          <meta charSet='utf-8' />
          <title>{`${collection.name} | ${collection.owner}`}</title>
          <meta name='description'
            content={`${collection.description}`}
          />
          <meta
            property='og:title'
            content={`${collection.name} | ${collection.owner}`}
          />
          <meta
            property='og:description'
            content={`${collection.description}`}
          />
          <meta property='og:image'
            content={`${collection.coverImgSrc}`}
          />
          <meta property='twitter:card'
            content='summary_large_image'
          />
          <meta property='twitter:site'
            content='@yup_io'
          />
          <meta
            property='twitter:title'
            content={`${collection.name} | ${collection.owner}`}
          />
          <meta
            property='twitter:image'
            content={`${collection.coverImgSrc}`}
          />
          <meta
            property='twitter:description'
            content={`${collection.description}`}
          />
        </Helmet>

        <Snackbar
          autoHideDuration={4000}
          onClose={this.handleSnackbarClose}
          open={!!snackbarMsg}
        >
          <SnackbarContent className={classes.snack}
            message={snackbarMsg}
          />
        </Snackbar>
        <Menu
          id='short-menu'
          anchorEl={anchorEl}
          keepMounted
          open={menuOpen}
          onClose={this.handleMenuClose}
          PaperProps={{
            style: {
              width: '15ch',
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
            onClick={this.handleEditDialogOpen}
            className={classes.menuItem}
          >
            Edit
          </MenuItem>
          {!!collection.posts.length && (
          <MenuItem dense
            onClick={this.handleReorderDialogOpen}
            className={classes.menuItem}
          >
            Reorder
          </MenuItem>
          )}
        </Menu>
        <CollectionEditDialog
          collection={collection}
          account={account}
          authToken={authToken}
          dialogOpen={editDialogOpen}
          handleDialogClose={this.handleEditDialogClose}
        />
        <CollectionReorderDialog
          handleDialogClose={this.handleReorderDialogClose}
          collection={collection}
          dialogOpen={openReorderDialog}
        />
        <div className={classes.container}
          onScroll={this.handleScroll}
        >
          <div className={classes.page}>
            <SideDrawer />
            <Grid
              container
              direction='row'
              justify='flex-start'
              alignItems='flex-start'
              spacing={2}
              className={classes.collectionContainer}
            >
              <Grid
                item
                container
                direction='row'
                justify='flex-start'
                alignItems='center'
                spacing={2}
                lg={8}
                xl={8}
                xs={12}
                className={[minimizeHeader, classes.collectionHeader]}
              >
                <Grid
                  item
                >
                  <Fade in
                    timeout={1000}
                  >
                    <Img
                      src={[headerImgSrc, DEFAULT_IMG]}
                      alt='thumbnail'
                      loader={<div />}
                      className={`${classes.headerImg} ${minimize}`}
                    />
                  </Fade>
                </Grid>
                <Grid
                  item
                  lg={isMinimize ? 7 : 6}
                  md={isMinimize ? 7 : 6}
                  sm={8}
                  xs={6}
                >
                  <Fade in
                    timeout={400}
                  >
                    <Typography variant='h2'
                      className={[classes.headerText, isMinimize ? classes.headerTitle : null]}
                    >
                      {collection.name}
                    </Typography>
                  </Fade>
                  <Fade in
                    timeout={800}
                  >
                    <Typography
                      variant='h5'
                      className={[classes.headerText, hidden]}
                    >
                      Curated by{' '}
                      <Link
                        to={`/${collection.owner}`}
                        style={{
                          textDecoration: color
                            ? `1px solid underline ${color}`
                            : 'none'
                        }}
                        className={classes.curatedByName}
                      >
                        {collection.owner}
                      </Link>
                    </Typography>
                  </Fade>
                  <Typography
                    variant='subtitle2'
                    className={[classes.headerText, hidden]}
                  >
                    {collection.description}
                  </Typography>
                </Grid>
                <Grid item
                  container
                  lg={4}
                  sm={2}
                  xs={4}
                  justify='flex-end'
                >
                  <IconButton
                    aria-label='more'
                    aria-controls='long-menu'
                    aria-haspopup='true'
                    onClick={this.shareCollection}
                  >
                    <Icon className={[classes.icons, 'fa fa-share']} />
                  </IconButton>
                  {isLoggedUserCollection && (
                    <IconButton
                      aria-label='more'
                      aria-controls='long-menu'
                      aria-haspopup='true'
                      onClick={this.handleMenuOpen}
                      className={classes.icons}
                    >
                      <MenuIcon />
                    </IconButton>
                  )}
                </Grid>
              </Grid>

              <Hidden lgDown>
                <Grid item
                  lg={4}
                />
              </Hidden>

              {showTabs ? (
                <>
                  <Grid item
                    xs={12}
                  >
                    <Tabs value={activeTab}
                      onChange={this.handleChange}
                      TabIndicatorProps={{ style: { backgroundColor: '#fff' } }}
                    >
                      <Tab label='Feed'
                        className={classes.tabs}
                      />
                      <Tab label='Recommended'
                        className={classes.tabs}
                      />
                    </Tabs>
                  </Grid>

                  <TabPanel value={activeTab}
                    index={0}
                  >
                    <Grid item
                      xs={12}
                    >
                      <Feed
                        isLoading={isLoading}
                        hasMore={false}
                        classes={classes}
                        posts={posts}
                        hideInteractions
                        renderObjects
                        tourname='CollectionPosts'
                      />
                    </Grid>
                  </TabPanel>

                  <TabPanel value={activeTab}
                    index={1}
                  >
                    <Grid
                      item
                      container
                      column
                      spacing={4}
                      tourname='RecommendedCollections'
                      className={[classes.recommended, classes.recommendedMobile]}
                    >
                      {recommended.map(rec => {
                          return (
                            <RecommendedCollections
                              classes={classes}
                              collection={rec}
                            />
                          )
                      })}
                    </Grid>
                  </TabPanel>
                </>
              ) : (
                <>
                  <Grid item
                    lg={6}
                    xs={12}
                  >
                    <Feed
                      isLoading={isLoading}
                      hasMore={false}
                      classes={classes}
                      posts={posts}
                      hideInteractions
                      renderObjects
                      tourname='CollectionPosts'
                    />
                  </Grid>

                  <Grid
                    item
                    container
                    lg={4}
                    spacing={2}
                    tourname='RecommendedCollections'
                    className={classes.recommended}
                  >
                    <Grid item
                      xs={12}
                    >
                      <Typography variant='h4'>Recommended</Typography>
                    </Grid>
                    <Grid item
                      xs={12}
                    >
                      {recommended.map(rec => {
                          return (
                            <RecommendedCollections
                              classes={classes}
                              collection={rec}
                            />
                          )
                      })}
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>

            <Tour
              steps={steps}
              isOpen={this.state.isTourOpen}
              onRequestClose={this.closeTour}
              className={classes.Tour}
              accentColor='#00E08E'
              rounded={10}
              disableInteraction
              highlightedMaskClassName={classes.Mask}
              nextButton={
                <Button
                  variant='outlined'
                  style={{ fontWeight: 400, backgroundColor: '#00E08E' }}
                  small
                >
                  Next
                </Button>
              }
              prevButton={
                <Button
                  small
                  variant='outlined'
                  style={{ fontWeight: 400, backgroundColor: '#00E08E' }}
                >
                  Back
                </Button>
              }
              lastStepNextButton={<div style={{ display: 'none' }} />}
            />
            <Fab
              className={classes.tourFab}
              variant='extended'
              onClick={this.openTour}
            >
              10-Second Tutorial
            </Fab>
            <CreateCollectionFab />
          </div>
        </div>
      </ErrorBoundary>
    )
  }
}

const steps = [
  {
    selector: '[tourName="CollectionPosts"]',
    content: (
      <div>
        <Typography
          className='tourHeader'
          variant='h4'
        >📰 Collection Posts</Typography>
        <Typography
          variant='body2'
          className='tourText'
        >These are the curated posts in this collection.</Typography>
      </div>
    )
  },
  {
    selector: '[tourName="RecommendedCollections"]',
    content: (
      <div>
        <Typography
          className='tourHeader'
          variant='h4'
        >📖 Recommended Collections</Typography>
        <Typography
          variant='body2'
          className='tourText'
        >These are some other collections you should check out!</Typography>
      </div>
    )
  },
  {
    selector: '[tourName="FeedsDrawer"]',
    content: (
      <div>
        <Typography
          className='tourHeader'
          variant='h4'
        >📡 Feeds</Typography>
        <Typography
          variant='body2'
          className='tourText'
        >These are your feeds.</Typography>
        <a
          href='https://docs.yup.io/products/app#feed'
          target='_blank'
          className='tourLink'
        >
          Learn more
        </a>
      </div>
    )
  },
  {
    selector: '[tourName="LeaderboardButton"]',
    content: (
      <div>
        <Typography
          className='tourHeader'
          variant='h4'
        >📈 Leaderboard</Typography>
        <Typography
          variant='body2'
          className='tourText'
        >Find content and users ranked by category and platform.</Typography>
        <a
          href='https://docs.yup.io/products/app#lists'
          target='_blank'
          className='tourLink'
        >
          Learn more
        </a>
      </div>
    )
  },
  {
    content: (
      <div>
        <Typography variant='h4'
          className='tourHeader'
        >👏 That's it!</Typography>
        <Typography variant='body2'
          className='tourText'
        >That's all for now. Learn more with some of these resources:</Typography>
        <div className='tourResources'>
          <Button
            size='medium'
            variant='contained'
            style={{ fontWeight: 400 }}
            small
            className='tourButton'
            href='https://docs.yup.io'
            target='_blank'
          >
            Docs
          </Button>
          <Button
            size='medium'
            variant='contained'
            style={{ fontWeight: 400 }}
            small
            className='tourButton'
            href='https://yup.io'
            target='_blank'
          >
            Website
          </Button>
          <Button
            size='medium'
            variant='contained'
            style={{ fontWeight: 400 }}
            small
            className='tourButton'
            href='https://blog.yup.io'
            target='_blank'
          >
            Blog
          </Button>
        </div>
      </div>
    )
  }
]

const mapStateToProps = state => {
  const account = accountInfoSelector(state)
  const authToken = state.authInfo

  return {
    account,
    levels: state.socialLevels.levels || {
      isLoading: true,
      levels: {}
    },
    push: state.scatterInstallation.push,
    collections: state.collections,
    authToken
  }
}

Collections.propTypes = {
  dispatch: PropTypes.func.isRequired,
  levels: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  authToken: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(withStyles(styles)(Collections))
