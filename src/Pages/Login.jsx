import * as HELPERS from "../Helpers/_helpers";
import * as AUTH from "../Helpers/_auth";
import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserData } from "../components/ContextProvider";
import { Button } from "../components/Button";

import styles from "../CssModules/LogInPage.module.css";

function Login() {
  //gets the dispatch function from the global context
  const { dispatch } = useContext(UserData);

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

        //tell the context that we have been authorized and logged in
        dispatch({ label: "authorized" });

        //insert the search params into the code so they can be accessed in the landing page
        navigate(
          `landing?code=${code}&client_id=${HELPERS.clientId}&grant_type=authorization_code&redirect_uri=https://545listeningstatistics.netlify.app/&code_verifier=${verifier}`
        );
      }
    },
    [code, navigate, dispatch]
  );

  //if the user visits the logIn page and there is a token in the local storage that has not expired, then the user is still authorized
  useEffect(
    function () {
      if (loggedBeforeToken && !hasTokenExpired) {
        //autorize user
        dispatch({ label: "authorized" });
        //send the token
        dispatch({ label: "gotToken", payLoad: loggedBeforeToken });

        //go to the landing page
        navigate(`landing`);
      }
    },
    [hasTokenExpired, dispatch, navigate, loggedBeforeToken]
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
