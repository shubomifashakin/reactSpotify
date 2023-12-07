import { Link } from "react-router-dom";
import styles from "../CssModules/landingpage.module.css";
import { clientId } from "../Helpers/_helpers";
import * as HELPERS from "../Helpers/_helpers";
import { useToken } from "../Helpers/_auth";
import Spinner from "../components/Spinner";
import { useContext, useEffect, useRef } from "react";
import { UserData } from "../components/ContextProvider";
import Error from "../components/Error";

import gsap from "gsap";

function LandingPage() {
  //fetches the token
  useToken(clientId, HELPERS.code);

  //receive the profile data from the context
  const {
    token,
    tokenError,
    loading,
    profileData,
    dispatch,
    error: dataError,
  } = useContext(UserData);

  //fetch the user profile, top tracks and artists
  useEffect(
    function () {
      async function getData() {
        try {
          const [profile, tracks, artists] = await Promise.all([
            fetch("https://api.spotify.com/v1/me", {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(
              `https://api.spotify.com/v1/me/top/tracks?time_range=${HELPERS.timeFrame}&limit=${HELPERS.dataLimit}&offset=0`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),
            fetch(
              `https://api.spotify.com/v1/me/top/artists?time_range=${HELPERS.timeFrame}&limit=${HELPERS.dataLimit}&offset=0`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),
          ]);

          if (!profile.ok) {
            throw new Error(`An error occurred, please ${profile.status}`);
          }
          if (!tracks.ok) {
            throw new Error(`An error occurred, please ${tracks.status}`);
          }
          if (!artists.ok) {
            throw new Error(`An error occurred, please ${artists.status}`);
          }

          const profileData = await profile.json();
          const tracksData = await tracks.json();
          const artistsData = await artists.json();

          //send the data fetched to the context
          dispatch({
            label: "fetchedUserData",
            payLoad: { artistsData, tracksData, profileData },
          });
        } catch (err) {
          dispatch({ label: "dataError", payLoad: err.message });
        }
      }

      //only run the effect if there is a token
      if (token) {
        getData();
      }
    },
    [token, dispatch]
  );

  return (
    <>
      {loading && !token ? <Spinner /> : null}
      {token && !loading && !tokenError && !dataError ? (
        <Page profile={profileData} />
      ) : null}

      {/*if there is an error from the token fetch or data fetch */}
      {tokenError || dataError ? <p>Error {tokenError || dataError}</p> : null}
    </>
  );
}

function Page({ profile }) {
  const sectionRef = useRef(null);
  const sectionHeadRef = useRef(null);
  const sectionLeadRef = useRef(null);
  const sectionBtnsRef = useRef(null);

  useEffect(function () {
    const timeline = gsap.timeline({ defaults: { duration: 1 } });

    timeline
      .to(sectionRef.current, { display: "flex", opacity: 1, delay: 1 })
      .to(sectionHeadRef.current, { opacity: 1 })
      .to(sectionLeadRef.current, { opacity: 1 })
      .to(sectionBtnsRef.current, { opacity: 1 });
  }, []);

  return (
    <section className={styles.intro} ref={sectionRef}>
      <h1 ref={sectionHeadRef} className={styles.introHead}>
        Welcome, <span className="intro-username">{profile.display_name}</span>!
      </h1>
      <p ref={sectionLeadRef} className={styles.introLead}>
        Who and What have you been listening to this Month?
      </p>

      <div ref={sectionBtnsRef} className={styles.introBtns}>
        <Link
          className={`${styles.introBtn} ${styles.introBtn1} btn-1`}
          to={"/tracks"}
        >
          See Top Tracks
        </Link>

        <Link
          className={`${styles.introBtn} ${styles.introBtn2} btn-1`}
          to={"/artists"}
        >
          See Top Artists
        </Link>
      </div>
    </section>
  );
}
export default LandingPage;
