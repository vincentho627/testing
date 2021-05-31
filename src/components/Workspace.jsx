import React, { Component } from "react";
import UploadPDF from "./UploadPDF";
import Navbar from "./Navbar/Navbar";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import CreateIcon from '@material-ui/icons/Create';
import MailIcon from "@material-ui/icons/Mail";
import "../css/workspace.css";
import "../css/colors.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Content from "./Content";

export default class Workspace extends Component {
  render() {
    return (
      <Router>
        <div style={{ width: "100%", height: "100%"}} className="d-flex">
          <Navbar/>
          <div className="d-flex content mt-2 flex-grow-1">
            <div className="drawer grey-text">
              <div className="d-flex flex-column align-items-center mt-4 mb-3">
                <div className="workspace-user-profile" />
                <div className="grey-text mt-3">
                  {localStorage.getItem("username")}
                </div>
              </div>
              <List>
                <Link to="/room/content" className="grey-text text-decoration-none">
                  <ListItem button>
                    <ListItemIcon>
                      <CreateIcon />
                    </ListItemIcon>
                    <ListItemText primary="Content" />
                  </ListItem>
                </Link>
              </List>
              <Divider />
            </div>
            <main className="flex-grow-1 less-white-bg" style={{overflow: "scroll"}}>
              <Switch>
                <Route exact path="/room/content">
                  <Content/>
                </Route>
              </Switch>
            </main>
          </div>
        </div>
      </Router>
    );
  }
}
