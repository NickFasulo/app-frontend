import { Drawer, ExternalLinkList } from './styles';
import { Grow, List, ListItemButton, ListItemText } from '@mui/material';
import {
  faHome,
  faTrophy,
  faList,
  faCoins,
  faGear,
  faMoon,
  faBrightness,
  faMagnifyingGlass,
  faBell,
  faCircleXmark,
  faPlug
} from '@fortawesome/pro-light-svg-icons';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MainLink from './MainLink';
import { useEffect, useState } from 'react';
import FeedLink from './FeedLink';
import ExternalLink from './ExternalLink';
import { extensionUrl, landingPageUrl } from '../../config';
import { MENU_ANIMATION_DURATION, PRIVACY_URL } from '../../constants/const';
import { useThemeMode } from '../../contexts/ThemeModeContext';
import SettingsModal from '../TopBarAndDrawer/SettingsModal';
import { LOCAL_STORAGE_KEYS } from '../../constants/enum';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/actions';
import useDevice from '../../hooks/useDevice';
import MobileMenuFab from './MobileMenuFab';
import SideBarContext from './SideBarContext';
import SearchUi from '../SearchUi';
import UserMenuItem from './UserMenuItem';
import YupLogoMenuItem from './YupLogoMenuItem';
import useExtension from '../../hooks/useExtension';
import { FlexBox } from '../styles';
import { useAuth } from '../../contexts/AuthContext';

const SideBar = () => {
  const dispatch = useDispatch();
  const { isDesktop } = useDevice();
  const { isLoggedIn } = useAuth();
  const { isLightMode, toggleTheme } = useThemeMode();
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [feedOpen, setFeedOpen] = useState(false);
  const { isInstalled: isExtensionInstalled } = useExtension();

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ETH_AUTH);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TWITTER_INFO);

    dispatch(logout());
  };

  useEffect(() => {
    document.body.style.overflowY = searchOpen ? 'hidden' : 'auto';
  }, [searchOpen]);

  return (
    <SideBarContext.Provider
      value={{
        open,
        closeSideBar: () => setOpen(false),
        closeSearch: () => setSearchOpen(false)
      }}
    >
      <Drawer
        open={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {isLoggedIn ? <UserMenuItem /> : <YupLogoMenuItem />}
        <List sx={{ flexGrow: open ? 0 : 1 }}>
          <MainLink icon={faHome} text="Home" to="/" />
          <MainLink
            icon={faMagnifyingGlass}
            text="Search"
            onClick={() => {
              setSearchOpen(!searchOpen);
              setOpen(false);
            }}
          />
          {isLoggedIn && (
            <MainLink icon={faBell} text="Notifications" to="/notifications" />
          )}
          <MainLink icon={faTrophy} text="Leaderboards" to="/leaderboard" />
          <MainLink
            icon={faList}
            text="Collections"
            to="/leaderboard?site=all&subject=collections&category=overall"
          />
          <MainLink icon={faCoins} text="Staking" to="/staking" />
        </List>
        {open && (
          <>
            <FlexBox
              flexDirection="column"
              sx={{
                flexShrink: 0,
                flexGrow: 1
              }}
            >
              <Grow in={open} timeout={MENU_ANIMATION_DURATION}>
                <ListItemButton
                  sx={{
                    height: 30,
                    borderRadius: 1,
                    px: 1,
                    flexShrink: 1,
                    flexGrow: 0
                  }}
                  onClick={() => setFeedOpen(!feedOpen)}
                >
                  <ListItemText
                    primary="Feeds"
                    primaryTypographyProps={{
                      variant: isDesktop ? 'bodyS1' : 'h6',
                      sx: {
                        color: (theme) => theme.palette.M300
                      }
                    }}
                  />
                  {feedOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </Grow>
              <List
                sx={{
                  maxHeight: 100,
                  overflowY: 'auto'
                }}
              >
                {feedOpen && (
                  <>
                    {isLoggedIn && (
                      <FeedLink text="Your Daily Hits" category="dailyhits" />
                    )}
                    <FeedLink text="Crypto" category="crypto" />
                    <FeedLink text="NFTs" category="nfts" />
                    <FeedLink text="Mirror Articles" category="mirror" />
                    <FeedLink text="Recent" category="recent" />
                    <FeedLink text="Farcaster" category="farcaster" />
                    <FeedLink text="Lens" category="lens" />
                    <FeedLink text="Politics" category="politics" />
                    <FeedLink text="Safe Space" category="non-corona" />
                  </>
                )}
              </List>
            </FlexBox>
            {isDesktop && (
              <Grow in={open} timeout={MENU_ANIMATION_DURATION}>
                <ExternalLinkList>
                  <ExternalLink text="Main site" to={landingPageUrl} />
                  <ExternalLink text="Explorer" to="https://yup.live" />
                  <ExternalLink text="Blog" to="https://blog.yup.io" />
                  <ExternalLink text="Docs" to="https://docs.yup.io" />
                  <ExternalLink text="Privacy" to={PRIVACY_URL} />
                </ExternalLinkList>
              </Grow>
            )}
          </>
        )}
        <List>
          {!isExtensionInstalled && (
            <MainLink icon={faPlug} text="Extension" to={extensionUrl} />
          )}
          <MainLink
            icon={isLightMode ? faMoon : faBrightness}
            text={isLightMode ? 'Dark mode' : 'Light mode'}
            onClick={() => toggleTheme()}
          />
          {isLoggedIn && (
            <MainLink
              icon={faGear}
              text="Settings"
              onClick={() => setSettingsOpen(true)}
            />
          )}
          {open && !isDesktop && (
            <MainLink
              icon={faCircleXmark}
              text="Close"
              onClick={() => setOpen(false)}
            />
          )}
        </List>
      </Drawer>

      {!isDesktop && <MobileMenuFab onClick={() => setOpen(true)} />}

      {/* Search */}
      {searchOpen && <SearchUi onClose={() => setSearchOpen(false)} />}

      {/* Modals */}

      <SettingsModal
        handleSettingsClose={() => setSettingsOpen(false)}
        settingsOpen={settingsOpen}
        handleLogout={handleLogout}
      />
    </SideBarContext.Provider>
  );
};

export default SideBar;
