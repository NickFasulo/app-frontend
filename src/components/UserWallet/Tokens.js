import { Button, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import Erc20Token from '../Erc20Token';
import { FlexBox } from '../styles';

const Tokens = ({ data }) => {
  const [showAll, setShowAll] = useState(false);
  const filteredData = (data || []).filter(({ balance }) => balance > 0.001);

  return (
    <>
      <Typography variant="h6" sx={{ my: 3 }}>
        Tokens
      </Typography>
      {filteredData.length > 0 ? (
        <>
          <Grid container spacing={1.5} sx={{ mb: 1 }}>
            {(showAll ? filteredData : filteredData.slice(0, 4)).map(
              ({
                name,
                symbol,
                image,
                chain,
                chainImage,
                balance,
                balanceUSD
              }) => (
                <Grid key={name} item xs={12}>
                  <Erc20Token
                    name={name}
                    image={image}
                    chain={chain}
                    chainImage={chainImage}
                    balance={balance}
                    balanceUSD={balanceUSD}
                    symbol={symbol}
                  />
                </Grid>
              )
            )}
          </Grid>
          {filteredData.length > 4 && (
            <FlexBox justifyContent="flex-end">
              <Button
                sx={{
                  width: 100
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
        <Typography>You don't have any tokens in your wallet.</Typography>
      )}
    </>
  );
};

export default Tokens;
