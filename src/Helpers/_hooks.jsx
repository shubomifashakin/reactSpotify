import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import * as HELPERS from "../Helpers/_helpers";

export function useToken(dispatch) {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(
    function () {
      async function getData() {
        try {
          //when dispatched, the landing page would re-render and start showing the spinner component
          dispatch({ label: "isLoading" });
          //send the data to the api
          const result = await Promise.race([
            fetch("https://accounts.spotify.com/api/token", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: searchParams,
            }),
            HELPERS.timer(),
          ]);

          console.log(result.ok);
          //if there is an error short circuit
          if (!result.ok) {
            throw new Error(`An error occurred ${result.status} token`);
          }

          //the access token is returned from the api
          const { access_token } = await result.json();

          //send the token to the context provider state
          dispatch({ label: "gotToken", payLoad: access_token });
        } catch (err) {
          //send the error to the error to the state and show the error section in landing page
          dispatch({ label: "isError", payLoad: err.message });
        }
      }

      getData();
    },
    [searchParams, dispatch]
  );
}
