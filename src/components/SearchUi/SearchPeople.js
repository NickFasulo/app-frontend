import React from 'react';
import { useSearchPeople } from '../../hooks/queries';
import UserConnection from '../UserConnection/UserConnection';
import { DEFAULT_SEARCH_SIZE } from '../../config';
import { FlexBox } from '../styles';
import { UserConnectionSkeleton } from '../Skeletons';

const SearchPeople = ({ searchQuery }) => {
  const { isLoading, data: people } = useSearchPeople(searchQuery);

  if (isLoading) {
    return (
      <FlexBox flexDirection="column" gap={2}>
        {[...Array(DEFAULT_SEARCH_SIZE).keys()].map((idx) => (
          <UserConnectionSkeleton key={idx} />
        ))}
      </FlexBox>
    );
  }

  if (!people) return null;

  return people.map((user) => <UserConnection user={user} />);
};

export default SearchPeople;
