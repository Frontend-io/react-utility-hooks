import { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';

const useFilters = ({ query, retainResultOnClear = false, variables = {} }) => {
  const useSearchQuery = options => useLazyQuery(query, options);
  
  const [searchResult, setSearchResult] = useState(null);
  const [canSearch, setCanSearch] = useState(false);
  const [whatSearching, setWhatsearching] = useState('');
  const [isSearching, setIsSearching] = useState({});

  const [onSearch, { data, loading }] = useSearchQuery({
    onError: err => console.log(err.message);
  });

  const setFilter = payload => {
    const filterIsValid =
      (payload && typeof payload === 'string') ||
      (payload && typeof payload === 'object' && Object.values(payload).length);

    if (filterIsValid) {
      if (typeof payload === 'object') {
        setWhatsearching('range');
        onSearch({
          variables: {
            ...variables,
            filters: {
              ...payload
            }
          }
        });
      } else {
        setWhatsearching('search');
        onSearch({
          variables: {
            ...variables,
            filters: {
              search: payload
            }
          }
        });
      }
      setTimeout(() => setCanSearch(true), 50);
    } else {
      setCanSearch(false);
      setSearchResult(null);
    }
  };

  useEffect(() => {
    if (canSearch) setSearchResult(data);
  });

  useEffect(() => {
    setIsSearching({ [whatSearching]: loading });
  }, [loading]);

  return {
    isSearching,
    searchResult: retainResultOnClear ? data : searchResult,
    setFilter
  };
};

export default useFilters;
