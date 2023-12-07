import styles from "../CssModules/loginpage.module.css";
import * as HELPERS from "../Helpers/_helpers";
import * as AUTH from "../Helpers/_auth";
import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserData } from "../components/ContextProvider";

function Login() {
  const [searchParams, setSearchParams] = useSearchParams();
  const code = searchParams.get("code");
  const navigate = useNavigate();

  const { dispatch } = useContext(UserData);

  function GoToAUTH() {
    AUTH.redirectToAuthCodeFlow(HELPERS.clientId);
  }

  useEffect(
    //if the user was authorized when redirected, go to the intro page
    function () {
      if (code) {
        dispatch({ label: "loggedIn" });
        navigate(`landing?code=${code}`);
      }
    },
    [code, navigate, dispatch]
  );

  return (
    <section className={styles.logInSection}>
      <h2>What have you been listening to?</h2>
      <p>Let&apos;s find out!</p>
      <button
        type="button"
        className={`${styles.logInBtn} btn-1`}
        onClick={GoToAUTH}
      >
        Log in <i className="fa-brands fa-spotify spotify-icon"></i>
      </button>
    </section>
  );
}

export default Login;
