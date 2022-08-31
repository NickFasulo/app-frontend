import { useThemeMode } from '../../contexts/ThemeModeContext';
import { StyledFab } from './styles';

function MobileMenuFab({ onClick }) {
  const { coloredLogoPath } = useThemeMode();

  return (
    <StyledFab onClick={onClick}>
      <img src={coloredLogoPath} alt="logo" />
    </StyledFab>
  );
}

export default MobileMenuFab;
