import * as HELPERS from "./_helpers";

export async function getToken(dispatch, searchParams) {
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

    //save the token and the time we got it in the local storage
    localStorage.setItem("token", access_token);
    localStorage.setItem("timeReceivedToken", Date.now());

    //send the token to the context provider state
    dispatch({ label: "gotToken", payLoad: access_token });
  } catch (err) {
    //send the error to the error to the state and show the error section in landing page
    dispatch({ label: "tokenError", payLoad: err.message });
  }
}

export async function similarArtists(token, id, dispatch) {
  try {
    dispatch({ label: "isLoading" });
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
    dispatch({ label: "fetched", payLoad: data });
  } catch (err) {
    dispatch({ label: "isError", payLoad: err.message });
  }
}

export async function similarSongs(token, trackId, dispatch) {
  try {
    dispatch({ label: "isLoading" });
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
    dispatch({ label: "fetched", payLoad: data });
  } catch (err) {
    dispatch({ label: "isError", payLoad: err.message });
  }
}
//fetches the recommened tracks
export async function getSimilarForRecommendedPage(dispatch, token) {
  try {
    dispatch({ label: "isLoading" });
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

    dispatch({
      label: "fetched",
      payLoad: recommendedTracks.tracks.slice(0, 10),
    });
  } catch (err) {
    dispatch({ label: "isError", payLoad: err.message });
  }
}

export async function getProfileTopTracksAndArtists(token, dispatch) {
  try {
    dispatch({ label: "isLoading" });
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
    dispatch({
      label: "fetchedUserData",
      payLoad: { artistsData, tracksData, profileData },
    });
  } catch (err) {
    dispatch({ label: "dataError", payLoad: err.message });
  }
}
