import React, { Component } from "react";
import CommentTextArea from "./CommentTextArea";
import "../css/comments.css";
import Question from "./Question";
import IndividualQuestion from "./IndividualQuestion";
import axiosNoTokensInstance from "../network-request/axiosNoTokensInstance";
import axiosJsonInstance from "../network-request/axiosJsonInstance";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import timeFromNow from "../utils/timeFromNow";
import { connect } from "react-redux";
import { Button } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

class CommentSection extends Component {
  constructor(props) {
    super(props);
    this.commentSection = React.createRef();
    this.state = {
      questions: null,
      // comments holds an array of array of hash map
      //comments initialized with [[]] so that subsequent comments loaded will have
      //their indexes match with page number
      areaType: "comment",
      replyPlaceholder: "",
      replyId: null,
      viewIndividualQuestion: false,
      openSnackbar: false,
      newReply: null,
      viewInfo: false
    };
  }

  componentDidMount() {
    let axiosInstance;
    this.props.isLoggedIn
      ? (axiosInstance = axiosJsonInstance)
      : (axiosInstance = axiosNoTokensInstance);
    axiosInstance
      .get("/qna/question/", {
        params: {
          fileId: this.props.fileId,
        },
      })
      .then((res) => {
        const questions = res.data["questions"];
        for (let i = 0; i < questions.length; i++) {
          for (let j = 0; j < questions[i].length; j++) {
            questions[i][j]["created_at"] = timeFromNow(
              questions[i][j]["created_at"]
            );
            if (questions[i][j]["id"].toString() === this.props.questionId) {
              const question = questions[i][j];
              this.toggleTextArea({
                username: question["user"]["username"],
                anonymous: question["user"]["is_anonymous"],
                reply: true,
                id: question["id"],
                title: question["title"],
                text: question["text"],
                likes: question["likes"],
                user: question["user"],
                liked: question["liked"],
                created_at: question["created_at"],
              });
            }
          }
        }
        const fileInfo = res.data["file_info"];
        fileInfo["created_at"] = timeFromNow(fileInfo["created_at"]);
        this.setState({
          questions: questions,
          author: res.data["author"],
          fileInfo: res.data["file_info"],
        });
      });
  }

  toggleTextArea = (e) => {
    console.log(e);
    console.log(".....");
    if (this.state.viewIndividualQuestion === false) {
      if (e["anonymous"] === true) {
        e["username"] = "anonymous user";
      }
      e["replyId"] = e.id;
      //setting this for individual question view
      this.setState({
        areaType: "reply",
        replyPlaceholder: `Reply to ${e["username"]}...`,
        replyId: e["id"],
        //setting reply id state for batch questions view
        viewIndividualQuestion: true,
        individualQuestionInfo: e,
      });
    } else {
      this.setState({
        areaType: "comment",
        replyId: null,
        viewIndividualQuestion: false,
        individualQuestionInfo: null,
      });
    }
  };

  onQuestionPosted = (e) => {
    const newQuestion = e.data;
    console.log(newQuestion);
    newQuestion["likes"] = 0;
    newQuestion["liked"] = false;
    newQuestion["created_at"] = "now";
    if (this.state.questions != null) {
      const questions = this.state.questions;
      questions[`${newQuestion.page_asked}`].unshift(newQuestion);
      this.setState({ questions: questions });
    }
    this.handleOpenSnackbar("Question posted");
  };

  onReplyPosted = (e) => {
    const newReply = e;
    newReply["likes"] = 0;
    newReply["liked"] = false;
    const questions = this.state.questions;
    this.setState({ newReply: newReply });
    this.handleOpenSnackbar("Reply sent");
    for (const key in questions) {
      for (let i = 0; i < questions[key].length; i++) {
        if (questions[key][i]["id"] === this.state.replyId) {
          questions[key][i]["number_of_replies"]++;
          this.setState({ questions: questions });
          return;
        }
      }
    }
  };

  onQuestionLiked = (e) => {
    const questions = this.state.questions;
    const individualQuestionInfo = this.state.individualQuestionInfo;
    if (individualQuestionInfo) {
      //need to check if user has already liked
      if (individualQuestionInfo["liked"]) {
        individualQuestionInfo["likes"]--;
        individualQuestionInfo["liked"] = false;
      } else {
        individualQuestionInfo["likes"]++;
        individualQuestionInfo["liked"] = true;
      }
      this.setState({ individualQuestionInfo: individualQuestionInfo });
    }
    console.log(this.state);
    for (const key in questions) {
      for (let i = 0; i < questions[key].length; i++) {
        if (questions[key][i]["id"] === e) {
          console.log(questions[key][i]);
          if (questions[key][i]["liked"]) {
            questions[key][i]["likes"]--;
            questions[key][i]["liked"] = false;
          } else {
            questions[key][i]["likes"]++;
            questions[key][i]["liked"] = true;
          }
          this.setState({ questions: questions });
          return;
        }
      }
    }
  };

  onQuestionDeleted = (e) => {
    const questions = this.state.questions;
    for (let i = 0; i < questions.length; i++) {
      for (let j = 0; j < questions[i].length; j++) {
        if (questions[i][j]["id"] === e["id"]) {
          questions[i].splice(j, 1);
          this.setState({ questions: questions });
          this.handleOpenSnackbar("Comment deleted");
          return;
        }
      }
    }
  };

