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
