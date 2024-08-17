import React from "react"

export default function TrackSearchResult({ track, chooseTrack, addToQueue }) {
  function handlePlay() {
    chooseTrack(track)
  }

  function handleAddToQueue() {
    addToQueue(track)
  }

  return (
    <div
      className="d-flex m-2 align-items-center justify-content-between"
      style={{ cursor: "pointer" }}
    >
      <div onClick={handlePlay}>
        <img src={track.albumUrl} style={{ height: "64px", width: "64px" }} />
        <div className="ml-3">
          <div>{track.title}</div>
          <div className="text-muted">{track.artist}</div>
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleAddToQueue}>
        Add to Queue
      </button>
    </div>
  )
}
