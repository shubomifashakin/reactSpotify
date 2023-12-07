import { useContext } from "react";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import TopContainer from "../components/top";
import OpenSection from "../components/OpenSection";
import { UserData } from "../components/ContextProvider";
import Recommendations from "../components/Recommendations";

import { Top1Section } from "./Top1Section";

function TopPage({ pageLabel }) {
  const { tracksData, artistsData } = useContext(UserData);

  return (
    <>
      {(pageLabel === "track" && tracksData.items.length >= 20) ||
      (pageLabel === "artist" && artistsData.items.length >= 20) ? (
        <Top pageLabel={pageLabel} />
      ) : (
        <Recommendations />
      )}
    </>
  );
}

function Top({ pageLabel }) {
  return (
    <>
      <OpenSection label={pageLabel} />
      <Navbar label={pageLabel} />
      <TopContainer>
        <Top1Section pageLabel={pageLabel} />
        {/**put the outlet here */}
      </TopContainer>
      <Footer />
    </>
  );
}

export default TopPage;
