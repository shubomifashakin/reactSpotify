import { memo } from "react";
import styles from "../CssModules/footer.module.css";

export const Footer = memo(function Footer() {
  return (
    <footer className={styles.appFooter}>
      <p className={`${styles.footerText} footer-item`}>by 545Plea</p>
    </footer>
  );
});

export default Footer;
