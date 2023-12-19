import { create } from "zustand";

import * as HELPERS from "../Helpers/_helpers";

const initialState = {
  error: "",
  recommendedTracks: {},
  loading: false,
};

export const recommendationsStore = create(function (set) {
  return {
    ...initialState,

    fetchRecommended: async function (token) {
      try {
        set({ loading: true, error: "" });
        //fetch all the available genres on spotify
        const fetchAllGenres = await Promise.race([
          fetch(
            `https://api.spotify.com/v1/recommendations/available-genre-seeds`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
          HELPERS.timer(),
        ]);

        if (!fetchAllGenres.ok) {
          throw new Error(`An error occurred ${fetchAllGenres.status}`);
        }

        const { genres: allGenres } = await fetchAllGenres.json();

        const arr = [
          Math.trunc(Math.random() * 10),
          Math.trunc(Math.random() * 15),
        ];
        let genreStart = Math.min(...arr);
        let genreEnd = Math.max(...arr);

        //spotify only lets us request data for 5 genres,
        //if the genres generated are more than 5, set it to only 5
        const difference = genreEnd - genreStart;
        if (difference > 5) {
          genreStart = 0;
          genreEnd = 5;
        }
        const recommendableGenres = allGenres.slice(genreStart, genreEnd);
        const allGenresString = recommendableGenres.join(",");

        //after getting all the genres, fetch random songs from that genre
        const recommendReq = await Promise.race([
          fetch(
            `https://api.spotify.com/v1/recommendations?seed_genres=${allGenresString}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
          HELPERS.timer(),
        ]);

        if (!recommendReq.ok) {
          throw new Error(`An error occurred ${recommendReq.status}`);
        }

        const recommendedTracks = await recommendReq.json();

        set({
          loading: false,
          recommendedTracks: recommendedTracks.tracks.slice(0, 10),
          error: "",
        });
      } catch (err) {
        set({ error: err.message, loading: false });
      }
    },
  };
});
