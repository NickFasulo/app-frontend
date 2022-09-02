import { useQuery } from '@tanstack/react-query';
import uniqBy from 'lodash/uniqBy';
import { REACT_QUERY_KEYS } from '../constants/enum';
import { apiGetListOptions } from '../apis/lists';

const useYupListFilters = (filter = {}) => {
  console.log('HEREEEEE1', apiGetListOptions);
  const { data: filterList } = useQuery(
    [REACT_QUERY_KEYS.YUP_LIST_FILTER],
    () => apiGetListOptions(filter)
  );
  console.log('HEREEEEE', filterList);
  if (!filterList?.length) return null;

  const { platform, subject } = filter;

  const platformOptions = uniqBy(
    filterList.map((item) => item.location),
    'name'
  );
  let selectedPlatform = platform;

  let filteredByPlatform = filterList.filter(
    (item) => item.location.name === selectedPlatform
  );

  if (filteredByPlatform.length === 0) {
    selectedPlatform = filterList[0].location.name;

    filteredByPlatform = filterList.filter(
      (item) => item.location.name === selectedPlatform
    );
  }

  const subjectOptions = filteredByPlatform.map((item) => item.subject);
  let selectedSubject = subject;

  let filteredBySubject = filteredByPlatform.filter(
    (item) => item.subject.name === selectedSubject
  );

  if (filteredBySubject.length === 0) {
    selectedSubject = filteredByPlatform[0].subject.name;

    filteredBySubject = filteredByPlatform.filter(
      (item) => item.subject.name === selectedSubject
    );
  }

  return {
    filterList,
    filterObject: filteredBySubject[0],
    platformOptions,
    subjectOptions,
    selectedPlatform,
    selectedSubject
  };
};

export default useYupListFilters;
