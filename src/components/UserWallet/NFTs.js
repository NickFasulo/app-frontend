import { Box, Button, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import NftCard from '../NftCard/NftCard';
import { FlexBox } from '../styles';

const NFTs = ({ data }) => {
  const [showAll, setShowAll] = useState(false);

  return (
    <>
      <Typography variant="h6" sx={{ my: 3 }}>
        NFTs
      </Typography>
      {data?.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {(showAll ? data : data.slice(0, 2)).map(
              ({
                imageURI,
                collectionName,
                collectionImageURI,
                verified,
                link
              }) => (
                <Grid key={imageURI} item xs={12} sm={6}>
                  <NftCard
                    image={imageURI}
                    collectionName={collectionName}
                    collectionImage={collectionImageURI}
                    link={link}
                    verified={verified}
                  />
                </Grid>
              )
            )}
          </Grid>
          {data.length > 2 && (
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
        <Typography>You don't have any NFTs.</Typography>
      )}
    </>
  );
};

export default NFTs;
