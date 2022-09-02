import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import { Button, styled } from '@mui/material';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAuthModal } from '../../contexts/AuthModalContext';
import { useAuth } from '../../contexts/AuthContext';

const StyledButton = styled(Button)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  width: 120,
  borderRadius: 100,
  [theme.breakpoints.down('md')]: {
    right: '50%',
    bottom: theme.spacing(3.5),
    transform: `translateX(50%)`
  }
}));

function ConnectButton() {
  const { isCheckingAuth, isLoggedIn } = useAuth();
  const { startEthAuth, open: openAuthModal } = useAuthModal();
  const { isConnected } = useAccount();
  const { pathname } = useRouter();
  const { openConnectModal } = useConnectModal();

  const isStakingPage = pathname.startsWith('/staking');

  const handleConnect = () => {
    if (isStakingPage) {
      openConnectModal();
      startEthAuth({ noRedirect: true });
    } else {
      openAuthModal({ noRedirect: false });
    }
  };

  // If user's logged in, show nothing.
  if (isCheckingAuth || isLoggedIn) return null;

  // If user's on staking page and already connected wallet, show nothing.
  if (isConnected && isStakingPage) return null;

  return (
    <StyledButton variant="contained" size="large" onClick={handleConnect}>
      Connect
    </StyledButton>
  );
}

export default ConnectButton;
