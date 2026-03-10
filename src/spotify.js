const CLIENT_ID = "84a62592a3814a769a61743dbcb84225";
const CLIENT_SECRET = "90089b8f10aa4e139c7dbaa2c9fafb95";

let accessToken = null;

async function getAccessToken() {

  if (accessToken) return accessToken;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
    },
    body: "grant_type=client_credentials"
  });

  const data = await response.json();
  accessToken = data.access_token;

  return accessToken;
}

export async function getRandomSong() {

  const token = await getAccessToken();

  const randomLetter =
    "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];

  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${randomLetter}&type=track&limit=50`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const data = await res.json();

  const tracks = data.tracks.items.filter(
    t => t.preview_url
  );

  return tracks[Math.floor(Math.random() * tracks.length)];

}
