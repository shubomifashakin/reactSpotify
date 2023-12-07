function Error({ children }) {
  return (
    <section className="error-section">
      {/* <h2 className="error-message">sample text</h2>
      <div className="error-recommendations">
        <h2 className="recommendations-header"></h2>

        <div className="inner-recommendations">
          <span className="recommendations"> </span>
        </div>
      </div>
      <a className="error-return" href="#returnToIntro">
        Listen to some music and check back after some time.
      </a> */}
      {children}
    </section>
  );
}

export default Error;
