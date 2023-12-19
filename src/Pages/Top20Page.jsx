import { memo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import { TopPageLayout } from "../components/TopPageLayout";
import { Spinner } from "../components/Spinner";
import { ErrorComponent } from "../components/Error";

import { dataStore } from "../Stores/DataStore";
import { authStore } from "../Stores/AuthStore";
import { focusStore } from "../Stores/FocusStore";

import styles from "./Top20.module.css";
import gsap from "gsap";

export function Top20Page({ label }) {
  //when we click the item , the search params would change, causing the component to re-render
  const [searchParams, setSearchParams] = useSearchParams();

  //similarId would be empty when the page first renders
  const similarId = searchParams.get("id");

  const { setSimilarId, setLabel, resetSimilarData } = focusStore(function (
    state
  ) {
    return state;
  });

  //on mount it sets the similarId state in the focusStore and when the similar id changes
  useEffect(
    function () {
      setSimilarId(similarId);
    },
    [similarId, setSimilarId]
  );

  //on mount, it sets the labelState in the focusStore
  useEffect(
    function () {
      setLabel(label);
    },
    [setLabel, label]
  );

  //on mount, it clears the similarData state in the focusStore
  useEffect(
    function () {
      resetSimilarData();
    },
    [resetSimilarData]
  );

  //when anywhere that is not a top item in the section is clicked, the searchParams would clear and the focus container would close
  function clearSearchParams() {
    setSearchParams();
  }

  return (
    <TopPageLayout label={label}>
      <section className={styles.top20} onClick={clearSearchParams}>
        <div className={styles.top20Inner}>
          {/*Focus section would not render when the Page first mounts because there is no similarId */}
          {similarId ? <Focus /> : null}
          <Main />
        </div>
      </section>
    </TopPageLayout>
  );
}

const Focus = function Focus() {
  //get the token from the AuthStore
  const token = authStore(function (state) {
    return state.token;
  });

  //get the states from the focusStore
  const {
    label,
    loading,
    error: similarError,
    getSimilarSongs,
    getSimilarArtists,
    similarData,
    similarId,
  } = focusStore(function (state) {
    return state;
  });

  //if we are on the track page use the getSimilarSongs function else use the getSimilarArtists function
  const similarFunction =
    label === "track" ? getSimilarSongs : getSimilarArtists;

  //fetch the similarData
  useEffect(
    function () {
      if (similarId) {
        similarFunction(token, similarId);
      }
    },
    [token, similarId, similarFunction]
  );

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`${styles.top20Focus} ${similarId ? styles.focusActive : ""}`}
    >
      {/*when data is being fetched*/}
      {loading ? <Spinner /> : null}

      {/*if it has finished loading and we have similar data */}
      {!loading && Object.keys(similarData).length > 0 && !similarError ? (
        <>
          <TrackOrArtistImage />
          <Details>
            <Detail />
          </Details>

          <FocusSimilar />
        </>
      ) : null}

      {/*when the focus first mounts before the useEffect runs */}
      {!loading && Object.keys(similarData).length < 0 && !similarError ? (
        <ErrorComponent failure={false} message={"Please wait"} />
      ) : null}

      {/*when there is an error */}
      {!loading && similarError ? (
        <ErrorComponent
          message={similarError}
          onClickFn={() => similarFunction(token, similarId)}
        />
      ) : null}
    </div>
  );
};

function TrackOrArtistImage() {
  //get the info of the item we clicked from the focusStore
  const item = focusStore(function (state) {
    return state.focusItem;
  });

  return (
    <>
      <span className={styles.focusImageContainer}>
        <img
          className={styles.focusImage}
          src={item.images ? item?.images[0].url : item.album.images[1].url}
        />
      </span>
    </>
  );
}

function Details({ children }) {
  return <span className={styles.focusDetails}>{children}</span>;
}

const Detail = memo(function Detail() {
  //get the label and the info of the item we clicked from focusStore
  const { label, focusItem: item } = focusStore(function (state) {
    return state;
  });

  return (
    <>
      <div className="focus-detail focus-detail-1">
        <p className={styles.focusLabel}>{label}</p>
        <p className={styles.focusData}>{item.name}</p>
      </div>

      <div className="focus-detail focus-detail-1">
        <p className={styles.focusLabel}>
          {label === "track" ? "By" : "Genres"}
        </p>
        <p className={styles.focusData}>
          {label === "track" ? item.artists[0].name : item.genres[0]}
        </p>
      </div>
    </>
  );
});

const FocusSimilar = memo(function FocusSimilar() {
  const label = focusStore(function (state) {
    return state.label;
  });

  return (
    <div className={styles.focusSimilar}>
      <p className={styles.focusLabel}>
        Similar <span>{label}s</span>
      </p>

      <SimilarTracksOrArtistsContainer />
    </div>
  );
});