  onQuestionCopied = (e) => {
    let locationWithouQueryString = window.location.href.split("?")[0];
    locationWithouQueryString += `?r=${this.props.fileId}&ic=${e}`;
    navigator.clipboard.writeText(locationWithouQueryString);
    this.handleOpenSnackbar("Question link copied to clipboard");
  };

  handleOpenSnackbar = (message) => {
    this.setState({ openSnackbar: true, snackbarMessage: message });
  };

  handleCloseSnackbar = () => {
    this.setState({ openSnackbar: false });
  };

  goToProfile = () => {
    this.props.history.push(`profile?user=${this.state.author.id}`);
  };

  follow = () => {
    axiosJsonInstance
      .post("/profile/follow/", { id: this.state.author.id })
      .then((res) => {
        const author = this.state.author;
        author["following"] = true;
        author["followers"]++;
        this.setState({ author: author });
      });
  };

  handleInfo = () => {
    this.setState({viewInfo: !this.state.viewInfo})
  }

  render() {
    return (
      <div className="comment-section-body">
        <div className="position-relative border-bot">
          <div className="d-flex justify-content-between align-items-center ml-4 flex-shrink-0 details mr-4">
            {this.state.author && this.state.fileInfo && (
              <div className="h-100 d-flex flex-column justify-content-around mb-3">
              <span className="title">{this.state.fileInfo.title}</span>
              <div className="d-flex align-items-center">
                <button
                  className="d-flex align-items-center un-btn"
                  onClick={this.goToProfile}
                >
                  <div className="author-profile p-3 mr-2 ml-3" />
                  <div className="d-flex flex-column">
                    <div className="d-flex align-items-center bold small-font">
                      <span>{this.state.author.name}</span>
                    </div>
                  </div>
                </button>
                <span className="mr-2 ml-2 grey-text small-font">•</span>
                <span className="grey-text small-font">
                  {this.state.author.followers} follower
                  {this.state.author.followers > 1 && "s"}
                </span>
                <span className="mr-2 ml-2 grey-text small-font">•</span>
                {this.state.author.following ? (
                  <span className="grey-text d-flex align-items-center small-font">
                    <span className="mr-2">Following</span>
                    <CheckCircleIcon className="light-grey-text f-1" />
                  </span>
                ) : (
                  <Button
                    onClick={this.follow}
                    className="blue-text small-font blue-border pl-3 pr-3 pill"
                  >
                    Follow
                  </Button>
                )}
              </div>
              </div>
            )}
            <span className="grey-text">
              Page {this.props.pageNumber} of {this.props.numberOfPages}
            </span>
          </div>
          {this.state.fileInfo && this.state.viewInfo && (
            <div className="info ml-4 mt-2 mb-4">
              <p>{this.state.fileInfo.description}</p>
            </div>
          )}
          <button onClick={this.handleInfo} className="view-more grey-text pr-2 pl-2">SHOW {this.state.viewInfo? "LESS" : "MORE"}</button>
        </div>
        <div className="questions-container ml-2 mt-3 mr-4">
          <div
            ref={this.commentSection}
            className="spacer d-flex justify-content-center"
          />
          {this.state.questions &&
            this.state.questions[`${this.props.pageNumber}`] &&
            !this.state.viewIndividualQuestion &&
            this.state.questions[`${this.props.pageNumber}`].map((question) => (
              <Question
                anonymous={question.is_anonymous}
                id={question.id}
                title={question.title}
                text={question.text}
                likes={question.likes}
                liked={question.liked}
                numberOfReplies={question.number_of_replies}
                user={question.user}
                edited={question.edited}
                replyId={this.state.replyId}
                createdAt={question.created_at}
                onQuestionCopied={(e) => this.onQuestionCopied(e)}
                toggleTextArea={(e) => this.toggleTextArea(e)}
                onQuestionLiked={(e) => this.onQuestionLiked(e)}
                onQuestionDeleted={(e) => this.onQuestionDeleted(e)}
              />
            ))}
          {this.state.viewIndividualQuestion && (
            <IndividualQuestion
              e={this.state.individualQuestionInfo}
              newReply={this.state.newReply}
              toggleTextArea={(e) => this.toggleTextArea(e)}
              onQuestionLiked={(e) => this.onQuestionLiked(e)}
              onQuestionDeleted={(e) => this.onQuestionDeleted(e)}
            />
          )}
        </div>
        <CommentTextArea
          areaType={this.state.areaType}
          replyPlaceholder={this.state.replyPlaceholder}
          fileId={this.props.fileId}
          pageNumber={this.props.pageNumber}
          replyId={this.state.replyId}
          onQuestionPosted={(e) => this.onQuestionPosted(e)}
          onReplyPosted={(e) => this.onReplyPosted(e)}
        />
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={this.state.openSnackbar}
          autoHideDuration={4500}
          onClose={this.handleCloseSnackbar}
          message={this.state.snackbarMessage}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={this.handleCloseSnackbar}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { isLoggedIn: state.isLoggedIn };
};

export default withRouter(connect(mapStateToProps)(CommentSection));
