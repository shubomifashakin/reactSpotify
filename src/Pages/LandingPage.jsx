import { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { Spinner } from "../components/Spinner";
import { BackToLogIn } from "../components/BackToLogInPage";

import { authStore } from "../Stores/AuthStore";
import { dataStore } from "../Stores/DataStore";

import styles from "./LandingPage.module.css";
import gsap from "gsap";

function LandingPage() {
  const {
    fetchToken,
    token,
    error: tokenError,
    loading: loadingToken,
  } = authStore(function (state) {
    return state;
  });

  const {
    error: dataError,
    fetchData,
    profileData,
    loading: loadingData,
  } = dataStore(function (state) {
    return state;
  });

  //gets the params needed to be sent from the url
  const [searchParams, setSearchParams] = useSearchParams();

  //fetches the token if we do not have a token
  useEffect(
    function () {
      //only run the effect if there is no token
      if (!token) {
        fetchToken(searchParams);
      }
    },
    [searchParams, fetchToken, token]
  );

  //fetches the user profile, top tracks and artists if there is a token
  useEffect(
    function () {
      //only run the effect if there is a token
      if (token) {
        fetchData(token);
      }
    },
    [token, fetchData]
  );

  return (
    <>
      {/* show the spinner as long as the data or token is being fetched*/}
      {loadingToken || loadingData ? <Spinner /> : null}

      {/* if we have fetched the data and there is no error */}
      {!loadingToken &&
      !loadingData &&
      Object.keys(profileData).length > 0 &&
      !dataError &&
      !tokenError ? (
        <Page profile={profileData} />
      ) : null}

      {/*if we have fetched the data and there is still an error for some reason, ignore the error and use the data fetched */}
      {!loadingToken &&
      !loadingData &&
      Object.keys(profileData).length > 0 &&
      tokenError ? (
        <Page profile={profileData} />
      ) : null}

      {/* if there is an error, there is no token and the data has not been fetched or there is an error from the data fetch */}
      {(tokenError && !token && Object.keys(profileData).length <= 0) ||
      dataError ? (
        <BackToLogIn errorMessage={tokenError || dataError} />
      ) : null}

      {/*when the component first mounts before useeffect is run*/}
      {!loadingData &&
      !tokenError &&
      !loadingToken &&
      !dataError &&
      Object.keys(profileData).length <= 0 ? (
        <p>Please Wait...</p>
      ) : null}
    </>
  );
}

function Page({ profile }) {
  const sectionRef = useRef(null);
  const sectionHeadRef = useRef(null);
  const sectionLeadRef = useRef(null);
  const sectionBtnsRef = useRef(null);

  let timeline = gsap.timeline({ defaults: { duration: 0.5 } });

  useEffect(
    function () {
      timeline
        .to(sectionRef.current, { display: "flex", opacity: 1, delay: 1 })
        .to(sectionHeadRef.current, { opacity: 1 })
        .to(sectionLeadRef.current, { opacity: 1 })
        .to(sectionBtnsRef.current, { opacity: 1 });
    },
    [timeline]
  );

  return (
    <section className={styles.intro} ref={sectionRef}>
      <h1 ref={sectionHeadRef} className={styles.introHead}>
        Welcome, <span className="intro-username">{profile.display_name}</span>!
      </h1>
      <p ref={sectionLeadRef} className={styles.introLead}>
        Who and What have you been listening to this Month?
      </p>

      <div ref={sectionBtnsRef} className={styles.introBtns}>
        <Link className={`${styles.introBtn1}  btn-1`} to={"/tracksData"}>
          See Top Tracks
        </Link>

        <Link className={`${styles.introBtn1}  btn-1`} to={"/artistsData"}>
          See Top Artists
        </Link>
      </div>
    </section>
  );
}

export default LandingPage;
