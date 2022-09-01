import React from 'react';
import { Grid } from '@mui/material';
import YupButton from '../Miscellaneous/YupButton';

function StyledTourResources() {
  return (
    <Grid container spacing={2} textAlign="center" sx={{ marginBottom: '1em' }}>
      <Grid item>
        <YupButton
          size="small"
          color="primary"
          variant="contained"
          href="https://docs.yup.io"
          target="_blank"
        >
          Docs
        </YupButton>
      </Grid>
      <Grid item>
        <YupButton
          size="small"
          color="primary"
          variant="contained"
          href="https://yup.io"
          target="_blank"
        >
          Website
        </YupButton>
      </Grid>
      <Grid item>
        <YupButton
          size="small"
          color="primary"
          variant="contained"
          href="https://blog.yup.io"
          target="_blank"
        >
          Blog
        </YupButton>
      </Grid>
    </Grid>
  );
}

export default StyledTourResources;
