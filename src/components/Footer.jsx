import { memo } from "react";
import styles from "../CssModules/footer.module.css";
import { useSearchParams } from "react-router-dom";

export const Footer = memo(function Footer() {
  const [searchParams, setSearchParams] = useSearchParams();

  //when anywhere that is not a top item in the section is clicked, the searchParams would clear and the focus container would close
  function clearSearchParams() {
    setSearchParams();
  }
  return (
    <footer className={styles.appFooter} onClick={clearSearchParams}>
      <p className={`${styles.footerText} footer-item`}>by 545Plea</p>
    </footer>
  );
});

export default Footer;
