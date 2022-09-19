import React from 'react';
import { useRouter } from 'next/router';
import useYupListFilters from '../../hooks/useYupListFilters';
import Header from './Header';
import FeedList from './FeedList';
import LoadingSpin from '../../LoadingSpin';
import YupPageHeader from '../YupPageHeader';
import { YupContainer } from '../styles';

// Context for filters
const FilterContext = React.createContext(null);
export const useFilters = () => React.useContext(FilterContext);

function LeaderboardContainer() {
  const { query } = useRouter();
  const { platform, subject, category } = query;

  const filters = useYupListFilters({ platform, subject, category });

  if (!filters) {
    return <LoadingSpin />;
  }

  return (
    <FilterContext.Provider value={filters}>
      <YupPageHeader noborder sx={{ pb: 3 }}>
        <Header />
      </YupPageHeader>
      <YupContainer>
        <FeedList />
      </YupContainer>
    </FilterContext.Provider>
  );
}

export default LeaderboardContainer;
