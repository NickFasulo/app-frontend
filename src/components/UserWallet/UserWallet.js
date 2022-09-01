import GridLayout from '../GridLayout';
import { Box } from '@mui/material';
import { useWalletInfo } from '../../hooks/queries';
import Badges from './Badges';
import NFTs from './NFTs';
import Tokens from './Tokens';

const UserWallet = ({ ethAddress }) => {
  const { tokens, nfts, poaps } = useWalletInfo(ethAddress);

  return (
    <>
      <GridLayout
        contentLeft={(
          <Box mb={5}>
            <Badges data={poaps} />
            <NFTs data={nfts} />
          </Box>
        )}
        contentRight={(
          <Tokens data={tokens} />
        )}
      />
    </>
  );
};

export default UserWallet;
