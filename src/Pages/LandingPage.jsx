import { useContext, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { getToken, getProfileTopTracksAndArtists } from "../Helpers/_actions";

import { Spinner } from "../components/Spinner";
import { UserData } from "../components/ContextProvider";
import { BackToLogIn } from "../components/BackToLogInPage";

import styles from "../CssModules/LandingPage.module.css";
import gsap from "gsap";

function LandingPage() {
  //receive the profile data from the context
  const {
    token,
    tokenError,
    loading,
    profileData,
    dispatch,
    error: dataError,
  } = useContext(UserData);

  //gets the params needed to be sent from the url
  const [searchParams, setSearchParams] = useSearchParams();

  //fetches the token if we do not have a token
  useEffect(
    function () {
      //only run the effect if there is no token
      if (!token) {
        getToken(dispatch, searchParams);
      }
    },
    [searchParams, dispatch, token]
  );

  //fetches the user profile, top tracks and artists if there is a token
  useEffect(
    function () {
      //only run the effect if there is a token
      if (token) {
        getProfileTopTracksAndArtists(token, dispatch);
      }
    },
    [token, dispatch]
  );

  return (
    <>
      {/* keep showing the spinner as long as the data is being fetched*/}
      {loading && Object.keys(profileData).length <= 0 ? <Spinner /> : null}

      {/*if we have fetched the data and there is no error*/}
      {!loading &&
      Object.keys(profileData).length > 0 &&
      !dataError &&
      !tokenError ? (
        <Page profile={profileData} />
      ) : null}

      {/*if we have fetched the data and there is still an error for some reason, show the user interface*/}
      {tokenError && Object.keys(profileData).length > 0 ? (
        <Page profile={profileData} />
      ) : null}

      {/*if there is an error and there is no token, or  there is an error from the data fetch */}
      {(tokenError && !token) || dataError ? (
        <BackToLogIn errorMessage={tokenError || dataError} />
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
