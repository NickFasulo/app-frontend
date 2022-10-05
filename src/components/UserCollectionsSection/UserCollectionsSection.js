import { Grid, Typography } from '@mui/material';
import { useState } from 'react';
import { FlexBox } from '../styles';
import CollectionCard from '../CollectionCard';
import { USER_COLLECTION_PAGE_SIZE } from '../../config';
import CollectionPagination from './CollectionPagination';

function UserCollectionsSection({ collections }) {
  const [page, setPage] = useState(0);

  const pageStartIndex = page * USER_COLLECTION_PAGE_SIZE;
  const pageCollections = collections.slice(
    pageStartIndex,
    Math.min(pageStartIndex + USER_COLLECTION_PAGE_SIZE, collections.length)
  );

  return (
    <>
      <FlexBox
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1.5 }}
      >
        <FlexBox alignItems="center">
          <Typography variant="h5">Collections</Typography>
          <Typography
            variant="body2"
            sx={{
              ml: 0.5,
              color: (theme) => theme.palette.M400
            }}
          >
            ({collections.length})
          </Typography>
        </FlexBox>
        <CollectionPagination
          page={page}
          total={collections.length}
          pageSize={USER_COLLECTION_PAGE_SIZE}
          onSetPage={setPage}
        />
      </FlexBox>
      <Grid container spacing={2.5}>
        {pageCollections.map((collection) => (
          <Grid item xs={12} md={12} lg={6}>
            <CollectionCard data={collection} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default UserCollectionsSection;
