import { Box, Grid } from '@mui/material';
import useDevice from '../../hooks/useDevice';

const GridLayout = ({ contentLeft, contentRight, headerHeight }) => {
  const { isMobile } = useDevice();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8} lg={7} sx={{ mt: 3 }}>
        {contentLeft}
      </Grid>
      <Grid item md={4} lg={5}>
        <Box
          sx={{
            display: isMobile ? 'none' : 'block',
            position: headerHeight === null ? 'relative' : 'sticky',
            top: headerHeight === null ? undefined : (theme) => `calc(${headerHeight}px + ${theme.spacing(3)})`
          }}
        >
          {contentRight}
        </Box>
      </Grid>
    </Grid>
  );
};

export default GridLayout;
