import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import Player from "./Player";
import TrackSearchResult from "./TrackSearchResult";
import { Container, Form } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";

const spotifyApi = new SpotifyWebApi({
  clientId: "4da3c667dca548818e6801d5a2bdf435",
});

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");

  function chooseTrack(track) {
    setPlayingTrack(track);
    setSearch("");
    setLyrics("");
  }

  function addToQueue(track) {
    axios
      .post("http://localhost:3001/add-to-queue", {
        trackUri: track.uri,
        accessToken,
      })
      .then((response) => {
        console.log("Track added to queue successfully", response.data);
      })
      .catch((error) => {
        console.error("Error adding track to queue", error);
      });
  }

  function fetchLyrics(track) {
    if (!track) return;

    console.log("Fetching lyrics for:", track.name, "by", track.artists);
    console.log("Format for lyrics fetch:", track);

    axios
      .get("http://localhost:3001/lyrics", {
        params: {
          track: track.name,
          artist: track.artists,
        },
      })
      .then((res) => {
        console.log("Received lyrics:", res.data.lyrics);
        setLyrics(res.data.lyrics);
      })
      .catch((error) => {
        console.error("Error fetching lyrics:", error);
      });
  }

  useEffect(() => {
    if (playingTrack) {
      fetchLyrics(playingTrack);
    }
  }, [playingTrack]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;
    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            },
            track.album.images[0]
          );

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          };
        })
      );
    });

    return () => (cancel = true);
  }, [search, accessToken]);

  // Function to handle track changes in Player
  function handleTrackChange(track) {
    // Check if track and track.artists exist and are in the expected format
    console.log("Track changed:", track);
    

    if (track) {
      console.log("Setting playing track:", track);
      setPlayingTrack(track);
    } else {
      console.error("Invalid track data:", track);
    }
  }

  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
      <Form.Control
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
        {searchResults.map((track) => (
          <TrackSearchResult
            track={track}
            key={track.uri}
            chooseTrack={chooseTrack}
            addToQueue={addToQueue} // Pass addToQueue as a prop
          />
        ))}
        {searchResults.length === 0 && (
          <div className="text-center" style={{ whiteSpace: "pre" }}>
            {lyrics}
          </div>
        )}
      </div>
      <div>
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} onTrackChange={handleTrackChange} />
      </div>
    </Container>
  );
}
