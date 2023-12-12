import { useContext } from "react";
import { Outlet } from "react-router-dom";

import { UserData } from "../components/ContextProvider";
import Recommendations from "../components/Recommendations";

export function TopPage({ label }) {
  const { tracksData, artistsData } = useContext(UserData);

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
