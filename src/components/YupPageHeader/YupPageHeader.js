import { useResizeDetector } from 'react-resize-detector';
import { useEffect } from 'react';
import { YupPageHeaderRoot } from './styles';
import { useAppUtils } from '../../contexts/AppUtilsContext';
import { useAppLayout } from '../../contexts/AppLayoutContext';

function YupPageHeader({ children, ...restProps }) {
  const { height, ref } = useResizeDetector();
  const { windowScrolled } = useAppUtils();
  const { setHeaderHeight } = useAppLayout();

  useEffect(() => {
    setHeaderHeight(height);
  }, [height]);

  return (
    <YupPageHeaderRoot ref={ref} scrolled={windowScrolled} {...restProps}>
      {children}
    </YupPageHeaderRoot>
  );
}

export default YupPageHeader;
