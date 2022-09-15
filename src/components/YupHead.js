import Head from 'next/head';

function YupHead({
  title,
  description,
  image,
  metaOther,
  metaOg,
  metaTwitter
}) {
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
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
          <meta property="twitter:description" content={description} />
        </>
      )}

      <meta property="image" content={image} />
      <meta property="og:image" content={image} />
      <meta property="twitter:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@yup_io" />

      {Object.entries(metaOther || {}).map(([k, v]) => (
        <meta key={k} property={k} content={v} />
      ))}

      {Object.entries(metaOg || {}).map(([k, v]) => (
        <meta key={k} property={`og:${k}`} content={v} />
      ))}

      {Object.entries(metaTwitter || {}).map(([k, v]) => (
        <meta key={k} name={`twitter:${k}`} content={v} />
      ))}
    </Head>
  );
}

export default YupHead;
