import React, { Component } from "react";
import CommentSection from "./CommentSection";
import "../css/pdf.css";
import PDFApp from "./PDFApp";

export default class Reader extends Component {
  constructor(props) {
    super(props);
    const queryString = require("query-string");
    const fileId = queryString.parse(this.props.location.search).r;
    const questionId = queryString.parse(this.props.location.search).ic;
    let pageNumber = queryString.parse(this.props.location.search).p || 1;
    if (pageNumber < 1) pageNumber = 1;
    this.state = {
      fileId: fileId,
      pageNumber: pageNumber,
      numberOfPages: null,
      uploadedBy: null,
      questionId: questionId,
    };
    this.spacer = React.createRef();
  }

  onPageChange = (e) => {
    this.setState({ pageNumber: e.pageNumber });
  };

  onDocRendered = (e) => {
    const numPages = e.pdfInfo.numPages;
    if (this.state.pageNumber > numPages) {
      this.setState({ pageNumber: numPages, numberOfPages: numPages });
    }
    this.setState({ numberOfPages: numPages });
  };

  onResize = (e)=> {
    console.log(e)
    console.log("resize pls")
    this.spacer.current.style.transition = "none";
    this.spacer.current.style.width = `calc(${e}% - 2rem)`;
  }
  

  render() {
    return (
      <div className="reader">
        <PDFApp
          pageNumber={this.state.pageNumber}
          fileId={this.state.fileId}
          onDocRendered={(e) => this.onDocRendered(e)}
          onPageChange={(e) => this.onPageChange(e)}
          onResize={(e) => this.onResize(e)}
        />
        <div className="background-reader">
          <div ref={this.spacer} className="spacer-left" style={{transition: "all 0.7s ease-in-out"}}/>
          {this.state.numberOfPages && (
            <CommentSection
              fileId={this.state.fileId}
              questionId={this.state.questionId}
              numberOfPages={this.state.numberOfPages}
              pageNumber={this.state.pageNumber}
            />
          )}
        </div>
      </div>
    );
  }
}
