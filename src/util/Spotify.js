let userAccessToken;
//placeholder clientID
const clientID = "xxxxxx8414024d409f9b4cxxxxxxxxxx";
const redirectURI = "http://localhost:3000/";
//const redirectURI = "http://spotifire.surge.sh/";

const Spotify = {
  getAccessToken() {
    if (userAccessToken) {
      return userAccessToken;
    }
    //check if access token
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      userAccessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      //This clears the parameters, allowing for grabbing a new access token when the previous expires
      window.setTimeout(() => (userAccessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");
      return userAccessToken;
    } else {
      const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&redirect_uri=${redirectURI}&scope=playlist-modify-public&scope=playlist-modify-private&scope=user-library-read&scope=user-library-modify&show_dialog=true`;
      window.location = accessURL;
    }
  },

  search(term) {
    const userAccessToken = Spotify.getAccessToken();
    const endpointURL = `https://api.spotify.com/v1/search?type=track&q=${term}`;
    return fetch(endpointURL, {
      headers: { Authorization: `Bearer ${userAccessToken}` }
    })
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => {
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map(track => {
          return {
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            id: track.id,
            uri: track.uri
          };
        });
      });
  },

  savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }
    const accessToken = Spotify.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    };
    let userId;

    return fetch("https://api.spotify.com/v1/me", { headers: headers })
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => {
        userId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: "POST",
          body: JSON.stringify({ name: name })
        })
          .then(response => {
            return response.json();
          })
          .then(jsonResponse => {
            const playlistId = jsonResponse.id;
            return fetch(
              `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
              {
                method: "POST",
                headers: headers,
                body: JSON.stringify({ uris: trackUris })
              }
            );
          });
      });
  }
};

export default Spotify;
