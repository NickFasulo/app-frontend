function BackgroundGradients() {
  return (
    <>
      <img
        src="/images/background/gradient1.svg"
        alt="background gradient"
        style={{
          position: 'fixed',
          zIndex: -1
        }}
      />
      <img
        src="/images/background/gradient2.svg"
        alt="background gradient"
        style={{
          position: 'fixed',
          left: '50%',
          zIndex: -1
        }}
      />
      <img
        src="/images/background/gradient3.svg"
        alt="background gradient"
        style={{
          position: 'fixed',
          right: '0',
          bottom: 0,
          zIndex: -1
        }}
      />
    </>
  );
}

export default BackgroundGradients;
