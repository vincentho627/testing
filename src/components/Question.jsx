import React, { Component } from "react";
import { Button, IconButton } from "@material-ui/core";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbUpOutlinedIcon from "@material-ui/icons/ThumbUpOutlined";
import "../css/question.css";
import "../css/colors.css";
import axiosJsonInstance from "../network-request/axiosJsonInstance";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AlertDialog from "./AlertDialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

export default class Question extends Component {
  constructor(props) {
    super(props);
    this.reply = React.createRef();
    this.state = {
      optionsMenu: null,
      openDialog: false,
    };
  }

  toggleTextArea = () => {
    this.props.toggleTextArea({
      username: this.props.user.username,
      anonymous: this.props.anonymous,
      reply: this.reply.current.innerText === "REPLY",
      id: this.props.id,
      title: this.props.title,
      text: this.props.text,
      likes: this.props.likes,
      user: this.props.user,
      liked: this.props.liked,
      created_at: this.props.createdAt,
      number_of_replies: this.props.numberOfReplies,
    });
  };

  onQuestionLiked = () => {
    this.props.onQuestionLiked(this.props.id);
  };

  like = () => {
    axiosJsonInstance
      .post("/qna/like-question/", { questionId: this.props.id })
      .then((res) => {
        console.log(res);
        this.onQuestionLiked();
      });
  };

  showOptionsMenu = () => {
    this.setState({ show: true });
  };

  hideOptionsMenu = () => {
    this.setState({ show: false, optionsMenu: null });
  };

  openOptionsMenu = (event) => {
    this.setState({ optionsMenu: event.currentTarget });
  };

  handleDeleteOptionsMenu = () => {
    this.setState({ openDialog: true });
    this.setState({ optionsMenu: null });
  };

  handleEditOptionsMenu = () => {
    console.log("put request");
    this.setState({ optionsMenu: null });
  };

  handleShareOptionsMenu = () => {
    this.setState({ optionsMenu: null });
    this.props.onQuestionCopied(this.props.id);
  };

  handleCloseDialog = () => {
    this.setState({ openDialog: false });
  };

  deleteQuestion = () => {
    axiosJsonInstance
      .delete("/qna/question/", { data: { id: this.props.id } })
      .then((res) => {
        this.setState({ openDialog: false });
        this.props.onQuestionDeleted({ id: this.props.id });
        if (this.props.viewIndividualQuestion) this.toggleTextArea();
      });
  };

  render() {
    return (
      <div
        className="d-flex align-items-start mb-4 w-88 position-relative txt-overflow small-font"
        onMouseEnter={this.showOptionsMenu}
        onMouseLeave={this.hideOptionsMenu}
      >
        <div className="user-profile p-3 mr-3 ml-3 mt-1">
          {this.props.anonymous ? (
            <FontAwesomeIcon className="user-secret" icon={faUserSecret} />
          ) : (
            this.props.user.username[0].toUpperCase()
          )}
        </div>
        <div className="mr-5">
          <div className="mb-1">
            <span className="bold">
              {this.props.anonymous ? "Anonymous" : this.props.user.name}{" "}
            </span>
            <span className="grey-text">
              {this.props.createdAt} {this.props.edited && "(edited)"}
            </span>
          </div>
          <div className="mb-1">
            <span className="small-font txt-overflow" style={{ whiteSpace: "pre-line" }}>
              {this.props.text}
            </span>
          </div>
          <div className="d-flex align-items-center negative-margin grey-text">
            <IconButton
              className={
                "like-button " + (this.props.liked ? "blue-text" : "grey-text")
              }
              onClick={this.like}
            >
              <ThumbUpOutlinedIcon className="like-icon" />
            </IconButton>
            <span className="mr-3">{this.props.likes}</span>
            <Button
              ref={this.reply}
              className="grey-text small-font"
              onClick={this.toggleTextArea}
            >
              {this.props.replyId === this.props.id ? "CANCEL" : "REPLY"}
            </Button>
          </div>
          {this.props.numberOfReplies > 0 && (
            <button
              className="view-replies-btn blue-text negative-margin mt-1"
              onClick={this.toggleTextArea}
            >
              {this.props.viewIndividualQuestion ? (
                <div>
                  <ArrowDropUpIcon className="mr-2 s-font" />
                  <span>Hide replies</span>
                </div>
              ) : (
                <div>
                  <ArrowDropDownIcon className="mr-2 s-font" />
                  <span>
                    View {this.props.numberOfReplies}{" "}
                    {this.props.numberOfReplies > 1 ? "replies" : "reply"}
                  </span>
                </div>
              )}
            </button>
          )}
        </div>
        <div>
          {" "}
          <IconButton
            className={
              "fix-top-right " +
              (this.state && this.state.show ? null : "d-none")
            }
            onClick={this.openOptionsMenu}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={this.state.optionsMenu}
            keepMounted
            open={Boolean(this.state.optionsMenu)}
            onClose={this.hideOptionsMenu}
          >
            <MenuItem className="pr-5" onClick={this.handleShareOptionsMenu}>
              <ListItemIcon>
                <FontAwesomeIcon icon={faShare} className="font-awesome-icon" />
              </ListItemIcon>
              Share{" "}
            </MenuItem>
            {parseInt(this.props.user.id) ===
              parseInt(localStorage.getItem("id")) && (
              <div>
                {" "}
                <MenuItem className="pr-5" onClick={this.handleEditOptionsMenu}>
                  <ListItemIcon>
                    <EditIcon />
                  </ListItemIcon>
                  Edit
                </MenuItem>
                <MenuItem onClick={this.handleDeleteOptionsMenu}>
                  {" "}
                  <ListItemIcon>
                    <DeleteIcon />
                  </ListItemIcon>
                  Delete
                </MenuItem>
              </div>
            )}
          </Menu>
        </div>
        <AlertDialog
          openDialog={this.state.openDialog}
          handleCloseDialog={this.handleCloseDialog}
          deleteQuestion={this.deleteQuestion}
        />
      </div>
    );
  }
}
