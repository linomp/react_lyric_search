import React, { Component } from "react";
import { Consumer } from "../../context";
import Spinner from "../layout/Spinner";
import Track from "./Track";

class Tracks extends Component {
  render() {
    // whatever was passed to the context provider
    // is now available here as "value"
    return (
      <Consumer>
        {value => {
          const { track_list, heading, searchingFinished } = value;
          if (!searchingFinished || track_list === undefined) {
            return <Spinner />;
          } else if (searchingFinished && track_list.length === 0) {
            return <h3 className="text-center mb-4">No results.</h3>
          } else {
            return (
              <React.Fragment>
                <h3 className="text-center mb-4">{heading}</h3>
                <div className="row">
                  {// render a Track component for each one. a key is required
                    track_list.map(item => (
                      <Track key={item.track.track_id} track={item.track} />
                    ))}
                </div>
              </React.Fragment>
            );
          }
        }}
      </Consumer>
    );
  }
}

export default Tracks;
