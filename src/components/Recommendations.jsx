import { Link } from "react-router-dom";
import { useContext, useEffect, useReducer } from "react";
import { UserData } from "./ContextProvider";
import { Spinner } from "./Spinner";
import { ErrorComponent } from "./Error";
import { getSimilarForRecommendedPage } from "../Helpers/_actions";

import styles from "./Recommendations.module.css";

const initialRecommendedState = {
  loading: false,
  error: "",
  recommendedTracks: "",
};

function recommendationsReducer(state, { label, payLoad }) {
  if (label === "isLoading") return { ...state, loading: true, error: "" };
  if (label === "fetched")
    return { ...state, loading: false, recommendedTracks: payLoad };
  if (label === "isError") return { ...state, loading: false, error: payLoad };
}

function Recommendations() {
  const [{ loading, error, recommendedTracks }, dispatch] = useReducer(
    recommendationsReducer,
    initialRecommendedState
  );

  const { token } = useContext(UserData);

  useEffect(
    function () {
      //only fetch the recommended tracks if there is a token
      if (token) getSimilarForRecommendedPage(dispatch, token);
    },
    [token]
  );

  return (
    <>
      {/*if we are still fetching the recommended tracks */}
      {loading ? <Spinner /> : null}

      {/*we have finished fetching the recommended tracks */}
      {!loading && recommendedTracks.length > 0 && !error ? (
        <Recommend tracks={recommendedTracks} />
      ) : null}

      {/*if there was an error with the fetch */}
      {!loading && error ? (
        <ErrorComponent
          message={error}
          onClickFn={() => getSimilarForRecommendedPage(dispatch, token)}
        ></ErrorComponent>
      ) : null}
    </>
  );
}

function Recommend({ tracks }) {
  return (
    <section className={`${styles.errorSection}`}>
      <h2 className={`${styles.errorMessage}`}>
        Oops! You Haven&apos;t Been Very Active.
      </h2>
      <div className={`${styles.errorRecommendations}`}>
        <h2 className={`${styles.recommendationsHeader}`}>
          Here are some songs you might like!
        </h2>

        <div className={`${styles.innerRecommendations}`}>
          <span className={`${styles.recommendations}`}>
            {tracks.map((track, i) => (
              <Track track={track} key={i} />
            ))}
          </span>
        </div>
      </div>
      <Link className={`${styles.errorReturn}`} to={"/landing"}>
        Listen to some music and check back after some time.
      </Link>
    </section>
  );
}

function Track({ track }) {
  return (
    <a href={track.external_urls.spotify} className={styles.recImageLink}>
      <img
        src={track?.images ? track.images[0].url : track.album.images[0].url}
        className={styles.recommendationsImage}
      />
    </a>
  );
}
export default Recommendations;
