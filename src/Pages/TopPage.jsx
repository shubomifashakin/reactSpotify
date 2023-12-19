import { Outlet } from "react-router-dom";
import Recommendations from "../components/Recommendations";
import { dataStore } from "../Stores/DataStore";

export function TopPage({ label }) {
  const tracksData = dataStore(function (state) {
    return state.tracksData;
  });

  const artistsData = dataStore(function (state) {
    return state.artistsData;
  });

  return (
    <>
      {/* if there are 20 0r more tracks/artists when the user comes to this page show them the info */}
      {/* if there aren't show the recommendations page */}
      {(label === "track" && tracksData.items.length >= 20) ||
      (label === "artist" && artistsData.items.length >= 20) ? (
        <>
          <Outlet />
        </>
      ) : (
        <Recommendations />
      )}
    </>
  );
}
