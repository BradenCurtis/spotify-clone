import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";

export default function Login() {
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");

  const handleRoomNameChange = (event) => {
    const value = event.target.value;
    setRoomName(value);

    if (value.trim() === "") {
      setError("Room name cannot be blank.");
    } else if (/\s/.test(value)) {
      setError("Room name cannot contain spaces.");
    } else {
      setError("");
    }
  };

  const getAuthUrl = () => {
    const clientId = "062f8ada18c34c9ebfb735cbdb9aea0a";
    const redirectUri = "http://localhost:3000/logincallback";
    const scopes = "streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state user-read-currently-playing";
    return `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scopes)}&state=${roomName}`;
  };

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Form className="mb-3">
        <Form.Group controlId="formRoomName">
          <Form.Label>Room Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter room name"
            value={roomName}
            onChange={handleRoomNameChange}
          />
        </Form.Group>
        {error && <Alert variant="danger">{error}</Alert>}
      </Form>
      <Button
        href={getAuthUrl()}
        disabled={!roomName || error}
        className="btn btn-success btn-lg"
      >
        Login With Spotify
      </Button>
    </Container>
  );
}
