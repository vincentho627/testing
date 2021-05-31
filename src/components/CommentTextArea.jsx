import React, { Component } from "react";
import "../css/comments.css";
import Send from "@material-ui/icons/Send";
import IconButton from "@material-ui/core/IconButton";
import axiosJsonInstance from "../network-request/axiosJsonInstance";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";

class CommentTextArea extends Component {
  initialState = {
    text: "",
    replyText: "",
    replyId: null,
  };

  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.textarea = React.createRef();
  }

  handleChange = (e) => {
      this.setState({ text: e.target.value });
  };

  postQuestion = () => {
    const data = {
      text: this.state.text,
      question_of: this.props.fileId,
      page_asked: this.props.pageNumber,
      is_anonymous: this.props.isAnonymous,
    };
    axiosJsonInstance.post("/qna/question/", data).then((res) => {
      this.props.onQuestionPosted(res);
      this.setState(this.initialState);
      this.textarea.current.value = "";
      console.log(res);
      console.log("...")
    });
  };

  handleReplyChange = (e) => {
    this.setState({ replyText: e.target.value });
  };

  postReply = () => {
    const data = {
      text: this.state.replyText,
      question: this.state.replyId,
      is_anonymous: this.props.isAnonymous,
    };
    axiosJsonInstance.post("/qna/answer/", data).then((res) => {
      this.props.onReplyPosted(res.data);
      this.textarea.current.value = "";
      this.setState(this.initialState);
    });
  };

  componentWillReceiveProps(props) {
    if (this.state.replyId !== props.replyId) {
      this.setState(this.initialState);
      this.textarea.current.value = "";
      this.setState({ replyId: props.replyId });
    }
  }

  checkLogin = () => {
    if (this.props.isLoggedIn === false) {
      window.location.href = "/login/";
    }
  };

  render() {
    return (
      <div className="d-flex flex-column position-relative mb-3 ml-4 mr-4 flex-shrink-0 mt-0 top-shadow">
        {this.props.areaType === "reply" ? (
          <TextField
            ref={this.textarea}
            onChange={this.handleReplyChange}
            onFocus={this.checkLogin}
            label={this.props.replyPlaceholder}
            ref={this.textarea}
            id="outlined-textarea"
            variant="filled"
            className="input"
            multiline
            rowsMax={3}
            rows={3}
            value={this.state.replyText}
          />
        ) : (
          <TextField
            ref={this.textarea}
            id="outlined-textarea"
            onFocus={this.checkLogin}
            variant="filled"
            label="Ask a question..."
            className="input"
            multiline
            rowsMax={3}
            rows={3}
            value={this.state.text}
            onChange={this.handleChange}
          />
        )}
        <IconButton
          disabled={!this.state.text.length > 0 && !this.state.replyText > 0}
          onClick={
            this.props.areaType === "reply" ? this.postReply : this.postQuestion
          }
          className="ml-2 icon-but"
        >
          <Send
            className={
              "send-icon " +
              (this.state.text.length > 0 || this.state.replyText.length > 0
                ? "blue-icon"
                : null)
            }
          />
        </IconButton>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { isAnonymous: state.isAnonymous, isLoggedIn: state.isLoggedIn };
};

export default connect(mapStateToProps)(CommentTextArea);
