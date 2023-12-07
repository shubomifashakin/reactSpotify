import styles from "../CssModules/Top20.module.css";

function Top20Section() {
  return <Top20 />;
}

function Top20() {
  return (
    <section className={styles.top20}>
      <div className={styles.top20Inner}>
        <Focus />
        <Main />
      </div>
    </section>
  );
}

function Focus() {
  return (
    <div className={styles.top20Focus}>
      <TrackOrArtistImage />
      <Details>
        <Detail label={"test"} data={"test"} />
        <Detail label={"test"} data={"test"} />
      </Details>

      <FocusSimilar />
    </div>
  );
}

function TrackOrArtistImage() {
  return (
    <span className={styles.focusImageContainer}>
      <img src="" className={styles.focusImage} />
    </span>
  );
}

function Details({ children }) {
  return <span className={styles.focusDetails}>{children}</span>;
}

function Detail({ label, data }) {
  return (
    <div className="focus-detail focus-detail-1">
      <p className={styles.focusLabel}>{label}</p>
      <p className={styles.focusData}>{data}</p>
    </div>
  );
}

function FocusSimilar() {
  return (
    <div className={styles.focusSimilar}>
      <p className={styles.focusLabel}>
        Similar <span></span>
      </p>

      <SimilarTracksOrArtistsContainer />
    </div>
  );
}

function SimilarTracksOrArtistsContainer() {
  return (
    <span className={styles.focusSimilarInner}>
      <div className={styles.focusSimilarOverflow}></div>
    </span>
  );
}

function Main() {
  return <div className={styles.top20Main}></div>;
}

function Item() {
  return <></>;
}

export default Top20Section;
