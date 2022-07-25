import { useResizeDetector } from 'react-resize-detector';
import { YupPageHeaderRoot } from './styles';
import { useEffect } from 'react';
import { useAppUtils } from '../../contexts/AppUtilsContext';
import { Box } from '@mui/material';

const YupPageHeader = ({ children, onChangeHeight, ...restProps }) => {
  const { height, ref } = useResizeDetector();
  const { windowScrolled } = useAppUtils();

  useEffect(() => {
    if (onChangeHeight) {
      onChangeHeight(height);
    }
  }, [height]);

  return (
    <YupPageHeaderRoot ref={ref} scrolled={windowScrolled} {...restProps}>
      <Box pt={3}>
        {children}
      </Box>
    </YupPageHeaderRoot>
  );
};

export default YupPageHeader;
