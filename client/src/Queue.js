// Queue.js
import React from "react";

export default function Queue({ queue }) {
  return (
    <div style={{ overflowY: "auto", height: "100%" }}>
      <h4>Queue</h4>
      {queue.length === 0 ? (
        <div>No tracks in queue</div>
      ) : (
        queue.map((track, index) => (
          <div key={index} className="d-flex align-items-center m-2">
            <img
              src={track.albumUrl}
              style={{ height: "64px", width: "64px" }}
              alt={track.title}
            />
            <div className="ml-3">
              <div>{track.title}</div>
              <div className="text-muted">{track.artist}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
