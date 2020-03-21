import React from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import Spotify from "../../util/Spotify";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.setResultState = this.setResultState.bind(this);

    this.state = {
      searchResults: [],
      playlistName: "New Playlist",
      playlistTracks: []
    };
  }

  componentDidMount() {
    this.setState({ searchResults: [] });
  }

  addTrack(track) {
    if (
      this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)
    ) {
      return;
    }
    this.setState({ playlistTracks: [...this.state.playlistTracks, track] });
  }

  removeTrack(track) {
    const newPlaylistTracks = this.state.playlistTracks.filter(
      tracks => tracks.id !== track.id
    );
    this.setState({ playlistTracks: newPlaylistTracks });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      this.setState({ playlistName: "New Playlist", playlistTracks: [] });
    });
  }

  //used by search() to update the state
  setResultState(searchResults) {
    this.setState({ searchResults: searchResults });
  }

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setResultState(searchResults);
    });
  }

  render() {
    return (
      <div>
        <h1>
          Spoti<span className="highlight">Fire</span>
        </h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
