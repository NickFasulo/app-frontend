import { useSelector } from 'react-redux';

const useExtension = () => {
  const scatter = useSelector((state) => state.scatterRequest.scatter);

  return {
    isInstalled: Boolean(scatter)
  };
};

export default useExtension;
