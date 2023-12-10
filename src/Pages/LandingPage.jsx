import { useContext, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Spinner from "../components/Spinner";
import { UserData } from "../components/ContextProvider";
import styles from "../CssModules/landingpage.module.css";
import { getData, getToken } from "../Helpers/_actions";

import gsap from "gsap";
import BackToLogIn from "../components/ReloadPage";

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

  //receive the params to be sent from the url
  const [searchParams, setSearchParams] = useSearchParams();

  //fetch the token
  useEffect(
    function () {
      //only run the effect if there is no token
      if (!token) {
        getToken(dispatch, searchParams);
      }
    },
    [searchParams, dispatch, token]
  );

  //fetch the user profile, top tracks and artists
  useEffect(
    function () {
      //only run the effect if there is a token
      if (token) {
        getData(token, dispatch);
      }
    },
    [token, dispatch]
  );

  return (
    <>
      {/* if it is loading */}
      {loading && !token ? <Spinner /> : null}
      {token && tokenError ? <Page profile={profileData} /> : null}

      {/* there is a token and no error */}
      {token && !dataError && !tokenError ? (
        <Page profile={profileData} />
      ) : null}

      {/*if there is an error from the token fetch or data fetch */}
      {(tokenError && !token) || dataError ? (
        <BackToLogIn error={tokenError || dataError} />
      ) : null}
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
