import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "../css/result.css";
import "../css/colors.css";

class Result extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  goToFile = () => {
    this.props.history.push(`view?r=${this.props.id}`);
  };

  render() {
    return (
      <button className="result-btn pl-0" onClick={this.goToFile}>
        <div className="views-and-time grey-text mb-2 d-flex align-items-center">
          <div className="d-flex align-items-center">
            <div className="small-user-profile mr-2"></div>
            <span>{this.props.authors.username} • </span>
          </div>
          <span className="ml-1">{this.props.createdAt} • </span>
          <span className="ml-1">{this.props.views} views</span>
        </div>
        <span className="title mb-1">{this.props.title}</span>
        <p className="grey-text mb-0 block-with-text">{this.props.description}</p>
      </button>
    );
  }
}

export default withRouter(Result);
