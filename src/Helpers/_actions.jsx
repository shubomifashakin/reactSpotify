import * as HELPERS from "./_helpers";

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
