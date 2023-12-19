import { create } from "zustand";

import * as HELPERS from "../Helpers/_helpers";

const initialState = {
  similarId: "",
  label: "",
  focusItem: {},
  loading: false,
  error: "",
  similarData: {},
};

export const focusStore = create(function (set) {
  return {
    ...initialState,

    setFocusItem: function (focusItem) {
      set({ focusItem });
    },

    setLabel: function (label) {
      set({ label });
    },

    setSimilarId: function (similarId) {
      set({ similarId });
    },

    getSimilarSongs: async function (token, trackId) {
      try {
        set({ loading: true, error: "" });
        const request = await Promise.race([
          fetch(
            `https://api.spotify.com/v1/recommendations?seed_tracks=${trackId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
          HELPERS.timer(),
        ]);

        if (!request.ok) {
          throw new Error(`An error occurred ${request.status}`);
        }

        const data = await request.json();
        set({ loading: false, similarData: data, error: "" });
      } catch (err) {
        set({ error: err.message, loading: false });
      }
    },

    getSimilarArtists: async function (token, id) {
      try {
        set({ loading: true, error: "" });
        const request = await Promise.race([
          fetch(`https://api.spotify.com/v1/artists/${id}/related-artists `, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          HELPERS.timer(),
        ]);

        if (!request.ok) {
          throw new Error(request.status);
        }

        const data = await request.json();
        set({ loading: false, similarData: data, error: "" });
      } catch (err) {
        set({ loading: false, error: err.message });
      }
    },

    resetSimilarData: function () {
      set({ similarData: {} });
    },
  };
});
