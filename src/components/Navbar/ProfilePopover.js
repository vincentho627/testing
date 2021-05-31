import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import FeedbackIcon from "@material-ui/icons/Feedback";
import "../../css/colors.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserSecret, faFeatherAlt } from "@fortawesome/free-solid-svg-icons";
import Switch from "@material-ui/core/Switch";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { connect } from "react-redux";
import { anonymous, notAnonymous } from "../../actions/anonymousAction";
import { logout } from "../../actions/loginAction";
import axiosJsonInstance from "../../network-request/axiosJsonInstance";
import {loading} from '../../actions/loadingAction';

import { withRouter } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 500,
    backgroundColor: theme.palette.background.paper,
    width: "300px",
    border: "1px solid rgba(1, 1, 1, 0.1)",
    color: "rgba(1, 1, 1, 0.65)",
  },
  fontAwesomeIcon: {
    width: "1em",
    height: "1em",
    display: "inline-block",
    fontSize: "1.5rem",
  },
}));

function ProfilePopover({ isAnonymous, isLoggedIn, ownProps, dispatch }) {
  const classes = useStyles();
  const location = ownProps.location.pathname.split("/")[1];

  const [state, setState] = React.useState({
    isAnonymous: isAnonymous,
  });

  const handleChange = (event) => {
    if (state.isAnonymous) {
      axiosJsonInstance
        .post("/auth/anonymous/", { isAnonymous: false })
        .then((res) => {
          localStorage.setItem("isAnonymous", "false");
          dispatch(notAnonymous());
        });
    } else {
      axiosJsonInstance
        .post("/auth/anonymous/", { isAnonymous: true })
        .then((res) => {
          localStorage.setItem("isAnonymous", "true");
          dispatch(anonymous());
        });
    }
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const signOut = (event) => {
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("id");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("isAnonymous");
    dispatch(logout());
    window.location.href = '/';
  };

  const goToWorkspace = () => {
    window.location.href = "/room";
  };

  const goToHome = () => {
    window.location.href = "/";
  };

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="main mailbox folders">
        <ListItem button>
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText
            primary={localStorage.getItem("username")}
            secondary={localStorage.getItem("email")}
          />
        </ListItem>
      </List>
      <Divider />
      <List component="nav" aria-label="main mailbox folders">
        {location === "room" ? (
          <ListItem button onClick={goToHome}>
            <ListItemIcon>
              <FontAwesomeIcon
                className={classes.fontAwesomeIcon}
                icon={faFeatherAlt}
              />
            </ListItemIcon>
            <ListItemText primary="Name" />
          </ListItem>
        ) : (
          <ListItem button onClick={goToWorkspace}>
            <ListItemIcon>
              <FontAwesomeIcon
                className={classes.fontAwesomeIcon}
                icon={faFeatherAlt}
              />
            </ListItemIcon>
            <ListItemText primary="Room" />
          </ListItem>
        )}
      </List>
      <Divider />
      <List component="nav" aria-label="main mailbox folders">
        <ListItem>
          <ListItemIcon>
            <FontAwesomeIcon
              className={classes.fontAwesomeIcon}
              icon={faUserSecret}
            />
          </ListItemIcon>
          <ListItemText primary="Anomymous Mode" />
          <ListItemSecondaryAction>
            <Switch
              checked={state.isAnonymous}
              onChange={handleChange}
              name="isAnonymous"
              inputProps={{ "aria-label": "secondary checkbox" }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <FeedbackIcon />
          </ListItemIcon>
          <ListItemText primary="Send Feedback" />
        </ListItem>
      </List>
      <Divider />
      <List component="nav" aria-label="secondary mailbox folders">
        <ListItem button>
          <ListItemText
            primary="Sign out"
            className="text-center red-bg text-light pt-1 pb-1"
            onClick={signOut}
          />
        </ListItem>
      </List>
    </div>
  );
}

function mapStateToProps(state, ownProps) {
  return {
    isAnonymous: state.isAnonymous,
    isLoggedIn: state.isLoggedIn,
    ownProps: ownProps,
  };
}

export default withRouter(connect(mapStateToProps)(ProfilePopover));
