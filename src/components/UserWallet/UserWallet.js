import GridLayout from '../GridLayout';
import { Box } from '@mui/material';
import { useWalletInfo } from '../../hooks/queries';
import Badges from './Badges';
import NFTs from './NFTs';
import Tokens from './Tokens';
import useDevice from '../../hooks/useDevice';

const UserWallet = ({ ethAddress }) => {
  const { isMobile } = useDevice();
  const { tokens, nfts, poaps } = useWalletInfo(ethAddress);

  return (
    <>
      <GridLayout
        contentLeft={
          <Box>
            {isMobile && <Tokens data={tokens} />}
            <Badges data={poaps} />
            <NFTs data={nfts} />
          </Box>
        }
        contentRight={<Tokens data={tokens} />}
      />
    </>
  );
};

export default UserWallet;
