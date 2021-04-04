// create a provider,wrap everything in this component

import React, { Component } from "react";
import axios from "axios";

const Context = React.createContext();

const reducer = (state, action) => {
  switch (action.type) {
    // the response we get in the search component will be sent as payload
    case "SEARCH_TRACKS":
      return {
        ...state,
        searchingFinished: true,
        track_list: action.payload,
        heading: "Search Results"
      };

    case "BEGIN_SEARCH":
      return {
        ...state,
        searchingFinished: false,
        track_list: [],
      };


    default:
      return state;
  }
};

export class Provider extends Component {
  // this state gets passed down to any consumer
  state = {
    searchingFinished: false,
    track_list: [],
    heading: "Top 10 Tracks",
    // this will allow us to have a reducer which manipulates the global state
    // from every consumer component. inside the reducer, the action type will be evaluated
    // to decide what to manipulate and how.
    // From the consumer components we need to call this dispatch method,
    // and send action type + payload
    dispatch: action => this.setState(state => reducer(state, action))
  };

  componentDidMount() {
    const proxy = "https://thingproxy.freeboard.io/fetch/";
    const rootURL = "http://api.musixmatch.com/ws/1.1/";
    const apiMethod =
      "chart.tracks.get?chart_name=top&page=1&page_size=10&country=us&f_has_lyrics=1";
    axios
      .get(
        proxy + rootURL + apiMethod + `&apikey=${process.env.REACT_APP_MM_KEY}`,
        { crossdomain: true }
      )
      .then(res => {
        //console.log(res.data);
        this.setState({ searchingFinished: true, track_list: res.data.message.body.track_list });
      })
      .catch(err => console.log(err));
  }

  // we can access whatever state we put in this provider as long
  // as we use a consumer
  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export const Consumer = Context.Consumer;
