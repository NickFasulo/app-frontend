import { ListItemText } from '@mui/material';
import { MenuItemButton } from './styles';
import Link from '../Link';
import { useSideBar } from './SideBarContext';
import useDevice from '../../hooks/useDevice';

function FeedLink({ category, text }) {
  const { isMobile } = useDevice();
  const { closeSideBar, closeSearch } = useSideBar();

  const handleClickLink = () => {
    if (isMobile) {
      closeSideBar();
    }

    closeSearch();
  };

  return (
    <MenuItemButton
      onClick={handleClickLink}
      component={Link}
      href={`/feed/${category}`}
      className="FeedLink"
      sx={{
        py: 0
      }}
    >
      <ListItemText
        primary={text}
        primaryTypographyProps={{
          variant: 'bodyS2',
          color: (theme) => (isMobile ? theme.palette.M50 : theme.palette.M500)
        }}
      />
    </MenuItemButton>
  );
}

export default FeedLink;
