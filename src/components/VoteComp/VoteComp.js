import React, { Component } from 'react'
import VoteButton from '../VoteButton/VoteButton'
import { connect } from 'react-redux'
import { Grid} from '@mui/material'
import PropTypes from 'prop-types'
import { fetchInitialVotes, fetchSocialLevel } from '../../redux/actions'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import { accountInfoSelector } from '../../redux/selectors'
import {
  courseCategories,
  electionCategories,
  mapsCategories,
  nftArtCategories, nftMusicCategories,
  professorCategories,
  voteCategories
} from '../../config'

const VOTE_CATEGORIES = voteCategories
const PROF_CATEGORIES = professorCategories
const MAPS_CATEGORIES = mapsCategories
const COURSE_CATEGORIES = courseCategories
const ELECTION_CATEGORIES = electionCategories
const NFT_ART_CATEGORIES = nftArtCategories
const NFT_MUSIC_CATEGORIES = nftMusicCategories

function genRegEx (arrOfURLs) {
  return new RegExp(`^((http:|https:)([/][/]))?(www.)?(${arrOfURLs.join('|')})`)
}

const artPattern = genRegEx(['rarible.com/*', 'app.rarible.com/*', 'opensea.io/assets/*', 'superrare.co/*', 'superrare.co/*', 'foundation.app/*/', 'zora.co/*', 'knownorigin.io/gallery/*'])
const musicPattern = genRegEx(['audius.co/*', 'open.spotify.com/*', 'soundcloud.com/*', 'music.apple.com/us/(artist|album)/*'])

class VoteComp extends Component {
  state = {
    newRating: 3,
    lastClicked: undefined,
    isVoted: false
  }

  constructor (props) {
    super(props)
    this.decreaseRating = this.decreaseRating.bind(this)
    this.increaseRating = this.increaseRating.bind(this)
  }
  componentDidMount () {
    this.fetchInitialVotes()
  }

  async fetchInitialVotes () {
    const { postid, account, dispatch } = this.props
    if (account == null) { return }
    await dispatch(fetchInitialVotes(account.name, postid))
  }

  decreaseRating () {
    console.log("DECREAD")
    this.setState({ lastClicked: 'down' })
    if (this.state.newRating < 1) return
    if (!this.state.newRating || this.state.newRating > 2) {
      this.setState({ newRating: 2 })
    } else if (this.state.newRating > 1) {
      this.setState({ newRating: this.state.newRating - 1 })
    } else {
      this.setState({ newRating: 1 })
    }
  }
  increaseRating () {
    console.log("INCREAD")
    this.setState({  lastClicked: 'up' })
    if (this.state.newRating > 5) return
    if (!this.state.newRating || this.state.newRating < 3) { this.setState({ newRating: 3 }) } else if (this.state.newRating < 5) {
      this.setState({ newRating: this.state.newRating + 1 })
    } else {
      this.setState({ newRating: 5 })
    }
  }
  render () {
    const { account, dispatch, postid, caption, levels, weights, postType, categories: _categories, listType, postInfo, rating } = this.props
    const { newRating, lastClicked, isVoted } = this.state
    const isMobile = window.innerWidth <= 600
    let voterWeight = 0

    if (account && account.name) {
      if (!levels[account.name]) {
        dispatch(fetchSocialLevel(account.name))
      }
      const level = levels[account.name]
      if (level && !level.isLoading && level.levelInfo && level.levelInfo.weight) {
        voterWeight = level.levelInfo.weight
      }
    }

    let categories

    if (_categories == null) {
      // TODO: Make this configurable
      if (postType === 'columbia-course-registration:courses') {
        categories = COURSE_CATEGORIES.filter((cat) => cat !== 'overall')
      } else if (postType === 'columbia-course-registration:professors') {
        categories = PROF_CATEGORIES.filter((cat) => cat !== 'overall')
      } else if (postType === 'maps.google.com') {
        categories = MAPS_CATEGORIES.filter((cat) => cat !== 'overall')
      } else if (postType === 'politics:candidates' && listType === 'politics:candidates') {
        categories = ELECTION_CATEGORIES.filter((cat) => cat !== 'overall')
      } else if (caption && caption.match(artPattern)) {
        categories = NFT_ART_CATEGORIES.filter((cat) => cat !== 'overall')
      } else if (caption && caption.match(musicPattern)) {
        categories = NFT_MUSIC_CATEGORIES.filter((cat) => cat !== 'overall')
      } else {
        categories = VOTE_CATEGORIES.filter((cat) => cat !== 'overall')
      }
    } else {
      categories = _categories
    }

    const { post } = postInfo
    console.log(post)
    let ups = 0; let downs = 0
    categories.forEach((category) => {
      ups = ups + ((post.catVotes[category] && post.catVotes[category].up) || 0)
      downs = downs + ((post.catVotes[category] && post.catVotes[category].down) || 0)
    })
    // const totalVoters = ups + downs
    // console.log(ups, totalVoters, weights )
    console.log(rating, 'RATING', newRating)
    return (
      <ErrorBoundary>
        <Grid container spacing={3}
        >
          
          <VoteButton
            category={'popularity'}
            catWeight={weights['popularity']}
            handleOnclick={this.increaseRating}
            type='up'
            lastClicked={lastClicked}
            totalVoters={ups}
            rating={lastClicked === 'up' && newRating}
            postid={postid}
            listType={listType}
            voterWeight={voterWeight}
            isShown={!isMobile}
            isVoted={lastClicked=== 'up'}
          />
          <VoteButton
            category={'popularity'}
            catWeight={weights['popularity']}
            handleOnclick={this.decreaseRating}
            type='down'
            lastClicked={lastClicked}
            totalVoters={downs}
            rating={lastClicked === 'down' && newRating}
            postid={postid}
            listType={listType}
            voterWeight={voterWeight}
            isShown={!isMobile}
            isVoted={lastClicked=== 'down'}
          />
          </Grid>
      </ErrorBoundary>
    )
  }
}

VoteComp.propTypes = {
  account: PropTypes.object,
  caption: PropTypes.string.isRequired,
  postid: PropTypes.string.isRequired,
  weights: PropTypes.object.isRequired,
  levels: PropTypes.number.isRequired,
  rating: PropTypes.object.isRequired,
  postType: PropTypes.string,
  postInfo: PropTypes.object.isRequired,
  listType: PropTypes.string,
  categories: PropTypes.array,
  dispatch: PropTypes.func.isRequired
}

VoteComp.defaultProps = {
  weights: {
    intelligence: null,
    popularity: null,
    overall: null,
    funny: null
  },
  voterWeight: 0
}

const mapStateToProps = (state, ownProps) => {
  const account = accountInfoSelector(state)

  if (account && state.userPermissions && state.userPermissions[account.name]) {
    account.authority = state.userPermissions[account.name].perm
  }

  let initialVotes = { votes: {}, isLoading: false, error: null }
  if (account && account.name) {
    const userVotes = state.initialVotes[account.name]
    const userVotesForPost = userVotes && userVotes[ownProps.postid]
    if (userVotesForPost) {
      initialVotes = userVotesForPost
    }
  }

  const postInfo = state.postInfo[ownProps.postid]

  return {
    postInfo,
    levels: state.socialLevels.levels || {
      isLoading: true,
      levels: {}
    },
    initialVotes,
    account
  }
}

export default connect(mapStateToProps)(VoteComp)