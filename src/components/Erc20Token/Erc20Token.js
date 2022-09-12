import { Box, styled, Typography } from '@mui/material';
import YupImage from '../YupImage';
import { convertTokenBalance } from '../../utils/helpers';

const TokenRoot = styled('div')(({ theme }) => ({
  border: `solid 1px ${theme.palette.M750}`,
  backgroundColor: `${theme.palette.M900}88`,
  padding: theme.spacing(2.5),
  display: 'flex',
  gap: theme.spacing(2),
  borderRadius: 16,
  alignItems: 'center'
}));

const TokenImage = styled(YupImage)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: '100%'
}));

const ChainImage = styled(YupImage)(({ theme }) => ({
  width: 20,
  height: 20,
  borderRadius: '100%',
  position: 'absolute',
  right: 0,
  bottom: 0,
  transform: 'translate(5px, 5px)'
}));

const Erc20Token = ({ name, image, chain, symbol, chainImage, balance }) => (
  <TokenRoot>
    <Box position="relative" display="flex">
      <TokenImage src={image} alt={name} />
      {chainImage && <ChainImage src={chainImage} alt={chain} />}
    </Box>
    <Box flexGrow={1}>
      <Typography variant="h6">{name}</Typography>
      {chain && (
        <Typography
          sx={{
            color: (theme) => theme.palette.M400
          }}
        >
          {chain.toUpperCase()}
        </Typography>
      )}
    </Box>
    <Box>
      <Typography align="right">
        {convertTokenBalance(balance)} {symbol}
      </Typography>
    </Box>
  </TokenRoot>
);

export default Erc20Token;
