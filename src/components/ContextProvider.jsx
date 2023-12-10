import { createContext, useReducer } from "react";

export const UserData = createContext(null);

const initialState = {
  tracksData: {},
  profileData: {},
  artistsData: {},
  error: "",
  loggedIn: false,
  token: "",
  loading: false,
  tokenError: "",
};

function reducer(state, { label, payLoad }) {
  if (label === "fetchedUserData") {
    return {
      ...state,
      tracksData: payLoad.tracksData,
      artistsData: payLoad.artistsData,
      profileData: payLoad.profileData,
    };
  }
  if (label === "dataError") {
    return { ...state, error: payLoad };
  }
  if (label === "logOut") return initialState;

  if (label === "loggedIn") return { ...state, loggedIn: true };

  if (label === "isLoading") return { ...state, loading: true };

  if (label === "gotToken")
    return {
      ...state,
      loading: false,
      token: payLoad,
      error: "",
      tokenError: "",
    };
  if (label === "tokenError")
    return { ...state, loading: false, tokenError: payLoad };
}

function ContextProvider({ children }) {
  const [
    {
      tracksData,
      profileData,
      artistsData,
      error,
      loggedIn,
      token,
      tokenError,
      loading,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  return (
    <UserData.Provider
      value={{
        tracksData,
        profileData,
        artistsData,
        dispatch,
        error,
        loggedIn,
        token,
        tokenError,
        loading,
      }}
    >
      {children}
    </UserData.Provider>
  );
}

export default ContextProvider;
