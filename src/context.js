// create a provider,wrap everything in this component

import React, { Component } from "react";
import axios from "axios";

const Context = React.createContext();

export class Provider extends Component {
  state = {
    track_list: [],
    heading: "Top 10 Tracks"
  };

  componentDidMount() {
    const proxy = "https://cors-anywhere.herokuapp.com/";
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
        this.setState({ track_list: res.data.message.body.track_list });
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
