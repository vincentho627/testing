import React, { Component } from "react";
import { IconButton } from "@material-ui/core";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import "../css/answer.css";
import axiosJsonInstance from "../network-request/axiosJsonInstance";
import ThumbUpOutlinedIcon from "@material-ui/icons/ThumbUpOutlined";

export default class Answer extends Component {
  onLike = () => {
    axiosJsonInstance
      .post("/qna/like-answer/", { answerId: this.props.id })
      .then((res) => {
        console.log(res);
        this.props.onLike({ id: this.props.id });
      });
  };

  render() {
    return (
      <div className="d-flex align-items-start mb-3 margin-left small-font">
        <div className="user-profile-answer p-3 mr-3 ml-3 mt-1"></div>
        <div>
          <div className="mb-1">
            <span className="bold">
              {this.props.anonymous ? "Anonymous" : this.props.user.name}{" "}
            </span>
            <span className="grey-text">
              {this.props.createdAt} {this.props.edited && "(edited)"}
            </span>
          </div>
          <div className="mb-1">
            <span className="small-font txt-overflow" style={{ whiteSpace: "pre-line" }}>{this.props.text}</span>
          </div>
          <div className="d-flex align-items-center negative-margin grey-text">
            <IconButton
              className={
                "like-button " + (this.props.liked ? "blue-text" : "grey-text")
              }
              onClick={this.onLike}
            >
              <ThumbUpOutlinedIcon className="like-icon" />
            </IconButton>
            <span className="mr-2">{this.props.likes}</span>
          </div>
        </div>
      </div>
    );
  }
}
