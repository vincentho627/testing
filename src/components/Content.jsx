import React, { Component } from "react";
import "../css/workspace.css";
import "../css/colors.css";
import Switch from "@material-ui/core/Switch";
import { Button, Divider } from "@material-ui/core";
import axiosJsonInstance from "../network-request/axiosJsonInstance";
import Dialog from '@material-ui/core/Dialog';
import UploadPDF from './UploadPDF';

export default class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
        open: false,
        pdfList: []
    };
  }

  componentDidMount() {
    axiosJsonInstance.get("/pdf/get-my-pdfs/").then((res) => {
      const pdfList = res.data.PDFList;
      console.log(pdfList);
      this.setState({ pdfList: pdfList });
    });
  }

  goToPDF = (id) => {
    window.location.href = `/view?r=${id}`
  }

  handleClose = (e=null) => {
      if (e["data"]) {
          let pdfList = this.state.pdfList
          const newUpload = e["data"]
          newUpload["ratio"] = 1.0;
          newUpload["created_at"] = newUpload["created_at"].slice(0, 10).split('-').reverse().join('-')
          pdfList.push(newUpload)
          console.log(e)
          this.setState({pdfList: pdfList});
      }
      this.setState({open : false})
  }

  handleOpen = () => {
      this.setState({open: true})
  }

  render() {
    return (
      <div className="w-75 mx-auto grey-text mt-5 d-flex flex-column">
        <Button className="upload-btn ml-auto mt-5 mb-5 blue-workspace-bg text-light" onClick={this.handleOpen}>
          Upload
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
            <UploadPDF handleClose={(e)=> this.handleClose(e)}/>
        </Dialog>
        <div className="d-flex w-100 mb-2">
          <span className="content-title">Title</span>
          <span className="content-public">Public</span>
          <span className="content-views">Page Views</span>
          <span className="content-likes">Likes (to Dislike Ratio)</span>
          <span className="content-date">Date Uploaded</span>
        </div>
        <Divider />
        {this.state.pdfList &&
          this.state.pdfList.map((pdf) => (
            <button className="d-flex w-100 align-items-center unbtn mt-2" onClick={()=>this.goToPDF(pdf.id)}>
              <span className="content-title">{pdf.title}</span>
              <span className="content-public">
                <Switch
                  className="negative-switch-margin"
                  checked={pdf.public}
                  color="green"
                  //   name="isAnonymous"
                  inputProps={{ "aria-label": "primary checkbox" }}
                />
              </span>
              <span className="content-views">{pdf.views}</span>
              <span className="content-likes">{pdf.ratio} ({pdf.likes} Likes)</span>
              <span className="content-date">{pdf.created_at}</span>
            </button>
          ))}
      </div>
    );
  }
}
