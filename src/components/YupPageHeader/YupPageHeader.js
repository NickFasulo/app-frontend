import { useResizeDetector } from 'react-resize-detector';
import { useEffect } from 'react';
import { YupPageHeaderRoot } from './styles';
import { useAppLayout } from '../../contexts/AppLayoutContext';

function YupPageHeader({ children, ...restProps }) {
  const { height, ref } = useResizeDetector();
  const { setHeaderHeight } = useAppLayout();

  useEffect(() => {
    setHeaderHeight(height);
  }, [height]);

  return (
    <YupPageHeaderRoot ref={ref} className="page-header" {...restProps}>
      {children}
    </YupPageHeaderRoot>
  );
}

export default YupPageHeader;
