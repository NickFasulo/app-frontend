import { dehydrate, QueryClient } from '@tanstack/react-query';
import callYupApi from '../apis/base_api';
import HomeMenu from '../components/Landing/HomeMenu';
import { REACT_QUERY_KEYS } from '../constants/enum';
import { useHomeConfig, useRecommendation } from '../hooks/queries';

function Home() {
  return <HomeMenu />;
}

export async function getServerSideProps(context) {
  // const { username } = context.params;
  const qc = new QueryClient();
  // const profile = await callYupApi({
  //   url: `/accounts/${username}`
  // })

  // await qc.setQueryData([REACT_QUERY_KEYS.ACCOUNT, username], profile);
  await qc.prefetchQuery(
    [REACT_QUERY_KEYS.HOME_CONFIG],
    async () =>
      (await callYupApi({
        url: `/home-config/v2`
      })) || []
  );
  await qc.prefetchQuery(
    [REACT_QUERY_KEYS.YUP_COLLECTION, null, null, null, 7],
    async () =>
      (await callYupApi({
        url: '/collections/recommended',
        method: 'GET'
      })) || []
  );

  return {
    props: {
      dehydratedState: dehydrate(qc)
    }
  };
}

export default Home;
