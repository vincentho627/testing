import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { PDFJS as PDFJSViewer } from "pdfjs-dist/web/pdf_viewer.js";
import axiosNoTokensInstance from '../network-request/axiosNoTokensInstance';
import "../css/viewer.css";
import "pdfjs-dist/web/pdf_viewer.css";

class Viewer extends Component {

  registerView;

  constructor(props) {
    super(props);
    this.state = {
      doc: null,
      scale: null,
      lastScrollTop: 0
    };
    this.initEventBus();
    this.viewer = React.createRef();
  }

  initEventBus() {
    let eventBus = new PDFJSViewer.EventBus();
    eventBus.on("pagesinit", (e) => {
      this.setState({
        scale: this._pdfViewer.currentScale,
      });
      if (this.props.onInit) {
        this.props.onInit({});
      }
      //   if (this.props.onScaleChanged) {
      //     this.props.onScaleChanged({scale: this.state.scale});
      //   }
    });
    // eventBus.on('scalechange', (e) => {
    //   if (this.props.onScaleChanged) {
    //     this.props.onScaleChanged({scale: e.scale});
    //   }
    // });
    eventBus.on("pagechanging", (e) => {
      this.pageChange(e);
    });

    //do not change callback to an arrow function or the event will not be fired
    const thisBinding = this
    eventBus.on("pagesloaded", function (e) {
      const width = e.source.container.scrollWidth;
      let percentageWidth = (width / 1680) * 100;
      document.getElementsByClassName(
        "spacer-left"
      )[0].style.width = `${percentageWidth}%`;
      document.getElementsByClassName(
        "pdf-app-body"
      )[0].style.width = `${percentageWidth}%`;
      if (thisBinding.viewer.current) thisBinding.viewer.current.classList.add("fade-in")
      const widthOfViewer =  window.innerWidth/2;
      console.log(e.source._pages)
      const pages = e.source._pages
      for (const page in pages) {
        pages[page].div.classList.add("magic-shadow")
      }
      console.log(pages[0].width)
      thisBinding.zoom({widthOfViewer: widthOfViewer})
      if (pages[0].width) thisBinding.setViewportWidth({width: pages[0].width})
      thisBinding.registerView = setTimeout(function(){
        // alert('ok')
        axiosNoTokensInstance.post('/pdf/register-view/', {fileId: thisBinding.props.fileId})
       }, 5000);
    });

    this._eventBus = eventBus;
  }

  pageChange = (e) => {
    if (this.props.onPageChange) {
      this.props.onPageChange(e);
    }
    clearTimeout(this.registerView)
    const thisBinding = this
    this.registerView = setTimeout(function(){
      // alert("ok")
      axiosNoTokensInstance.post('/pdf/register-view/', {fileId: thisBinding.props.fileId})
     }, 5000);

  };

  zoom(e) {
    if (this.props.onZoom) {
      this.props.onZoom(e);
    }
  }

  setViewportWidth(e) {
    if (this.props.setViewportWidth) {
      this.props.setViewportWidth(e);
    }
  }

  componentDidMount() {
    let viewerContainer = ReactDOM.findDOMNode(this);
    this._pdfViewer = new PDFJSViewer.PDFViewer({
      container: viewerContainer,
      eventBus: this._eventBus,
      removePageBorders: true,
    });
    this._pdfViewer._currentPageNumber = this.props.pageNumber;
    window.addEventListener("resize", (e)=>{
      const widthOfViewer = this.props.pdfApp.offsetWidth;
      this.zoom({widthOfViewer: widthOfViewer})
    })

    // this.viewer.current.addEventListener("scroll", () => { 
    //    const st = this.viewer.current.scrollTop; 
    //    const lastScrollTop = this.state.lastScrollTop;
    //   //  console.log(st)
    //    if (st > this.state.referenceScrollTop){
    //       // downscroll code
    //       if (st-lastScrollTop > 80) {
    //         this.setState({lastScrollTop: st})
    //         document.getElementsByClassName("contain")[0].style.top = '0';
    //         document.getElementsByClassName("navbar")[0].style.top = '-58px';
    //       }
    //    } else {
    //       // upscroll code
    //       this.setState({lastScrollTop:st})
    //       document.getElementsByClassName("contain")[0].style.top = '58px';
    //       document.getElementsByClassName("navbar")[0].style.top = '0';
    //    }
    //    this.setState({referenceScrollTop: st <= 0 ? 0: st}); // For Mobile or negative scrolling
    // }, false);

  }

  componentWillUnmount() {
    window.removeEventListener("resize", (e) => {
      console.log(e);
    });
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.doc !== nextState.doc) {
      this._pdfViewer.setDocument(nextState.doc);
    }
    if (this.state.scale !== nextState.scale) {
      this._pdfViewer.currentScale = nextState.scale;
      //use this line to set original pdf size
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.doc !== nextState.doc ||
      this.state.scale !== nextState.scale
    ) {
      return true;
    }
    return false;
  }
  render() {
    return (
      <div className="Viewer" ref={this.viewer}>
        <div className="pdfViewer"/>
      </div>
    );
  }
}

Viewer.propTypes = {
  onInit: PropTypes.func,
  onScaleChanged: PropTypes.func,
};

export default Viewer;
