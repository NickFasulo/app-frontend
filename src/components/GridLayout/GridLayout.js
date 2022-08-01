import { Box, Grid } from '@mui/material';
import useDevice from '../../hooks/useDevice';
import { useAppLayout } from '../../contexts/AppLayoutContext';

const GridLayout = ({ contentLeft, contentRight, noHideRightContent }) => {
  const { isMobile } = useDevice();
  const { headerHeight } = useAppLayout();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8} lg={7} sx={{}}>
        {contentLeft}
      </Grid>
      <Grid item xs={12} md={4} lg={5}>
        <Box
          sx={{
            display: isMobile && !noHideRightContent ? 'none' : 'block',
            position: isMobile || headerHeight === null ? 'relative' : 'sticky',
            top:
              isMobile || headerHeight === null
                ? undefined
                : (theme) => `calc(${headerHeight}px + ${theme.spacing(3)})`
          }}
        >
          {contentRight}
        </Box>
      </Grid>
    </Grid>
  );
};

export default GridLayout;
