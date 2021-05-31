import React, { Component } from "react";
import PropTypes from "prop-types";
import "../css/pdf.css";
import axiosNoTokensInstance from "../network-request/axiosNoTokensInstance";
import Viewer from "./Viewer";
// import Toolbar from './Toolbar.js';
import pdfjsLib from "pdfjs-dist/webpack";

class PDFApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: this.props.pageNumber,
      btnHover: "double-click to enter fullscreen",
      btnClassList: "pdf-app-body",
      resize: false,
      viewportWidth: null,
    };
    this.viewer = React.createRef();
    this.pdfApp = React.createRef();
    this.exitFullscreen = this.exitFullscreen.bind(this);
  }

  componentDidMount() {
    axiosNoTokensInstance
      .get("/pdf/fetch/", {
        params: {
          fileId: this.props.fileId,
        },
        responseType: "blob",
      })
      .then((res) => {
        const file = new Blob([res.data], { type: "application/pdf" });
        const fileUrl = URL.createObjectURL(file);
        console.log(fileUrl);
        let loadingTask = pdfjsLib.getDocument(fileUrl);
        loadingTask.promise.then(
          (doc) => {
            console.log(
              `Document ${this.props.url} loaded ${doc.numPages} page(s)`
            );
            if (this.state.pageNumber > doc.numPages) {
              this.setState({ pageNumber: doc.numPages });
            }
            this.docRendered(doc);
            this.setState({ rendered: true });
            this.viewer.setState({
              doc,
            });
          },
          (reason) => {
            console.error(`Error during ${this.props.url} loading: ${reason}`);
          }
        );
      });
    [
      "fullscreenchange",
      "webkitfullscreenchange",
      "mozfullscreenchange",
      "msfullscreenchange",
    ].forEach((eventType) =>
      document.addEventListener(eventType, this.exitFullscreen, false)
    );
    // );

    document.addEventListener("mousemove", (e) => {
      this.handleMouseMove(e);
    });

    document.addEventListener("mouseup", (e) => {
      this.handleMouseUp();
    });
  }

  componentWillUnmount() {
    const doc = document;
    [
      "fullscreenchange",
      "webkitfullscreenchange",
      "mozfullscreenchange",
      "msfullscreenchange",
    ].forEach((eventType) =>
      doc.removeEventListener(eventType, this.exitFullscreen, false)
    );

    document.removeEventListener("mousemove", (e) => {
      this.handleMouseMove(e);
    });

    document.removeEventListener("mouseup", (e) => {
      this.handleMouseUp();
    });
  }

  onZoom(e) {
    const customWidth = this.state.viewportWidth;
    const scale = e["widthOfViewer"] / (customWidth? customWidth:840);
    if (this.viewer) {
      this.viewer.setState({
        // scale: this.viewer.state.scale / 1.01,
        scale: scale,
      });
    }
  }

  docRendered = (e) => {
    if (this.props.onDocRendered) {
      this.props.onDocRendered(e);
    }
  };

  onPageChange = (e) => {
    if (this.props.onPageChange) {
      this.props.onPageChange(e);
    }
  };

  exitFullscreen = () => {
    if (
      !document.fullscreenElement &&
      !document.webkitFullscreenElement &&
      !document.mozFullScreenElement &&
      !document.msFullscreenElement
    ) {
      this.pdfApp.current.classList.remove("fullscreen");
      this.pdfApp.current.setAttribute(
        "title",
        "double-click to enter fullscreen"
      );
    }
  };

  requestFullScreen = (e) => {
    const element = e.currentTarget;

    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    ) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      element.classList.remove("fullscreen");
      element.setAttribute("title", "double-click to enter fullscreen");
    } else {
      console.log("ojf");
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
      element.classList.add("fullscreen");
      element.setAttribute("title", "double-click to exit fullscreen");
    }
  };

  handleMouseDown = (e) => {
    this.setState({ resize: true });
  };

  handleMouseUp = (e) => {
    this.setState({ resize: false });
  };

  handleMouseMove = (e) => {
    if (this.state.resize) {
      console.log(document.body.clientWidth);
      console.log(e.clientX / document.body.clientWidth);
      const newPercentageWidth = (100 * e.clientX) / document.body.clientWidth;
      // && newPercentageWidth < 70
      if (newPercentageWidth > 35) {
        this.pdfApp.current.style.width = `calc(${newPercentageWidth}% - 2rem)`;
        this.props.onResize(newPercentageWidth);
        this.onZoom({widthOfViewer: this.pdfApp.current.offsetWidth})
      }
    }
  };

  onSetViewportWidth = (e) => {
    this.setState({viewportWidth: e["width"]})
  }

  render() {
    return (
      <div
        ref={this.pdfApp}
        className="pdf-app-body"
        title="double-click to enter fullscreen"
        onDoubleClick={this.requestFullScreen}
      >
        {this.state.rendered && (
          <Viewer
            fileId={this.props.fileId}
            pageNumber={this.state.pageNumber}
            onPageChange={(e) => this.onPageChange(e)}
            onZoom={(e) => this.onZoom(e)}
            setViewportWidth={(e)=> this.onSetViewportWidth(e)}
            ref={(ref) => (this.viewer = ref)}
            pdfApp={this.pdfApp.current}
            // ref={this.viewer}
            onScaleChanged={(e) => this.displayScaleChanged(e)}
          />
        )}
        <div
          className="resize-bar"
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
        ></div>
      </div>
    );
  }
}

PDFApp.propTypes = {
  url: PropTypes.string,
};

export default PDFApp;
