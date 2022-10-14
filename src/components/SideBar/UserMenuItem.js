import { Badge, Grow, ListItemAvatar, ListItemText } from '@mui/material';
import { formatWeight, formatDecimal } from '../../utils/helpers';
import { StyledProfileAvatar } from '../TopBarAndDrawer/StyledProfileAvatar';
import { levelColors } from '../../utils/colors';
import { MENU_ANIMATION_DURATION } from '../../constants/const';
import { useYupAccount } from '../../hooks/queries';
import useDevice from '../../hooks/useDevice';
import { useSideBar } from './SideBarContext';
import { MenuItemButton } from './styles';
import YupLogoMenuItem from './YupLogoMenuItem';
import Link from '../Link';
import { useAuth } from '../../contexts/AuthContext';

function UserMenuItem() {
  const { open, closeSideBar, closeSearch } = useSideBar();
  const { isDesktop } = useDevice();
  const { username } = useAuth();
  const { isLoading, data: profile } = useYupAccount(username);

  if (isLoading) {
    return <YupLogoMenuItem />;
  }

  // TODO: Redirect to 404
  if (!profile) return null;

  return (
    <MenuItemButton
      className="LogoLink"
      sx={{ flexGrow: 0, justifyContent: 'center' }}
      component={Link}
      href={`/account/${username}`}
      onClick={() => {
        // Close Sidebar on mobile version
        if (!isDesktop) {
          closeSideBar();
        } else {
          closeSearch();
        }
      }}
    >
      <ListItemAvatar sx={{ minWidth: 0 }}>
        <Badge
          color="secondary"
          overlap="circular"
          badgeContent={formatWeight(profile.score || 1)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
        >
          <StyledProfileAvatar
            username={profile.username}
            socialLevelColor={levelColors[profile.quantile]}
            avatar={profile.avatar}
          />
        </Badge>
      </ListItemAvatar>
      <Grow in={open} timeout={MENU_ANIMATION_DURATION}>
        <ListItemText
          primary={profile.fullname}
          primaryTypographyProps={{
            align: 'right',
            variant: isDesktop ? 'bodyS1' : 'h5'
          }}
          secondary={
            profile && `${formatDecimal(profile.balance?.YUP || 0)} YUP`
          }
          secondaryTypographyProps={{
            variant: isDesktop ? 'bodyS2' : 'h6',
            align: 'right'
          }}
          sx={{ display: !open && 'none' }}
        />
      </Grow>
    </MenuItemButton>
  );
}

export default UserMenuItem;
