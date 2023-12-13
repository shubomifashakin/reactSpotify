import { useContext } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { UserData } from "./ContextProvider";

import styles from "./Navbar.module.css";

function Navbar({ label }) {
  const [searchParams, setSearchParams] = useSearchParams();

  //when anywhere that is not a top item in the section is clicked, the searchParams would clear and the focus container would close
  function clearSearchParams(e) {
    setSearchParams();
  }
  return (
    <nav className={styles.navbar} onClick={clearSearchParams}>
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
  //anytime we click a link, we prevent it from bubbling up the tree
  //hereby preventing triggering the onClick function of the entire navbar
  function preventPropagation(e) {
    e.stopPropagation();
  }

  return (
    <div className={`${styles.navLeft} nav-left-${label}`}>
      <span className={styles.navItem}>
        <Link
          onClick={preventPropagation}
          to={label === "track" ? "/tracksData" : "/artistsData"}
          className={`${styles.navLink} nav-left-link`}
        >
          {label === "track" ? "Top Tracks" : "Top Artists"}
        </Link>

        <div className={styles.dropdown}>
          <Link
            onClick={preventPropagation}
            to={label === "track" ? "/artistsData" : "/tracksData"}
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
  const { dispatch, profileData: profile } = useContext(UserData);

  function LogOut() {
    //removes the token details used from the local storage
    localStorage.removeItem("token");
    localStorage.removeItem("timeReceivedToken");

    dispatch({ label: "logOut" });
    navigate("/");
  }

  return (
    <div className={styles.navRight}>
      <span className={`${styles.navItem} ${styles.navUser}`}>
        <p className="nav-username">{profile.display_name.split(" ")[0]}</p>
      </span>

      <span className={`${styles.navItem} ${styles.navBtn}`}>
        <button className={`${styles.navLink} nav-log-out`} onClick={LogOut}>
          Log Out
        </button>
      </span>
    </div>
  );
}
export default Navbar;
