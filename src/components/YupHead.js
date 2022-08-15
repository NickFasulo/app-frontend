import Head from 'next/head';

const YupHead = ({ title, description, image, meta }) => {
  if (!image) {
    image = '/images/metaImages/main-meta.jpg';
  }

  return (
    <Head>
      <meta charSet="utf-8" />
      {title && (
        <>
          <title>{title}</title>
          <meta property="og:title" content={title} />
          <meta property="twitter:title" content={title} />
        </>
      )}
      {description && (
        <>
          <meta property="description" content={description} />
          <meta property="og:description" content={description} />
          <meta property="twitter:description" content={description} />
        </>
      )}

      <meta property="image" content={image} />
      <meta property="og:image" content={image} />
      <meta property="twitter:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@yup_io" />

      {Object.entries(meta || {}).map(([k, v]) => (
        <meta key={k} name={k} content={v} />
      ))}
    </Head>
  );
};

export default YupHead;
