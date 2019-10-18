import React, {useState, createContext} from 'react';

export const RefreshContext = createContext();

export const RefreshProvider = props => {
  const [refreshing, setRefreshing] = useState(false);

  return (
    <RefreshContext.Provider value={[refreshing, setRefreshing]}>
      {props.children}
    </RefreshContext.Provider>
  );
};
