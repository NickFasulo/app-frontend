import GridLayout from '../GridLayout';
import { Box } from '@mui/material';
import { useWalletInfo } from '../../hooks/queries';
import Badges from './Badges';
import NFTs from './NFTs';
import Tokens from './Tokens';
import useDevice from '../../hooks/useDevice';
import PageLoadingBar from '../PageLoadingBar';

const UserWallet = ({ ethAddress }) => {
  const { isMobile } = useDevice();
  const { isLoading, data: walletData } = useWalletInfo(ethAddress);

  if (isLoading) {
    return <PageLoadingBar />;
  }

  if (!walletData) return null;

  const { tokens, nfts, poaps } = walletData;

  return (
    <>
      <GridLayout
        contentLeft={
          <Box mb={3}>
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
