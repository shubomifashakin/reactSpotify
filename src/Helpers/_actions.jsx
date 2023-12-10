import * as HELPERS from "./_helpers";

export async function similarArtists(token, id) {
  try {
    const result = await fetch(
      `https://api.spotify.com/v1/artists/${id}/related-artists `,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!result.ok) {
      throw new Error(result.status);
    }

    const data = await result.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export async function similarSongs(token, trackId) {
  try {
    let result;
    if (!trackId) {
      //if the user hasnt used spotify in a while, recommend random songs for them to listen to
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
        timer(),
      ]);

      const { genres: allGenres } = await fetchAllGenres.json();

      const arr = [
        Math.trunc(Math.random() * 4) + 1,
        Math.trunc(Math.random() * 3),
      ];
      const genreStart = Math.min(...arr);
      const genreEnd = Math.max(...arr);

      const recommendableGenres = allGenres.slice(genreStart, genreEnd + 1);
      const allGenresString = recommendableGenres.join(",");
      result = await Promise.race([
        fetch(
          `https://api.spotify.com/v1/recommendations?seed_genres=${allGenresString}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
        timer(),
      ]);
    } else {
      result = await Promise.race([
        fetch(
          `https://api.spotify.com/v1/recommendations?seed_tracks=${trackId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
        timer(),
      ]);
    }

    if (!result.ok) {
      throw new Error(result.status);
    }

    const data = await result.json();
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getData(token, dispatch) {
  try {
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

    //send the token to the context provider state
    dispatch({ label: "gotToken", payLoad: access_token });
  } catch (err) {
    //send the error to the error to the state and show the error section in landing page
    dispatch({ label: "tokenError", payLoad: err.message });
  }
}
