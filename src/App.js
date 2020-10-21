import React, { Component } from "react";
import hash from "./hash";
import logo from "./logo.svg";
import * as $ from "jquery";
import Player from "./Player";
import "./App.css";
export const authEndpoint = "https://accounts.spotify.com/authorize";

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = "55039ca9e10f43b5bb411d4f530ecce6";
const redirectUri = "http://localhost:3000/";
const scopes = [
  "user-top-read",
  "user-read-currently-playing",
  "user-read-playback-state",
];

class App extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
      item: {
        album: {
          images: [{ url: "" }],
        },
        name: "",
        artists: [{ name: "" }],
        duration_ms: 0,
      },
      is_playing: "Paused",
      progress_ms: 0,
      currUserId: "",
    };
    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
  }
  async getPlaylists(token) {
    // Make a call using the token
    await $.ajax({
      url: "https://api.spotify.com/v1/me",
      type: "GET",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: (data) => {
        this.setState({
          currUserId: data.id,
        });
      },
    });
    await $.ajax({
      url:
        "https://api.spotify.com/v1/users/" +
        this.state.currUserId +
        "/playlists",
      type: "GET",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: (data) => {
        console.log(data);
      },
    });
  }
  async getCurrentlyPlaying(token) {
    // Make a call using the token
    $.ajax({
      url: "https://api.spotify.com/v1/me/player",
      type: "GET",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: (data) => {
        this.setState({
          item: data.item,
          is_playing: data.is_playing,
          progress_ms: data.progress_ms,
        });
      },
    });
  }
  componentDidMount() {
    // Set token
    let _token = hash.access_token;
    console.log("token", _token);
    if (_token) {
      // Set token
      this.setState({
        token: _token,
      });
      this.getCurrentlyPlaying(_token);
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {!this.state.token && (
            <a
              className="btn btn--loginApp-link"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                "%20"
              )}&response_type=token&show_dialog=true`}
            >
              Login to Spotify
            </a>
          )}
          {this.state.token && (
            <>
              <Player
                item={this.state.item}
                is_playing={this.state.is_playing}
                progress_ms={this.progress_ms}
              />
              <button onClick={() => this.getPlaylists(this.state.token)}>
                Get Playlists
              </button>
            </>
          )}
        </header>
      </div>
    );
  }
}
export default App;
