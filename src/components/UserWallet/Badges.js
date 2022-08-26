import { Grid, Typography } from '@mui/material';
import PoapBadge from '../PoapBadge';

const Badges = ({ data }) => {
  return (
    <>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Badges
      </Typography>
      <Grid container spacing={3}>
        {data.map(({ description, image, link }) => (
          <Grid key={description} item xs={6} sm={4} md={6} lg={4}>
            <PoapBadge
              image={image}
              text={description}
              link={link}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Badges;
