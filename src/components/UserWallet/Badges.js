import { Button, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import PoapBadge from '../PoapBadge';
import { FlexBox } from '../styles';

const Badges = ({ data }) => {
  const [showAll, setShowAll] = useState(false);

  return (
    <>
      <Typography variant="h6" sx={{ my: 3 }}>
        Badges
      </Typography>
      {data?.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {(showAll ? data : data.slice(-3)).map(({ title, image, link }) => (
              <Grid key={title} item xs={6} sm={4} md={6} lg={4}>
                <PoapBadge image={image} text={title} link={link} />
              </Grid>
            ))}
          </Grid>
          {data.length > 3 && (
            <FlexBox justifyContent="flex-end">
              <Button
                sx={{
                  width: 100,
                  mt: 1
                }}
                color="inherit"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'See less' : 'See more'}
              </Button>
            </FlexBox>
          )}
        </>
      ) : (
        <Typography>You don't have any badges earned yet.</Typography>
      )}
    </>
  );
};

export default Badges;
