import { Box, Grid, Skeleton } from '@mui/material';
import { FlexBox } from '../styles';

function UserCollectionSkeleton() {
  return (
    <>
      <FlexBox
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2.5 }}
      >
        <FlexBox alignItems="center">
          <Skeleton animation="wave" width="100px" height={40} />
        </FlexBox>
        <Skeleton animation="wave" width="40px" height={40} />
      </FlexBox>
      <Grid container spacing={2.5}>
        {[0, 1, 2, 3, 4, 5].map(() => (
          <Grid item xs={12} md={12} lg={6}>
            <Skeleton animation="wave" height="120px" width="100%" />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default UserCollectionSkeleton;
