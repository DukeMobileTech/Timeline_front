import React, {useState, createContext} from 'react';

export const RefreshContext = createContext();

export const RefreshProvider = props => {
  const [refreshing, setRefreshing] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  return (
    <RefreshContext.Provider value={[refreshing, setRefreshing, shouldRefresh, setShouldRefresh]}>
      {props.children}
    </RefreshContext.Provider>
  );
};
