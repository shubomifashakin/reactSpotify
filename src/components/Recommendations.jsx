import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Spinner } from "./Spinner";
import { ErrorComponent } from "./Error";

import { authStore } from "../Stores/AuthStore";
import { recommendationsStore } from "../Stores/RecommendationsStore";

import styles from "./Recommendations.module.css";

function Recommendations() {
  //get the token from the AuthStore
  const token = authStore(function (state) {
    return state.token;
  });

  const loading = recommendationsStore(function (state) {
    return state.loading;
  });

  const error = recommendationsStore(function (state) {
    return state.error;
  });
  //get the token form the AuthStore
  const recommendedTracks = recommendationsStore(function (state) {
    return state.recommendedTracks;
  });

  const fetchRecommended = recommendationsStore(function (state) {
    return state.fetchRecommended;
  });

  useEffect(
    function () {
      //only fetch the recommended tracks if there is a token
      if (token) fetchRecommended(token);
    },
    [token, fetchRecommended]
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
          onClickFn={() => fetchRecommended(token)}
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
