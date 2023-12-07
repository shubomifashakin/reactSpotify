import { useSearchParams } from "react-router-dom";
import * as HELPERS from "./_helpers";
import { useContext, useEffect, useReducer } from "react";
import { UserData } from "../components/ContextProvider";

export async function redirectToAuthCodeFlow(clientId) {
  //this generates a verifier
  const verifier = generateCodeVerifier(128);
  //it generates a challenge
  const challenge = await generateCodeChallenge(verifier);

  //it sets the verifier in our localstorage
  localStorage.setItem("verifier", verifier);

  //we create our search parameters
  const params = new URLSearchParams();
  //add the client id to the search parameters
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", "http://localhost:5173/");
  //these are the scopes we want to access
  params.append(
    "scope",
    "user-read-private user-top-read user-read-currently-playing"
  );
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  // console.log(params);
  //this sets the document url to contain the parameters gotten from the requests and goes to that link
  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;

  //then after we verify the user, it redirects back to our url specified and contains the code we got
}

//this generates a code verifier of the length passed into it
function generateCodeVerifier(length) {
  ///empty string where the code verifier would be stored
  let text = "";
  //string of characters where the code verifier would be selected from
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  //loop through all possible characters 128 times, select a random character from the string and add it to the empty text variable
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  //return the now generated code verifier which would be 128 in length
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  //encodes the code verifier we generated
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  //it returns the challenge
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function useToken(clientId, code) {
  //gets the verifier from the local storage
  const verifier = localStorage.getItem("verifier");
  //gets the token state and dispatch
  const { token, dispatch } = useContext(UserData);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(
    function () {
      //set the search params we are sending
      setSearchParams((prev) => ({
        ...prev,
        client_id: clientId,
        grant_type: "authorization_code",
        code: code,
        code_verifier: verifier,
        redirect_uri: "http://localhost:5173/",
      }));

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

      //only run the effect if there is no token
      if (!token) {
        getData();
      }
    },
    [clientId, searchParams, code, verifier, setSearchParams, dispatch, token]
  );
}
