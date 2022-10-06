import React from 'react';
import ContentLoader from 'react-content-loader';
import { useTheme } from '@mui/styles';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

function FeedLoader() {
  const { palette } = useTheme();
  return (
    <ErrorBoundary>
      <div>
        <div
          style={{
            width: '100%',
            margin: 'auto',
            background: `${palette.M900}80`,
            borderRadius: '12px',
            marginBottom: '10px'
          }}
        >
          <ContentLoader
            height={160}
            primaryColor={`${palette.M800}50`}
            secondaryColor={`${palette.M800}10`}
            speed={2}
            width={612}
          >
            <rect height="10" rx="4" ry="40" width="117" x="50" y="15" />
            <rect height="4" rx="2" ry="7" width="105" x="56" y="28" />
            <circle cx="25" cy="25" r="18" />
            <rect height="100" rx="4" ry="4" width="576" x="12" y="50" />
          </ContentLoader>
          <ContentLoader
            height={16}
            primaryColor={`${palette.M800}50`}
            secondaryColor={`${palette.M800}10`}
            speed={1}
            width={612}
          >
            <rect height="10" rx="4" ry="4" width="500" x="12" y="3" />
          </ContentLoader>
        </div>
        <div
          style={{
            width: '100%',
            margin: 'auto',
            background: `${palette.M900}80`,
            borderRadius: '12px'
          }}
        >
          <ContentLoader
            height={250}
            primaryColor={`${palette.M800}50`}
            secondaryColor={`${palette.M800}10`}
            speed={2}
            width={612}
          >
            <rect height="10" rx="4" ry="40" width="117" x="50" y="15" />
            <rect height="4" rx="2" ry="7" width="105" x="56" y="28" />
            <circle cx="25" cy="25" r="18" />
            <rect height="100" rx="4" ry="4" width="576" x="12" y="50" />
          </ContentLoader>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default FeedLoader;
