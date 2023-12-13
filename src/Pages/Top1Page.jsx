import { useContext } from "react";
import { UserData } from "../components/ContextProvider";
import { Link } from "react-router-dom";

import { TopPageLayout } from "../components/TopPageLayout";
import { OpenSection } from "../components/OpenSection";

import styles from "../CssModules/Top1.module.css";

export function Top1Page({ label }) {
  return (
    <>
      <OpenSection label={label} />
      <TopPageLayout label={label}>
        <div className={styles.top1Section}>
          <Left label={label} />
          <Right label={label} />
        </div>
      </TopPageLayout>
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
            : artistsData.items[0].images[0].url
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
      : artistsData.items[0].genres.slice(0, 2).join(", ");

  return (
    <div className={styles.topRight}>
      <LinkToSongOrArtist label={label} />

      {label === "track" ? (
        <>
          <FromDiv />
          <ByOrGenresDiv>
            <p className={`${styles.infoHead}`}>By</p>
            <h1 className={`${styles.infoDetail} `}>{info}</h1>
          </ByOrGenresDiv>
        </>
      ) : null}

      {label === "artist" ? (
        <ByOrGenresDiv label={"genres"} info={info}>
          <p className={`${styles.infoHead}`}>Genres</p>
          <h1 className={`${styles.infoDetail} `}>{info}</h1>
        </ByOrGenresDiv>
      ) : null}

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
              : artistsData.items[0].external_urls.spotify
          }
        >
          <span className={styles.infoTopNameInner}>
            {label === "track"
              ? tracksData.items[0].name
              : artistsData.items[0].name}
          </span>
          &nbsp;
          <i className={`fa-brands fa-spotify ${styles.spotifyIcon}`}></i>
        </a>
      </h1>
    </div>
  );
}

function FromDiv() {
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

function ByOrGenresDiv({ children }) {
  return <div className={`${styles.trackInfo} `}>{children}</div>;
}

function SeeMore({ label }) {
  return (
    <Link
      to={`../all${label}s`}
      className={`${styles.seeMore} see-more-${label}s`}
    >
      See More {String(label).toLowerCase()}s
    </Link>
  );
}
