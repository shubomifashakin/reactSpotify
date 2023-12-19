import { create } from "zustand";

import * as HELPERS from "../Helpers/_helpers";

const initialState = {
  tracksData: {},
  profileData: {},
  artistsData: {},
  loading: false,
  error: "",
};

export const dataStore = create(function (set) {
  return {
    ...initialState,

    fetchData: async function (token) {
      try {
        //set the loading state to true the landing page would re-render and start showing the spinner component
        set({ loading: true, error: "" });

        const [profile, tracks, artists] = await Promise.all([
          fetch("https://api.spotify.com/v1/me", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(
            `https://api.spotify.com/v1/me/top/tracks?time_range=${HELPERS.timeFrame}&limit=${HELPERS.dataLimit}&offset=0`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
          fetch(
            `https://api.spotify.com/v1/me/top/artists?time_range=${HELPERS.timeFrame}&limit=${HELPERS.dataLimit}&offset=0`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

        if (!profile.ok) {
          throw new Error(`An error occurred, please ${profile.status}`);
        }
        if (!tracks.ok) {
          throw new Error(`An error occurred, please ${tracks.status}`);
        }
        if (!artists.ok) {
          throw new Error(`An error occurred, please ${artists.status}`);
        }

        const profileData = await profile.json();
        const tracksData = await tracks.json();
        const artistsData = await artists.json();

        //send the data fetched to the context
        set({
          artistsData,
          tracksData,
          profileData,
          loading: false,
          error: "",
        });
      } catch (err) {
        //send the error to the error to the state and show the error section in landing page
        set({ error: err.message, loading: false });
      }
    },
  };
});
