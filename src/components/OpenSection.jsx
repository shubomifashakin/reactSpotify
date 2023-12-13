import { useContext, useEffect, useRef } from "react";
import { UserData } from "./ContextProvider";

import styles from "./OpenSection.module.css";

import gsap from "gsap";

export function OpenSection({ label }) {
  const { profileData } = useContext(UserData);
  const sectionRef = useRef(null);
  const header1Ref = useRef(null);
  const header2Ref = useRef(null);
  const header3Ref = useRef(null);

  useEffect(function () {
    const timeline = gsap.timeline({ defaults: { duration: 0.5 } });

    timeline
      .to(header1Ref.current, {
        display: "block",
        opacity: 1,
      })
      .to(header1Ref.current, {
        display: "none",
        opacity: 0,
      })
      .to(header2Ref.current, {
        display: "block",
        opacity: 1,
      })
      .to(header2Ref.current, {
        display: "none",
        opacity: 0,
      })
      .to(header3Ref.current, {
        display: "block",
        opacity: 1,
      })
      .to(header3Ref.current, {
        display: "none",
        opacity: 0,
      })
      .to(sectionRef.current, {
        opacity: 0,
        display: "none",
      });
  }, []);

  return (
    <section ref={sectionRef} className={styles.openSection}>
      <h2 ref={header1Ref}>{profileData.display_name}</h2>
      <h2 ref={header2Ref}>
        Your top <span>{label}s</span>
      </h2>
      <h2 ref={header3Ref}>are</h2>
    </section>
  );
}