function SimilarTracksOrArtistsContainer() {
  const { label, similarData } = focusStore(function (state) {
    return state;
  });

  console.log(label, similarData);
  //if we are on the tracks page, the similar data is for the tracks and vice versa
  const similarDataBasedOnCurrentPage =
    label === "track" ? similarData.tracks : similarData.artists;

  return (
    <span className={styles.focusSimilarInner}>
      <div className={styles.focusSimilarOverflow}>
        {similarDataBasedOnCurrentPage.map((c, i) => (
          <SimilarItem item={c} key={i} />
        ))}
      </div>
    </span>
  );
}

function SimilarItem({ item }) {
  return (
    <a
      target="blank"
      href={item.external_urls.spotify}
      className={styles.similarData}
    >
      <img
        src={item.images ? item?.images[0].url : item.album.images[1].url}
        className={styles.similarImage}
      />
    </a>
  );
}

const Main = memo(function Main() {
  //get the data to be used from the data store
  const { tracksData, artistsData } = dataStore(function (state) {
    return state;
  });

  //get the label from the focusStore
  const label = focusStore(function (state) {
    return state.label;
  });

  //if we clicked the see more button from the top tracks page, get the top tracks array else, get the top artists array
  const top20Data = label === "track" ? tracksData.items : artistsData.items;

  const colRef = useRef(null);

  useEffect(function () {
    //show the focus section
    const timeline = gsap.timeline({ defaults: { duration: 1 } });

    timeline.fromTo(
      colRef.current.children,
      { opacity: 0 },
      { opacity: 1, stagger: 0.65 }
    );
  }, []);

  return (
    //we pass only 4 array items each since we have 5 columns
    <div ref={colRef} className={styles.top20Main}>
      <Cols data={top20Data.slice(0, 4)} iterator={1} />

      <Cols data={top20Data.slice(4, 8)} border={true} iterator={5} />

      <Cols data={top20Data.slice(8, 12)} iterator={9} />

      <Cols data={top20Data.slice(12, 16)} border={true} iterator={13} />

      <Cols data={top20Data.slice(16, 20)} iterator={17} />
    </div>
  );
});

function Cols({ data, iterator, border = false }) {
  return (
    //cols with a border receive a special style
    <div className={`${styles.col} ${border ? styles.bordered : ""}`}>
      {/* here the index(i) starts from 0,  we add the iterator to the index to continue from where we stopped in our labeling */}
      {data.map((info, i) => (
        <Item key={i} info={info} index={i + iterator} />
      ))}
    </div>
  );
}

const Item = memo(function Item({ info, index }) {
  const [searchParams, setSearchParams] = useSearchParams();

  //gets the item clicked from the state and the action to set the value of the item clicked in the state
  const { setFocusItem, focusItem } = focusStore(function (state) {
    return state;
  });

  //when the user clicks an item, set the focusItem state to the track/artist data we clicked & add the id of that track/artist to the search params
  function triggerFocus(e, id, info) {
    e.stopPropagation();
    //if the current focus item is the same as the one that was clicked, remove the focusItem and remove the searchParams
    focusItem === info ? setFocusItem("") : setFocusItem(info);
    focusItem === info ? setSearchParams({}) : setSearchParams({ id });
  }

  return (
    <span
      className={styles.topItem}
      onClick={(e) => triggerFocus(e, info.id, info)}
    >
      <div className={styles.topItemInner}>
        <ItemImage info={info} />

        <ItemDetails info={info} index={index} />
      </div>
    </span>
  );
});

const ItemImage = memo(function ItemImage({ info }) {
  const label = focusStore(function (state) {
    return state.label;
  });

  return (
    <div className={styles.topImageContainer}>
      <img
        src={label === "track" ? info.album.images[0].url : info.images[0].url}
        className={styles.topImage}
      />
    </div>
  );
});

function ItemDetails({ info, index }) {
  const label = focusStore(function (state) {
    return state.label;
  });

  return (
    <div className={styles.topItemDetails}>
      <span className={styles.detail}>
        <div className={styles.topLabelNo}>
          <p className={`${styles.topLabel} ${styles.topLabel1}`}>{label}</p>

          <p className={styles.topItemNo}>{index}</p>
        </div>
        <p className={`${styles.topData} `}>
          <a href={info.external_urls.spotify} className={styles.topDataLink}>
            {info.name}&nbsp;
            <i className="fa-brands fa-spotify spotify-icon"></i>
          </a>
        </p>
      </span>

      <span className={styles.detail}>
        <p className={`${styles.topLabel}`}>
          {label === "track" ? "By" : "Genres"}
        </p>

        <p className={`${styles.topData} `}>
          {label === "track" ? info.artists[0].name : info.genres[0]}
        </p>
      </span>
    </div>
  );
}
