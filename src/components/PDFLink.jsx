import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

class PDFLink extends Component {

  handleClick = () => {
    this.props.history.push(`view?r=${this.props.pdfId}`);
  }

  render() {
    return (
      <button onClick={this.handleClick}>{this.props.title + " " + this.props.createdAt}</button>
    )
  }

}

export default withRouter(PDFLink);
