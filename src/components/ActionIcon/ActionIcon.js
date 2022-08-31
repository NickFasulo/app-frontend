import { IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ActionIcon({ icon, onClick }) {
  return (
    <IconButton onClick={onClick}>
      <FontAwesomeIcon icon={icon} />
    </IconButton>
  );
}

export default ActionIcon;
