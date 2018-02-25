import React, { Component } from "react";
import "./style.scss";

class OfflineToast extends Component {
  state = {
    offline: false
  }
  
  componentDidMount() {
    window.addEventListener("online", () => {
      this.setState({
        offline: false
      });
    });

    window.addEventListener("offline", () => {
      this.setState({
        offline: true
      });
    });
  }

  render() {
    const { offline } = this.state;
    return (
      <React.Fragment>{offline && <div className="OfflineToast">You are offline</div>}</React.Fragment>
    );
  }
}

OfflineToast.propTypes = {};

export default OfflineToast;
