import { create } from "zustand";

import * as HELPERS from "../Helpers/_helpers";

const initialState = {
  error: "",
  authorized: false,
  token: "",
  loading: false,
};

export const authStore = create(function (set) {
  return {
    ...initialState,

    setToken: function (token) {
      set({ token, loading: false, error: "" });
    },

    authorizeUser: function () {
      set({ authorized: true });
    },

    fetchToken: async function (searchParams) {
      try {
        //set the loading state to true the landing page would re-render and start showing the spinner component
        set({ loading: true, error: "" });

        //send the data to the api
        const result = await Promise.race([
          fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: searchParams,
          }),
          HELPERS.timer(),
        ]);

        //if there is an error short circuit
        if (!result.ok) {
          throw new Error(`An error occurred ${result.status} token`);
        }

        //the access token is returned from the api
        const { access_token } = await result.json();

        //save the token and the time we got it in the local storage
        localStorage.setItem("token", access_token);
        localStorage.setItem("timeReceivedToken", Date.now());

        //set the token state
        set({ token: access_token, loading: false, error: "" });
      } catch (err) {
        //send the error to the error to the state and show the error section in landing page
        set({ error: err.message, loading: false });
      }
    },
  };
});
