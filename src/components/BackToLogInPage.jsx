import { Link } from "react-router-dom";

import Lottie from "lottie-react";
import LottieAnimation from "../assets/errorLottiee.json";

import styles from "../CssModules/BackToLogInPage.module.css";

export function BackToLogIn({ errorMessage }) {
  return (
    <div className={styles.backToLogin}>
      <Lottie
        className={styles.animContainer}
        animationData={LottieAnimation}
        loop={true}
        renderer="svg"
        autoplay={true}
      />
      <h2 className={styles.header}>{errorMessage}</h2>
      <Link to={"/"} className={styles.logInLink}>
        Try Logging In Again
      </Link>
    </div>
  );
}
