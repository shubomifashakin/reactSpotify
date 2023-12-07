import { timer } from "./_helpers";

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
