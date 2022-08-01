import { useSelector } from 'react-redux';
import { userLevelSelector } from '../redux/selectors';

const useAccount = () => {
  const account = useSelector((state) => userLevelSelector(state));

  return {
    account
  };
};

export default useAccount;
