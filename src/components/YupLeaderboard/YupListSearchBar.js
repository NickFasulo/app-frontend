import SearchIcon from '@mui/icons-material/Search';
import { TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import deburr from 'lodash/deburr';
import axios from 'axios';
import { useRef } from 'react';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import useStyles from './YupListSearchBarStyles';
import useYupListSettings from '../../hooks/useYupListSettings';
import { apiBaseUrl } from '../../config';
import { updateSearchListPosts } from '../../redux/actions';

function YupListSearchBar({}) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const settings = useYupListSettings();
  const searchInfo = useSelector((state) => state.updateSearchListPosts);

  const inputRef = useRef(null);

  const displaySearchStyle = settings.searchEnabled
    ? { display: 'block' }
    : { display: 'none' };

  const setInitialSearchLoad = () => {
    dispatch(updateSearchListPosts({ posts: [], initialLoad: true }));
  };

  const updListData = (posts) => {
    dispatch(
      updateSearchListPosts({
        posts,
        initialLoad: false,
        hasMore: false,
        isSearch: true
      })
    );
  };

  const onSearchEnter = async (event) => {
    if (event.key === 'Enter') {
      try {
        if (!inputRef.current?.value) {
          return;
        }

        setInitialSearchLoad();

        const input = deburr(inputRef.current.value.trim()).toLowerCase();
        inputRef.current.value = '';
        const posts = (
          await axios.get(`${apiBaseUrl}/search`, {
            params: {
              searchText: input,
              limit: 30,
              list: searchInfo.listType,
              category: settings.category.name
            }
          })
        ).data;

        updListData(posts);
      } catch (err) {
        updListData([]);
      }
      event.preventDefault();
    }
  };

  return (
    <ErrorBoundary>
      <div className={classes.root} style={displaySearchStyle}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <TextField
          InputProps={{
            inputRef,
            classes: {
              root: classes.inputRoot,
              input: classes.inputInput
            },
            disableUnderline: true
          }}
          variant="standard"
          onKeyPress={onSearchEnter}
        />
      </div>
    </ErrorBoundary>
  );
}

export default YupListSearchBar;
