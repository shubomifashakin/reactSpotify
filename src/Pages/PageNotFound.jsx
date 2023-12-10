import { useRef } from "react";
import styles from "../CssModules/PageNotFound.module.css";

import LottieAnimation from "../assets/Animation - 1702187590406.json";
import Lottie from "lottie-react";

function PageNotFound() {
  const lottieRef = useRef(null);

  return (
    <section className={styles.container}>
      <Lottie
        animationData={LottieAnimation}
        loop={true}
        renderer="svg"
        autoplay={true}
        lottieRef={lottieRef}
        onMouseEnter={() => lottieRef.current.pause()}
        onMouseLeave={() => lottieRef.current.goToAndPlay(0, false)}
      />
    </section>
  );
}

export default PageNotFound;
