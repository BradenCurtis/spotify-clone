require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Genius = require("genius-lyrics-api");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const spotifyApi = new SpotifyWebApi({
  redirectUri: process.env.REDIRECT_URI,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// console.log('Client ID:', process.env.CLIENT_ID);
// console.log('Client Secret:', process.env.CLIENT_SECRET);
// console.log('Redirect URI:', process.env.REDIRECT_URI);

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  // const spotifyApi = new SpotifyWebApi({
  //   redirectUri: process.env.REDIRECT_URI,
  //   clientId: process.env.CLIENT_ID,
  //   clientSecret: process.env.CLIENT_SECRET,
  //   refreshToken,
  // });

  spotifyApi
    .refreshAccessToken()
    .then(data => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      });
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.post("/login", (req, res) => {
  const code = req.body.code;
  console.log("Received login code:", code);
 /*  console.log("Client ID:", process.env.CLIENT_ID);
  console.log("Client Secret:", process.env.CLIENT_SECRET);
  console.log("Redirect URI:", process.env.REDIRECT_URI); */

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      console.log("Spotify API response:", data.body);
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch(err => {
      console.error('Error during authorization code grant:', err);
      res.sendStatus(400);
    });
});


app.get("/lyrics", async (req, res) => {
  const options = {
    apiKey: process.env.GENIUS_API_KEY, // Genius API key from .env file
    title: req.query.track,             // Track name from the query parameters
    artist: req.query.artist,           // Artist name from the query parameters
    optimizeQuery: true                 // Optimizes the query for better matching
  };

  try {
    const lyrics = await Genius.getLyrics(options);
    res.json({ lyrics: lyrics || "No Lyrics Found" });
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    res.status(500).json({ lyrics: "No Lyrics Found" });
  }
});

app.post("/add-to-queue", (req, res) => {
  const { trackUri, accessToken } = req.body

  spotifyApi.setAccessToken(accessToken)

  spotifyApi.addToQueue(trackUri)
    .then(response => {
      res.json({ message: "Track added to queue successfully" })
    })
    .catch(err => {
      console.error('Error adding track to queue:', err)
      res.sendStatus(400)
    })
})

app.listen(3001, () => {
  console.log("Server running on port 3001");
});