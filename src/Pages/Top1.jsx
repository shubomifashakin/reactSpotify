import { useContext } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import TopContainer from "../components/top";
import styles from "../CssModules/top1.module.css";
import { Link } from "react-router-dom";
import { UserData } from "../components/ContextProvider";
import Recommendations from "../components/Recommendations";
import OpenSection from "../components/OpenSection";

function Top1Page({ pageLabel }) {
  const { tracksData, artistsData } = useContext(UserData);

  return (
    <>
      {(pageLabel === "track" && tracksData.items.length >= 2) ||
      (pageLabel === "artist" && artistsData.items.length >= 20 >= 20) ? (
        <Top1 pageLabel={pageLabel} />
      ) : (
        <Recommendations />
      )}
    </>
  );
}

function Top1({ pageLabel }) {
  return (
    <>
      <OpenSection label={pageLabel} />
      <Navbar label={pageLabel} />
      <TopContainer>
        <div className={styles.top1Section}>
          <Left label={pageLabel} />
          <Right label={pageLabel} />
        </div>
      </TopContainer>
      <Footer />
    </>
  );
}

function Left({ label }) {
  const { tracksData, artistsData } = useContext(UserData);
  return (
    <div className={styles.topLeft}>
      <img
        className={styles.topAlbumImage}
        src={
          label === "track"
            ? tracksData.items[0].album.images[0].url
            : artistsData.items[0].url
        }
      />
    </div>
  );
}

function Right({ label }) {
  const { tracksData, artistsData } = useContext(UserData);
  const info =
    label === "track"
      ? tracksData.items[0].artists[0].name
      : artistsData.items[0].genres.slice(0, 2);
  return (
    <div className={styles.topRight}>
      <LinkToSongOrArtist label={label} />

      {label === "track" ? (
        <>
          <FromAlbum />
          <ByArtist label={"by"} info={info} />
        </>
      ) : (
        <ByArtist label={"genres"} info={info} />
      )}

      <SeeMore label={label} />
    </div>
  );
}

function LinkToSongOrArtist({ label }) {
  const { tracksData, artistsData } = useContext(UserData);
  return (
    <div className={`${styles.trackInfo} ${styles.top1Main}`}>
      <p className={styles.infoHead}>
        Top &nbsp;
        <span className={styles.requestedData}>{label}</span>
      </p>
      <h1 className={`${styles.infoDetail} ${styles.infoTopName}`}>
        <a
          className={styles.infoTopLink}
          target="blank"
          href={
            label === "track"
              ? tracksData.items[0].external_urls.spotify
              : artistsData[0].external_urls.spotify
          }
        >
          <span className={styles.infoTopNameInner}>
            {label === "track" ? tracksData.items[0].name : artistsData[0].name}
          </span>
          <i className={`fa-brands fa-spotify ${styles.spotifyIcon}`}></i>
        </a>
      </h1>
    </div>
  );
}

function FromAlbum() {
  const { tracksData } = useContext(UserData);
  return (
    <div className={`${styles.trackInfo} `}>
      <p className={`${styles.infoHead} `}>From</p>
      <h1 className={`${styles.infoDetail} `}>
        {tracksData.items[0].album.name}
      </h1>
    </div>
  );
}

function ByArtist({ label, info }) {
  return (
    <div className={`${styles.trackInfo} `}>
      <p className={`${styles.infoHead}`}>{label}</p>
      <h1 className={`${styles.infoDetail} `}>{info}</h1>
    </div>
  );
}

function SeeMore({ label }) {
  return (
    <Link to={"all"} className={`${styles.seeMore} see-more-${label}s`}>
      See More {String(label).toLowerCase()}s
    </Link>
  );
}
export default Top1Page;
