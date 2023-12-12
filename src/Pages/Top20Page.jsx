import {
  createContext,
  memo,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";

import { TopPageLayout } from "../components/TopPageLayout";
import { similarArtists, similarSongs } from "../Helpers/_actions";
import { Spinner } from "../components/Spinner";
import { UserData } from "../components/ContextProvider";
import { ErrorComponent } from "../components/Error";

import styles from "../CssModules/Top20.module.css";
import gsap from "gsap";

const FocusContext = createContext(null);

export function Top20Page({ label }) {
  const [searchParams, setSearchParams] = useSearchParams();
  //similarId would be empty when the page first renders
  const similarId = searchParams.get("id");
  const [focusItem, setFocusClickedItem] = useState("");

  //pass these values to the context
  //all components using the context would only re-render when any value in the context changes
  const values = useMemo(() => {
    return {
      similarId,
      label,
      setSearchParams,
      searchParams,
      focusItem,
      setFocusClickedItem,
    };
  }, [similarId, label, setSearchParams, searchParams, focusItem]);

  //when anywhere that is not a top item in the section is clicked, the searchParams would clear and the focus container would close
  function clearSearchParams() {
    setSearchParams();
  }

  return (
    <TopPageLayout label={label}>
      <FocusContext.Provider value={values}>
        <section className={styles.top20} onClick={clearSearchParams}>
          <div className={styles.top20Inner}>
            {/*Focus section would not render when the Page first mounts because there is no similarId */}
            {similarId ? <Focus /> : null}
            <Main />
          </div>
        </section>
      </FocusContext.Provider>
    </TopPageLayout>
  );
}

const initialFocusState = {
  loading: false,
  similarData: "",
  similarError: "",
};

function focusReducer(state, { payLoad, label }) {
  if (label === "isError")
    return { ...state, loading: false, similarError: payLoad };
  if (label === "fetched")
    return { ...state, loading: false, similarData: payLoad, similarError: "" };
  if (label === "isLoading")
    return { ...state, loading: true, similarError: "" };
  if (label === "clearSimilar") return { ...state, similarData: "" };
}

const Focus = memo(function Focus() {
  //get the similarId and label from the context
  const { similarId, label } = useContext(FocusContext);

  //get the token from the global context
  const { token } = useContext(UserData);

  //define the states
  const [{ loading, similarData, similarError }, dispatch] = useReducer(
    focusReducer,
    initialFocusState
  );

  //if we are on the track page use the similarSongs function else use the similarArtists function
  const similarFunction = label === "track" ? similarSongs : similarArtists;

  //run the effect only if there is an id
  useEffect(
    function () {
      if (similarId) {
        similarFunction(token, similarId, dispatch);
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
      {!loading && similarData && !similarError ? (
        <>
          <TrackOrArtistImage />
          <Details>
            <Detail />
          </Details>

          <FocusSimilar similarData={similarData} />
        </>
      ) : null}

      {/*when the focus first mounts before the useEffect runs */}
      {!loading && !similarData && !similarError ? (
        <ErrorComponent failure={false} message={"Fetching Data"} />
      ) : null}

      {/*when there is an error */}
      {!loading && similarError ? (
        <ErrorComponent
          message={similarError}
          onClickFn={() => similarFunction(token, similarId, dispatch)}
        />
      ) : null}
    </div>
  );
});

function TrackOrArtistImage() {
  const { focusItem: item } = useContext(FocusContext);

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
  //get the label and clicked item from context
  const { label, focusItem: item } = useContext(FocusContext);

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

const FocusSimilar = memo(function FocusSimilar({ similarData }) {
  const { label } = useContext(FocusContext);

  return (
    <div className={styles.focusSimilar}>
      <p className={styles.focusLabel}>
        Similar <span>{label}s</span>
      </p>

      <SimilarTracksOrArtistsContainer similarData={similarData} />
    </div>
  );
});

function SimilarTracksOrArtistsContainer({ similarData }) {
  const { label } = useContext(FocusContext);

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
  //get the data to be used from the global app context
  const { tracksData, artistsData } = useContext(UserData);

  //get the label passed down from the Top20context
  const { label } = useContext(FocusContext);

  //if we clicked the see more button from the top tracks page, get the top tracks array else, get the top artists array
  const top20Data = label === "track" ? tracksData.items : artistsData.items;

  return (
    //we pass only 4 array items each since we have 5 columns
    <div className={styles.top20Main}>
      <Cols data={top20Data.slice(0, 4)} iterator={1} />

      <Cols data={top20Data.slice(4, 8)} border={true} iterator={5} />

      <Cols data={top20Data.slice(8, 12)} iterator={9} />

      <Cols data={top20Data.slice(12, 16)} border={true} iterator={13} />

      <Cols data={top20Data.slice(16, 20)} iterator={17} />
    </div>
  );
});

function Cols({ data, iterator, border = false }) {
  const colRef = useRef(null);

  useEffect(function () {
    //show the focus section
    const timeline = gsap.timeline({ defaults: { duration: 1 } });

    timeline.to(colRef.current.childNodes, { opacity: 1, stagger: 0.65 });
  }, []);

  return (
    //cols with a border receive a special style
    <div
      ref={colRef}
      className={`${styles.col} ${border ? styles.bordered : ""}`}
    >
      {/* here the index(i) starts from 0,  we add the iterator to the index to continue from where we stopped in our labeling */}
      {data.map((info, i) => (
        <Item key={i} info={info} index={i + iterator} />
      ))}
    </div>
  );
}

const Item = memo(function Item({ info, index }) {
  const { setSearchParams, setFocusClickedItem, focusItem } =
    useContext(FocusContext);

  //when the user clicks an item, set the focusClicked state to the track/artist data we clicked & add the id of that track/artist to the search params
  function triggerFocus(e, id, info) {
    e.stopPropagation();
    //if the current focus item is the same as the one that was clicked, remove the focusItem and remove the searchParams
    focusItem === info ? setFocusClickedItem("") : setFocusClickedItem(info);
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
  const { label } = useContext(FocusContext);
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
  const { label } = useContext(FocusContext);
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
