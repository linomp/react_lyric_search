import React, { Component } from "react";
import axios from "axios";
import Spinner from "../layout/Spinner";
import { Link } from "react-router-dom";
import Moment from "react-moment";

export default class Lyrics extends Component {
  // we only need this info for this component.
  // it stays at component level rather than at application level
  // we're also gonna need to make 2 requests since the lyrics by track id
  // doesn't return track info.
  state = {
    track: {},
    lyrics: {}
  };

  componentDidMount() {
    const proxy = "https://cors-anywhere.herokuapp.com/";
    const rootURL = "http://api.musixmatch.com/ws/1.1/";
    // get id parameter from the URL
    const trackId = this.props.match.params.id;
    const apiLyricsMethod = `track.lyrics.get?track_id=${trackId}`;
    const apiTrackInfoMethod = `track.get?track_id=${trackId}`;

    // get lyrics
    axios
      .get(
        proxy +
          rootURL +
          apiLyricsMethod +
          `&apikey=${process.env.REACT_APP_MM_KEY}`,
        { crossdomain: true }
      )
      .then(res => {
        //console.log(res.data);
        this.setState({ lyrics: res.data.message.body.lyrics });
        // get track info
        return axios
          .get(
            proxy +
              rootURL +
              apiTrackInfoMethod +
              `&apikey=${process.env.REACT_APP_MM_KEY}`,
            { crossdomain: true }
          )
          .then(res => {
            //console.log(res.data);
            this.setState({ track: res.data.message.body.track });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  render() {
    const { track, lyrics } = this.state;
    //console.log(this.state);
    // check for empty object: Object.keys(track).length === 0
    if (
      track === undefined ||
      lyrics === undefined ||
      Object.keys(track).length === 0 ||
      Object.keys(lyrics).length === 0
    ) {
      return <Spinner />;
    } else {
      return (
        <React.Fragment>
          <Link to="/" className="btn btn-dark btn-sm mb-4">
            Go Back
          </Link>
          <div className="card">
            <h5 className="card-header">
              {track.track_name} by{" "}
              <span className="text-secondary">{track.artist_name}</span>
            </h5>
            <div className="card-body">
              <p className="card-text">{lyrics.lyrics_body}</p>
            </div>
          </div>
          <ul className="list-group mt-3">
            <li className="list-group-item">
              <strong>Album ID</strong>: {track.album_id}
            </li>
            <li className="list-group-item">
              <strong>Song Genre</strong>:{" "}
              {
                track.primary_genres.music_genre_list[0].music_genre
                  .music_genre_name
              }
            </li>
            <li className="list-group-item">
              <strong>Explicit</strong>: {track.explicit === 0 ? "No" : "Yes"}
            </li>
            <li className="list-group-item">
              <strong>Release Date</strong>:{" "}
              <Moment format="MM/DD/YYYY">{track.first_release_date}</Moment>
            </li>
          </ul>
        </React.Fragment>
      );
    }
  }
}
