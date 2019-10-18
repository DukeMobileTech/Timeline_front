import React, {useState, createContext} from 'react';

export const AccessTokenContext = createContext();

export const AccessTokenProvider = props => {
  const [token, setToken] = useState(null);

  return (
    <AccessTokenContext.Provider value={[token, setToken]}>
      {props.children}
    </AccessTokenContext.Provider>
  );
};
