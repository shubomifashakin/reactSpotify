import * as HELPERS from "../Helpers/_helpers";
import * as AUTH from "../Helpers/_auth";

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { authStore } from "../Stores/AuthStore";

import { Button } from "../components/Button";

import styles from "./LogInPage.module.css";

function Login() {
  const authorizeUser = authStore(function (state) {
    return state.authorizeUser;
  });

  const setToken = authStore(function (state) {
    return state.setToken;
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const code = searchParams.get("code");
  const navigate = useNavigate();

  //gets the token and the time we got the token, from the local storage
  const loggedBeforeToken = localStorage.getItem("token");
  const timeReceivedToken = localStorage.getItem("timeReceivedToken");

  //checks if the token has been there for more than 35minutes
  const hasTokenExpired =
    Date.now() > Number(timeReceivedToken) + 35 * 60 * 1000;

  function GoToAUTH() {
    AUTH.redirectToAuthCodeFlow(HELPERS.clientId);
  }

  //it only runs if there is a code parameter in the url
  useEffect(
    //if the user was authorized when redirected, go to the intro page
    function () {
      if (code) {
        //get the verifier set by spotify from our local storage
        const verifier = localStorage.getItem("verifier");

        //change the authorized state in the AuthStore to true
        authorizeUser();

        //insert the search params into the code so they can be accessed in the landing page
        navigate(
          `landing?code=${code}&client_id=${HELPERS.clientId}&grant_type=authorization_code&redirect_uri=http://localhost:5173/&code_verifier=${verifier}`
        );
      }
    },
    [code, navigate, authorizeUser]
  );

  //if the user visits the logIn page and there is a token in the local storage that has not expired, then the user is still authorized
  useEffect(
    function () {
      if (loggedBeforeToken && !hasTokenExpired) {
        //change the authorized state in the authstore to true
        authorizeUser();

        //set the token in the AuthStore
        setToken(loggedBeforeToken);

        //go to the landing page
        navigate(`landing`);
      }
    },
    [hasTokenExpired, setToken, navigate, loggedBeforeToken, authorizeUser]
  );

  return (
    <section className={styles.logInSection}>
      <h2>What have you been listening to?</h2>
      <p>Let&apos;s find out!</p>
      <Button onClickFn={() => GoToAUTH()}>
        Log in <i className="fa-brands fa-spotify spotify-icon"></i>
      </Button>
    </section>
  );
}

export default Login;
