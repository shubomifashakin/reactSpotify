import { Link } from "react-router-dom";
import styles from "../CssModules/ReloadPage.module.css";

function BackToLogIn({ error }) {
  return (
    <div className={styles.BackToLogIn}>
      <h2 className={styles.header}>{error}</h2>
      <Link to={"/"} className={styles.logInLink}>
        Try Logging In Again
      </Link>
    </div>
  );
}

export default BackToLogIn;
