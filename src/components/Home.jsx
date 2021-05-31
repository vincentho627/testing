import React, {Component} from 'react';
import axiosJsonInstance from "../network-request/axiosJsonInstance";
import PDFLink from './PDFLink';


class Home extends Component {

  state = {
    pageNumber: 1,
    pdfList: []
  };

  getPdfList() {
    console.log(this.state.pageNumber);
    // axiosJsonInstance
    //   .get("/pdf/get-my-pdfs/", {
    //     params: {
    //       pageNumber: this.state.pageNumber,
    //     },
    //   })
    //   .then((res) => {
    //     const pdfList = res.data.PDFList;
    //     console.log(this.state.pageNumber);
    //     console.log(pdfList);
    //     this.setState({pdfList: pdfList});
    //   });
  }

  componentDidMount() {
    this.getPdfList();
  }

  async nextPage() {
    await this.setState({pageNumber: this.state.pageNumber + 1});
    await this.getPdfList();
  }

  async previousPage() {
    if (this.state.pageNumber - 1 > 0) {
      await this.setState({pageNumber: this.state.pageNumber - 1});
      await this.getPdfList();
    }
  }

  render() {
    return (
      <div>
        {/* <h4>Recent Reads</h4>
          <div className="w-50 d-flex">
          {this.state.pdfList.map(pdf => (
                <PDFLink
                  key={pdf.pdfId}
                  pdfId={pdf.pdfId}
                  title={pdf.title}
                  createdAt={pdf.createdAt}
                />
            )
          )}
          </div>

        <button onClick={() => this.previousPage()}>Previous Page</button>
        <button onClick={() => this.nextPage()}>Next Page</button>

        <p>Page Number: {this.state.pageNumber}</p>
        <button>Add</button> */}
      </div>
    )
  }

}

export default Home;
