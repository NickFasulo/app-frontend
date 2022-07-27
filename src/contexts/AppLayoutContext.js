import { createContext, useContext, useState } from 'react';

const AppLayoutContext = createContext({
  headerHeight: null,
  setHeaderHeight: () => {}
});

export const AppLayoutProvider = ({ children }) => {
  const [headerHeight, setHeaderHeight] = useState(null);

  return (
    <AppLayoutContext.Provider
      value={{
        headerHeight,
        setHeaderHeight
      }}
    >
      {children}
    </AppLayoutContext.Provider>
  );
};

export const useAppLayout = () => useContext(AppLayoutContext);

export default AppLayoutContext;
