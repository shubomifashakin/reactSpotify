import Footer from "./Footer";
import Navbar from "./Navbar";

import styles from "../CssModules/TopContainer.module.css";

export function TopPageLayout({ label, children }) {
  return (
    <>
      <Navbar label={label} />
      <section className={styles.topContainer}>{children}</section>
      <Footer />
    </>
  );
}
