import { DrawerLogo, MenuItemButton } from './styles';
import { useAuthModal } from '../../contexts/AuthModalContext';
import { useThemeMode } from '../../contexts/ThemeModeContext';

function YupLogoMenuItem() {
  const { coloredLogoPath } = useThemeMode();
  const { open: openAuthModal } = useAuthModal();

  return (
    <MenuItemButton
      className="LogoLink"
      sx={{ flexGrow: 0, justifyContent: 'center' }}
      onClick={() => openAuthModal()}
    >
      <DrawerLogo src={coloredLogoPath} alt="logo" />
    </MenuItemButton>
  );
}

export default YupLogoMenuItem;
