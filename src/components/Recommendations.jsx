import { Link } from "react-router-dom";
import styles from "../CssModules/recommendations.module.css";
import { useContext, useEffect, useState } from "react";
import { UserData } from "./ContextProvider";
import * as HELPERS from "../Helpers/_helpers";
import Spinner from "./Spinner";

function Recommendations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const { token } = useContext(UserData);

  useEffect(
    function () {
      async function GetSimilar() {
        try {
          setLoading(true);
          //fetch all the available genres on spotify
          const fetchAllGenres = await Promise.race([
            fetch(
              `https://api.spotify.com/v1/recommendations/available-genre-seeds`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),
            HELPERS.timer(),
          ]);

          if (!fetchAllGenres.ok) {
            throw new Error(`An error occurred ${fetchAllGenres.status}`);
          }

          const { genres: allGenres } = await fetchAllGenres.json();

          const arr = [
            Math.trunc(Math.random() * 10),
            Math.trunc(Math.random() * 15),
          ];
          let genreStart = Math.min(...arr);
          let genreEnd = Math.max(...arr);

          //spotify only lets us request data for 5 genres,
          //if the genres generated are more than 5, set it to only 5
          const difference = genreEnd - genreStart;
          if (difference > 5) {
            genreStart = 0;
            genreEnd = 5;
          }
          const recommendableGenres = allGenres.slice(genreStart, genreEnd);
          const allGenresString = recommendableGenres.join(",");

          //after getting all the genres, fetch random songs from that genre
          const recommendReq = await Promise.race([
            fetch(
              `https://api.spotify.com/v1/recommendations?seed_genres=${allGenresString}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),
            HELPERS.timer(),
          ]);

          if (!recommendReq.ok) {
            throw new Error(`An error occurred ${recommendReq.status}`);
          }

          const recommendedTracks = await recommendReq.json();
          setRecommendedTracks(recommendedTracks.tracks.slice(0, 10));
          setLoading(false);
        } catch (err) {
          setError(err);
        }
      }

      GetSimilar();
    },
    [token]
  );
  return (
    <>
      {loading ? <Spinner /> : null}
      {!loading && recommendedTracks.length > 0 ? (
        <Recommend tracks={recommendedTracks} />
      ) : null}
      {!loading && error ? <p>An error occurred</p> : null}
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
        src={track.images ? track?.images[0].url : track.album.images[0].url}
        className={styles.recommendationsImage}
      />
    </a>
  );
}
export default Recommendations;
