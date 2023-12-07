import { Link, useNavigate } from "react-router-dom";
import styles from "../CssModules/navbar.module.css";
import { useContext } from "react";
import { UserData } from "./ContextProvider";

function Navbar({ label }) {
  return (
    <nav className={styles.navbar}>
      <Left label={label} />
      <Right />
    </nav>
  );
}

function Left({ label }) {
  return (
    <>
      {label === "track" ? <Item label={"track"} /> : <Item label={"artist"} />}
    </>
  );
}

function Item({ label }) {
  return (
    <div className={`${styles.navLeft} nav-left-${label}`}>
      <span className={styles.navItem}>
        <Link
          to={label === "track" ? "/tracks" : "/artists"}
          className={`${styles.navLink} nav-left-link`}
        >
          {label === "track" ? "Top Tracks" : "Top Artists"}
        </Link>

        <div className={styles.dropdown}>
          <Link
            to={label === "track" ? "/artists" : "/tracks"}
            className={`${styles.dropdownLink} nav-left-link`}
          >
            {label === "track" ? "Top Artist" : "Top Tracks"}
          </Link>
        </div>
      </span>
    </div>
  );
}

function Right() {
  const navigate = useNavigate();
  const { dispatch } = useContext(UserData);
  function LogOut() {
    dispatch({ label: "logOut" });
    navigate("/");
  }

  return (
    <div className={styles.navRight}>
      <span className={`${styles.navItem} ${styles.navUser}`}>
        <p className="nav-username">545plea</p>
      </span>

      <span className={styles.navItem}>
        <button className={`${styles.navLink} nav-log-out`} onClick={LogOut}>
          Log Out
        </button>
      </span>
    </div>
  );
}
export default Navbar;
