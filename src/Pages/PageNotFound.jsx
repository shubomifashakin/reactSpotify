import Lottie from "lottie-react";
import LottieAnimation from "../assets/errorConnection.json";
import { Link } from "react-router-dom";

import styles from "./PageNotFound.module.css";

function PageNotFound() {
  return (
    <section className={styles.container}>
      <Lottie
        className={styles.animContainer}
        animationData={LottieAnimation}
        loop={true}
        renderer="svg"
        autoplay={true}
      />
      <Link to={"/"} className={styles.logInLink}>
        Please Go Back!
      </Link>
    </section>
  );
}

export default PageNotFound;
