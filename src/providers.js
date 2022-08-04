import React from 'react';
import PropTypes from 'prop-types';
import RKProvider from './features/RKProvider';
import { AuthModalContextProvider } from './contexts/AuthModalContext';
import { AppUtilsProvider } from './contexts/AppUtilsContext';
import { AppLayoutProvider } from './contexts/AppLayoutContext';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeModeProvider } from './contexts/ThemeModeContext';
import SnackbarProvider from './providers/SnackbarProvider';

const Providers = ({ children }) => {
  return (
    <Provider store={store}>
      <ThemeModeProvider>
        <SnackbarProvider>
          <AuthProvider>
            <RKProvider>
              <AppUtilsProvider>
                <AuthModalContextProvider>
                  <AppLayoutProvider>{children}</AppLayoutProvider>
                </AuthModalContextProvider>
              </AppUtilsProvider>
            </RKProvider>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeModeProvider>
    </Provider>
  );
};

Providers.propTypes = {
  children: PropTypes.node
};

export default Providers;
