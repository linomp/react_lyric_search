import React, { Component } from "react";
import { Consumer } from "../../context";
import axios from "axios";

// when we click search, we make a request to the API and get back
// a list of tracks that match our search. When we get that back we want
// to manipulate our global state and replace the top 10 tracks list with
// the search results. We must connect this search component to the context
// using a consumer.

// to use the consumer, wrap everything inside the return with it.
// in this case we'll have a dispatch method in our state.
// so to dispatch an action to our context!

export default class Search extends Component {
  state = {
    trackTitle: ""
  };

  onFormChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  findTrack = (dispatch, e) => {
    e.preventDefault();
    const proxy = process.env.REACT_APP_MY_CORS_ANYWHERE_PROXY;
    const rootURL = process.env.REACT_APP_API_ROOT_URL;
    const apiMethod = `track.search?page_size=10&s_track_rating=desc&q_track=${this.state.trackTitle}`;
    // send in empty list to clear out track_list from Tracks state and force it to render the Spinner
    // until the get request returns the data
    dispatch({
      type: "BEGIN_SEARCH"
    });

    axios
      .get(
        proxy + rootURL + apiMethod + `&apikey=${process.env.REACT_APP_MM_KEY}`,
        { crossdomain: true }
      )
      .then(res => {
        console.log(res.data);
        dispatch({
          type: "SEARCH_TRACKS",
          payload: res.data.message.body.track_list
        });
        this.setState({ trackTitle: "" });
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <Consumer>
        {value => {
          const { dispatch } = value;
          return (
            <div className="card body mb-4 p-4">
              <h1 className="display-4 text-center">
                <i className="fas fa-music" /> Search For A Song
              </h1>
              <p className="lead text-center">Get the lyrics for any song</p>
              <form onSubmit={this.findTrack.bind(this, dispatch)}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Song Title..."
                    name="trackTitle"
                    value={this.state.trackTitle}
                    onChange={this.onFormChange}
                  />
                </div>
                <button
                  className="btn btn-primary btn-lg btn-block mb-5"
                  type="submit"
                >
                  Get Lyrics
                </button>
              </form>
            </div>
          );
        }}
      </Consumer>
    );
  }
}
