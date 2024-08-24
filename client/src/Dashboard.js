import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import Player from "./Player";
import TrackSearchResult from "./TrackSearchResult";
import Queue from "./Queue"; // Import the new Queue component
import { Container, Form, Row, Col } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";

const spotifyApi = new SpotifyWebApi({
  clientId: "062f8ada18c34c9ebfb735cbdb9aea0a",
});

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");
  const [queue, setQueue] = useState([]); // Add state for queue

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
        setQueue((prevQueue) => [...prevQueue, track]); // Update queue state
      })
      .catch((error) => {
        console.error("Error adding track to queue", error);
      });
  }

  function fetchLyrics(track) {
    if (!track) return;

    if (track.artist) {
      track.artists = track.artist;
      track.name = track.title;
    }

    console.log("Fetching lyrics for:", track.name, "by", track.artists);

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

  function handleTrackChange(track) {
    console.log("Track changed:", track);

    if (track) {
      console.log("Setting playing track:", track);

      // Remove the currently playing track from the queue
      setQueue((prevQueue) =>
        prevQueue.filter((queuedTrack) => queuedTrack.uri !== track.uri)
      );

      setPlayingTrack(track);
    } else {
      console.error("Invalid track data:", track);
    }
  }

  return (
    <Container fluid className="d-flex flex-column vh-100">
      {/* Search Bar */}
      <Row style={{ marginTop: "10px" }}>
        <Col>
          <Form.Control
            type="search"
            placeholder="Search Songs/Artists"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-100"
          />
        </Col>
      </Row>

      {/* Middle Section */}
      <Row className="flex-grow-1 my-2">
        {searchResults.length === 0 ? (
          <>
            <Col
              md={8}
              className="lyrics-section"
              style={{
                maxHeight: "calc(100vh - 160px)",
                overflowY: "auto",
              }}
            >
              <div className="text-center" style={{ whiteSpace: "pre" }}>
                {lyrics}
              </div>
            </Col>
            <Col md={4} className="queue-section" style={{ overflowY: "auto" }}>
              <Queue queue={queue} />
            </Col>
          </>
        ) : (
          <Col className="search-results-section" style={{ overflowY: "auto" }}>
            {searchResults.map((track) => (
              <TrackSearchResult
                track={track}
                key={track.uri}
                chooseTrack={chooseTrack}
                addToQueue={addToQueue}
              />
            ))}
          </Col>
        )}
      </Row>

      {/* Player */}
      <Row>
        <Col>
          <Player
            accessToken={accessToken}
            trackUri={playingTrack?.uri}
            onTrackChange={handleTrackChange}
            className="w-100"
          />
        </Col>
      </Row>
    </Container>
  );
}
