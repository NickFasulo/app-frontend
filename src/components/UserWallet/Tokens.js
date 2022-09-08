import { Grid, Typography } from '@mui/material';
import Erc20Token from '../Erc20Token';

const Tokens = ({ data }) => (
  <>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Tokens
    </Typography>
    <Grid container spacing={1.5} sx={{ mb: 3 }}>
      {data.map(
        ({ name, symbol, image, chain, chainImage, balance, balanceUSD }) => (
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
  </>
);

export default Tokens;
