import React from 'react';
import PropTypes from 'prop-types';
import RKProvider from './features/RKProvider';
import { AuthModalContextProvider } from './contexts/AuthModalContext';
import { AppUtilsProvider } from './contexts/AppUtilsContext';
import { AppLayoutProvider } from './contexts/AppLayoutContext';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeModeProvider } from './contexts/ThemeModeContext';
import SnackbarProvider from './providers/SnackbarProvider';

const Providers = ({ children }) => (
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
);

Providers.propTypes = {
  children: PropTypes.node
};

export default Providers;
