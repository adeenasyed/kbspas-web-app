import { createContext, useContext, useState } from 'react';

const RateLimitContext = createContext();

export const useRateLimit = () => useContext(RateLimitContext);

export const RateLimitProvider = ({ children }) => {
  const [rateLimitError, setRateLimitError] = useState(false);
  return (
    <RateLimitContext.Provider value={{rateLimitError, setRateLimitError}}>
      {children}
    </RateLimitContext.Provider>
  );
};
