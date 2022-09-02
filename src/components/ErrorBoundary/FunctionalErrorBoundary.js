import React from 'react';

function Catch(component, errorHandler) {
  return class extends React.Component {
    state = {
      error: undefined
    };

    static getDerivedStateFromError(error) {
      return { error };
    }

    componentDidCatch(error, info) {
      if (errorHandler) {
        errorHandler(error, info);
      }
    }

    render() {
      return component(this.props, this.state.error);
    }
  };
}

export const FunctionalErrorBoundary = Catch((props, error) => {
  if (!error) {
    return <>{props.children}</>;
  }
});
