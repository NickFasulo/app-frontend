import { Box, Grid } from '@mui/material';
import useDevice from '../../hooks/useDevice';
import { useAppLayout } from '../../contexts/AppLayoutContext';
import { useAppUtils } from '../../contexts/AppUtilsContext';

function GridLayout({ contentLeft, contentRight, noHideRightContent }) {
  const { isMobile } = useDevice();
  const { headerHeight } = useAppLayout();
  const { windowScrolled } = useAppUtils();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8} lg={7} sx={{}}>
        {contentLeft}
      </Grid>
      <Grid item xs={12} md={4} lg={5}>
        <Box
          sx={{
            pb: 3,
            display: isMobile && !noHideRightContent ? 'none' : 'block',
            position: isMobile || headerHeight === null ? 'relative' : 'sticky',
            top:
              isMobile || !windowScrolled
                ? undefined
                : (theme) => `calc(${headerHeight}px + ${theme.spacing(2)})`,
            maxHeight: (theme) =>
              `calc(100vh - ${headerHeight}px - ${theme.spacing(2)})`,
            overflowY: 'auto'
          }}
        >
          {contentRight}
        </Box>
      </Grid>
    </Grid>
  );
}

export default GridLayout;
