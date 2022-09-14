import { Button, Grid, Typography } from '@mui/material';
import PoapBadge from '../PoapBadge';
import { useState } from 'react';
import { FlexBox } from '../styles';

const Badges = ({ data }) => {
  const [showAll, setShowAll] = useState(false);

  data = [...data, ...data, ...data, ...data];

  return (
    <>
      <Typography variant="h6" sx={{ my: 3 }}>
        Badges
      </Typography>
      {data?.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {(showAll ? data : data.slice(-3)).map(({ description, image, link }) => (
              <Grid key={description} item xs={6} sm={4} md={6} lg={4}>
                <PoapBadge image={image} text={description} link={link} />
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
                {showAll ? 'See less...' : 'See more...'}
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
