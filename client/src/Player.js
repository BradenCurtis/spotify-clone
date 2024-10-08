import { useState, useEffect } from "react";
import SpotifyPlayer from "react-spotify-web-playback";

export default function Player({ accessToken, trackUri, onTrackChange }) {
  const [play, setPlay] = useState(false);

  // Start playing when a new trackUri is received
  useEffect(() => {
    if (trackUri) {
      setPlay(true);
    }
  }, [trackUri]);

  // Called whenever the player state changes
  const handleCallback = (state) => {
    console.log("Player state:", state); // Debug log
    if (state.isPlaying && state.track) {
      console.log("Calling onTrackChange with track:", state.track);
      onTrackChange(state.track);
    }
    if (!state.isPlaying && state.track) {
      setPlay(false);
    }
  };

  if (!accessToken) return null;

  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      callback={handleCallback}
      play={play}
      uris={trackUri ? [trackUri] : []}
    />
  );
}
