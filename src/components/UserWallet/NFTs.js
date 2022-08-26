import { Grid, Typography } from '@mui/material';
import NftCard from '../NftCard/NftCard';

const NFTs = ({ data }) => {
  return (
    <>
      <Typography variant="h6" sx={{ my: 3 }}>
        NFTs
      </Typography>
      <Grid container spacing={3}>
        {data.map(({ image, collectionName, collectionImage, verified, link }) => (
          <Grid key={image} item xs={12} sm={6}>
            <NftCard
              image={image}
              collectionName={collectionName}
              collectionImage={collectionImage}
              link={link}
              verified={verified}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default NFTs;
