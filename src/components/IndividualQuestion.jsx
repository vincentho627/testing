import React, { Component } from "react";
import Question from "./Question.jsx";
import Answer from "./Answer.jsx";
import axiosNoTokensInstance from "../network-request/axiosNoTokensInstance";
import axiosJsonInstance from '../network-request/axiosJsonInstance';
import timeFromNow from '../utils/timeFromNow';
import { connect } from "react-redux";

class IndividualQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      replies: null,
    };
    console.log(this.props)
    console.log("INDIVIDUAL")
  }

  componentDidMount() {
    let axiosInstance;
    this.props.isLoggedIn? axiosInstance = axiosJsonInstance : axiosInstance = axiosNoTokensInstance;
    axiosInstance
      .get("/qna/answer/", {
        params: {
          questionId: this.props.e.id,
        },
      })
      .then((res) => {
        const replies = res.data["replies"]
        console.log("resplies")
        console.log(replies)
        for(let i = 0; i<replies.length; i++) {
          replies[i]["created_at"] = timeFromNow(replies[i]["created_at"])
        }
        this.setState({ replies: replies });
      });
  }

  componentWillReceiveProps(props) {
    const newReply = props.newReply
    let replies = this.state.replies;
    if (newReply === null || replies===null) return;
    if (replies[replies.length-1]!==newReply) {
      newReply["created_at"] = "now"
      replies.push(newReply);
      this.setState({replies: replies})
    }
  }

  toggleTextArea = (e) => {
    this.props.toggleTextArea(e);
  };

  onQuestionLiked = (e) => {
    this.props.onQuestionLiked(e);
  };

  onQuestionDeleted = (e) => {
    this.props.onQuestionDeleted(e);
  }

  onLike = (e) => {
    console.log(e);
    const replies = this.state.replies;
    for (const key in replies) {
      if (replies[key]["id"]===e["id"]) {
        if (replies[key]["liked"]) {
          replies[key]["liked"] = false;
          replies[key]["likes"]--;
        } else {
          replies[key]["liked"] = true;
          replies[key]["likes"]++;
        }
        this.setState({replies: replies})
      }
    }
  }

  toggleTextArea = (e) => {
    console.log("ok individual")
    this.props.toggleTextArea(e);
  };


  render() {
    return (
      <div>
        <Question
          anonymous={this.props.e.anonymous}
          id={this.props.e.id}
          title={this.props.e.title}
          text={this.props.e.text}
          likes={this.props.e.likes}
          user={this.props.e.user}
          replyId={this.props.e.replyId}
          liked={this.props.e.liked}
          createdAt={this.props.e.created_at}
          viewIndividualQuestion={true}
          numberOfReplies={this.props.e.number_of_replies}
          toggleTextArea={(e) => this.toggleTextArea(e)}
          onQuestionLiked={(e) => this.onQuestionLiked(e)}
          onQuestionDeleted={(e) => this.onQuestionDeleted(e)}
        />
        {this.state.replies &&
          this.state.replies.map((reply) => (
            <Answer
              anonymous={reply.is_anonymous}
              id={reply.id}
              text={reply.text}
              likes={reply.likes}
              user={reply.user}
              liked={reply.liked}
              onLike={(e)=>this.onLike(e)}
              createdAt={reply.created_at}
            />
            ))}
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return { isLoggedIn: state.isLoggedIn };
};

export default connect(mapStateToProps)(IndividualQuestion)