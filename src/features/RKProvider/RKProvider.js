import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material';
import {
  RainbowKitProvider,
  getDefaultWallets,
  lightTheme,
  darkTheme
} from '@rainbow-me/rainbowkit';
import { WagmiConfig, chain, 
  createClient,
  configureChains, } from 'wagmi';

import { alchemyApiKeys, ethereumConfig,polygonConfig } from '../../config';
import { alchemyProvider } from 'wagmi/providers/alchemy';

import '@rainbow-me/rainbowkit/styles.css';

// const chains = [
//   { ...chain.mainnet, name: 'Ethereum' },
//   { ...chain.polygonMainnet, name: 'Polygon' }
// ];

// const provider = ({ chainId }) => {
//   if (alchemyApiKeys[chainId]) {
//     return new providers.AlchemyProvider(chainId, alchemyApiKeys[chainId]);
//   }

//   return null;
// };

const { chains, provider } = configureChains(
  [chain.polygon, chain.mainnet],
  [
    alchemyProvider({ alchemyId: alchemyApiKeys[ethereumConfig.chainId] }),
    alchemyProvider({ alchemyId: alchemyApiKeys[polygonConfig.chainId] })
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Yup',
  chains
});


const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})
  
const RKProvider = ({ children }) => {
  const { palette } = useTheme();

  const rkDefaultTheme = palette.mode === 'light' ? lightTheme : darkTheme;
  const rkTheme = rkDefaultTheme({
    colors: {
      accentColor: palette.P500,
      modalBackground: `${palette.M500}44;`, // backdrop-filter: blur(20px);
      modalBackdrop: `${palette.M800}88;`,
      modalTextSecondary: palette.M300,
      modalText: palette.M50
    },
    fonts: {
      body: 'Gilroy'
    },
    radii: {
      modal: '16px'
    }
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={rkTheme}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

RKProvider.propTypes = {
  children: PropTypes.node
};

export default RKProvider;
