import React, {Component} from "react";
import pdfjsLib from "pdfjs-dist/webpack";
import axiosFormInstance from '../network-request/axiosFormInstance';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {DropzoneDialog} from "material-ui-dropzone";
import "../css/workspace.css";

const name = "Filename: "

export default class UploadPDF extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      file: null,
      public: true,
      open: false,
      filename: ''
    }
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSave = files => {
    const file = files[0];
    console.log(file);
    const fileUrl = URL.createObjectURL(file);
    pdfjsLib.getDocument(fileUrl).then((doc) => {
      this.setState({file: file, numberOfPages: doc.pdfInfo.numPages, open: false, filename: file.name})
    })
  };

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    })
    console.log(this.state)
  };

  handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log(file);
    const fileUrl = URL.createObjectURL(file);
    pdfjsLib.getDocument(fileUrl).then((doc) => {
      this.setState({file: file, numberOfPages: doc.pdfInfo.numPages})
    })
  };

  handleAdd = (event) => {
    console.log(event.target.files)
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state);
    let formData = new FormData();
    formData.append('file', this.state.file, this.state.file.name);
    formData.append('title', this.state.title);
    formData.append('description', this.state.description);
    formData.append('number_of_pages', this.state.numberOfPages);
    formData.append('public', this.state.public);
    axiosFormInstance.post("/pdf/fetch/", formData).then(res => {
      this.props.handleClose({"data": res["data"]})
      this.setState({
        title: '',
        description: '',
        file: null,
        filename: '',
        public: true
      });
    }).catch(err => console.log(err));
  };

  render() {
    return (<div className="d-flex justify-content-center">
      <div className="form-container">
        <h2>Upload your content</h2><br/>
        <form onSubmit={this.handleSubmit} className="d-flex flex-column">
          <TextField id="title" label="Title" variant="outlined" value={this.state.title} onChange={this.handleChange} required="required"/><br/>
          <TextField id="description" label="Description" variant="outlined" value={this.state.description} onChange={this.handleChange} required="required"/><br/>
          <p>{name + this.state.filename}</p><br/>
          <Button variant="contained" className="choose-button" onClick={this.handleOpen}>
            Choose File
          </Button><br/>
          <DropzoneDialog filesLimit="1" open={this.state.open} onSave={this.handleSave} acceptedFiles={["application/pdf"]} showPreviews={true} maxFileSize={5000000} onClose={this.handleClose} cancelButtonText={"Cancel"} submitButtonText={"Save"} showFileNamesInPreview={true} dialogTitle={"PDF File Upload"} dropzoneText={"Drop or upload your PDF"}/>
          <Button variant="contained" color="primary" type="submit" value="Submit">Submit</Button>
        </form>
      </div>

    </div>);
  }
}
