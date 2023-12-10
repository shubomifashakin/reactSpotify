import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import styles from "../CssModules/PageNotFound.module.css";

import gsap from "gsap";

import LottieAnimation from "../assets/Animation - 1702187590406.json";
import Lottie from "lottie-react";

function PageNotFound() {
  const lottieRef = useRef(null);
  // const div1Ref = useRef(null);
  // const div2Ref = useRef(null);
  // const innnerDivRef = useRef(null);

  // const boxShadow = `0px 0px 5px 5px var(--dim-primary-color)`;
  // const oldBoxShadow = `0px 0px 10px 5px var(--hover-color)`;
  // const newBorderColor = "var(--primary-color)";
  // const oldBorderColor = `var(--hover-color)`;

  // const timeLine = gsap.timeline({
  //   repeat: -1,
  //   defaults: {
  //     duration: 1,
  //     ease: "elastic.inOut",
  //   },
  // });

  // useEffect(
  //   function () {
  //     timeLine
  //       .to(div1Ref.current, {
  //         scale: 0.75,
  //         borderWidth: "5px",
  //         borderColor: newBorderColor,
  //         boxShadow: boxShadow,
  //       })
  //       .to(
  //         div2Ref.current,
  //         {
  //           scale: 1.25,
  //           borderWidth: "5px",
  //           borderColor: newBorderColor,
  //           boxShadow: boxShadow,
  //         },
  //         "<"
  //       )
  //       .to(
  //         innnerDivRef.current,
  //         {
  //           scale: 2.5,
  //           borderWidth: "5px",
  //           borderColor: newBorderColor,
  //           boxShadow: boxShadow,
  //         },
  //         "<"
  //       )
  //       .to(div1Ref.current, {
  //         scale: 1,
  //         borderWidth: "7px",
  //         borderColor: oldBorderColor,
  //         boxShadow: oldBoxShadow,
  //       })
  //       .to(
  //         div2Ref.current,
  //         {
  //           scale: 1,
  //           borderWidth: "7px",
  //           borderColor: oldBorderColor,
  //           boxShadow: oldBoxShadow,
  //         },
  //         "<"
  //       )
  //       .to(
  //         innnerDivRef.current,
  //         {
  //           scale: 1,
  //           borderWidth: "7px",
  //           borderColor: oldBorderColor,
  //           boxShadow: oldBoxShadow,
  //         },
  //         "<"
  //       );
  //   },
  //   [oldBoxShadow, boxShadow, oldBorderColor, newBorderColor]
  // );
  return (
    <section className={styles.container}>
      {/* <Link
        to={"/"}
        onMouseEnter={() => timeLine.pause()}
        onMouseLeave={() => timeLine.play()}
      >
        <div ref={div1Ref} className={styles.div1}></div>
        <div ref={div2Ref} className={styles.div2}></div>
        <div className={styles.innerDiv} ref={innnerDivRef}>
          <p> Page Not Found!</p>
          <p>Click to Go Back</p>
        </div>
      </Link> */}
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
