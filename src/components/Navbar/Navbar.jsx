import React, { useRef } from "react";
import Popover from "@material-ui/core/Popover";
import IconButton from "@material-ui/core/IconButton";
import NotificationsIcon from "@material-ui/icons/Notifications";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ProfilePopover from "./ProfilePopover";
import { connect } from "react-redux";
import { Button } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import "../../css/navbar.css";
import "../../css/colors.css";
import { withRouter, Link } from "react-router-dom";
import { useHistory } from "react-router";
import axiosNoTokensInstance from "../../network-request/axiosNoTokensInstance";
import LinearProgress from '@material-ui/core/LinearProgress';

function Navbar({ isLoggedIn, isLoading, onSearch, ownProps }) {
  const history = useHistory();
  const [anchorProfile, setAnchorProfile] = React.useState(null);
  const [anchorNotification, setAnchorNotification] = React.useState(null);
  const [searchSuggestions, setSearchSuggestions] = React.useState(null);
  const inputEl = useRef(null);
  const [progress, setProgress] = React.useState(0);
  const location = ownProps.location.pathname.split("/")[1];
  let selectedIndex = -1;

  const handleProfileClick = (event) => {
    setAnchorProfile(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorProfile(null);
  };

  const handleNotificationClick = (event) => {
    setAnchorNotification(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorNotification(null);
  };

  const handleLoginClick = () => {
    window.location.href = "/login/";
  };

  const handleChange = (event) => {
    if (event.target.value.trim().length === 0) {
      setSearchSuggestions(null);
      // document.removeEventListener("keydown", (e)=>{
      //   // manageHighlightSuggestion(e)
      // })
      document.removeEventListener("mousedown", (e)=>{
        hideSearchResults(e)
      })
      return;
    }
    axiosNoTokensInstance
      .get("/pdf/search-suggestions/", {
        params: {
          query: event.target.value,
        },
      })
      .then((res) => {
        const suggestions = res["data"]["search_suggestions"]
        console.log(suggestions)
        setSearchSuggestions(suggestions);
        // document.addEventListener("keydown", (e)=>{
        //   console.log(suggestions)
        //   // manageHighlightSuggestion(e)
        // })
        document.addEventListener("mousedown", (e)=> {
          hideSearchResults(e)
        })
      });
  };
 
  const hideSearchResults = (e) => {
    if (e.target.tagName.toLowerCase() === "button") return;
    if (e.target.placeholder !== "Search") {
      setSearchSuggestions(null)
      document.removeEventListener("mousedown", (e)=>{
        hideSearchResults(e)
      })
    }
  }

  // const manageHighlightSuggestion = (e) => {
  //         console.log(searchSuggestions)
  //         if (searchSuggestions === null) {
  //           console.log("IUWHERGJQEURIWFRJ")
  //           return;
  //         }
  //         console.log(e.key)
  //         if (e.key === "ArrowDown") {
  //           if (selectedIndex !== -1) searchSuggestions[selectedIndex]["highlighted"] = false;
  //           selectedIndex++;
  //           if (selectedIndex > searchSuggestions.length-1) selectedIndex = 0;
  //           console.log(selectedIndex)
  //         } else if (e.key === "ArrowUp") {
  //           if (selectedIndex !== -1) searchSuggestions[selectedIndex]["highlighted"] = false;
  //           selectedIndex--;
  //           if (selectedIndex < 0) selectedIndex = searchSuggestions.length-1;
  //         }
  //         const newSuggestions = searchSuggestions;
  //         newSuggestions[selectedIndex]["highlighted"] = true;
  //         setSearchSuggestions(newSuggestions)
  //         console.log(selectedIndex);
  // }

  const timer = () => { 
    setInterval(() => {
    setProgress((oldProgress) => {
      // if (oldProgress === 100) {
      //   return 0;
      // }
      const diff = Math.random() * 10;
      return Math.min(oldProgress + diff, 100);
    });
  }, 50);
  }

  React.useEffect(() => {
    console.log("ok")
    if (isLoading) timer()
  }, [isLoading]);



  const goToSearch = (event) => {
    let searchQuery = event.target.innerHTML;
    inputEl.current.value = searchQuery;
    searchQuery = replaceSpaces(searchQuery.trim());
    setSearchSuggestions(null);
    onSearch(searchQuery);
    history.push(`search?search_query=${searchQuery}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      let searchQuery = e.target.value;
      if (searchQuery.trim().length === 0) return;
      searchQuery = replaceSpaces(searchQuery.trim());
      setSearchSuggestions(null);
      inputEl.current.blur();
      onSearch(searchQuery);
      history.push(`search?search_query=${searchQuery}`);
    }
  };

  const handleSearchButtonClick = () => {
    let searchQuery = inputEl.current.value;
    if (searchQuery.trim().length === 0) return;
    searchQuery = replaceSpaces(searchQuery.trim());
    setSearchSuggestions(null);
    inputEl.current.blur();
    onSearch(searchQuery);
    history.push(`search?search_query=${searchQuery}`);
  };

  const replaceSpaces = (query) => {
    let result = "";
    for (let i = 0; i < query.length; i++) {
      if (query[i] === " ") {
        if (result[result.length - 1] === "+") {
          continue;
        } else {
          result += "+";
        }
      } else {
        result += query[i];
      }
    }
    if (result[result.length - 1] === "+") result = result.slice(0, -1);
    return result;
  };

  const openProfile = Boolean(anchorProfile);
  const profileId = openProfile ? "popover-profile" : undefined;

  const openNotification = Boolean(anchorNotification);
  const notificationId = openNotification ? "popover-notification" : undefined;

  return (
    <nav className={"navbar fixed-top navbar-default d-flex flex-column navbar-expand navbar-dark bg-white "+ (location==="room" && "bottom-shadow")}>
      <div className="d-flex justify-content-between align-items-center w-100">
      {location === "room" ? <Link className="name" to="/room">Room</Link> : <Link className="name" to="/">Name</Link>}
      {location !== "room" && (
        <div className="d-flex input-div grey-border position-relative">
          <input
            ref={inputEl}
            onKeyDown={handleKeyDown}
            className="flex-grow-1 pt-1 pb-1 pl-3 pr-3 position-relative"
            onChange={handleChange}
            onFocus={handleChange}
            placeholder="Search"
          />
          <div className="search-results bg-white">
            {searchSuggestions && (
              <div className="d-flex flex-column">
                {" "}
                <div className="pt-1 pb-1 pl-3 pr-3"></div>
                {searchSuggestions.map((searchSuggestion) => (
                  <button
                    onClick={goToSearch}
                    className="pt-1 pb-1 pl-3 pr-3 result"
                  >
                    {searchSuggestion.suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="search-btn" onClick={handleSearchButtonClick}>
            <SearchIcon className="grey-text"></SearchIcon>
          </button>
        </div>
      )}
      {isLoggedIn ? (
        <div className="collapse navbar-collapse mr-4 flex-grow-0">
          {" "}
          <ul className="navbar-nav ml-auto mt-0">
            {location !== "room" && (
              <li className="nav-item">
                <IconButton onClick={handleNotificationClick}>
                  <NotificationsIcon />
                </IconButton>
                <Popover
                  elevation={0}
                  id={notificationId}
                  open={openNotification}
                  anchorEl={anchorNotification}
                  onClose={handleNotificationClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                ></Popover>
              </li>
            )}
            <li className="nav-item">
              <IconButton onClick={handleProfileClick}>
                <AccountCircleIcon />
              </IconButton>
              <Popover
                elevation={0}
                id={profileId}
                open={openProfile}
                anchorEl={anchorProfile}
                onClose={handleProfileClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <ProfilePopover />
              </Popover>
            </li>
          </ul>
        </div>
      ) : (
        <div className="collapse navbar-collapse mr-4 flex-grow-0">
          <ul className="navbar-nav ml-auto mt-0">
            <li className="nav-item">
              <Button onClick={handleLoginClick}>login</Button>
            </li>
          </ul>
        </div>
      )}
      </div>
      <div className="position-relative">
        <LinearProgress variant="determinate" value={progress} className={"progress-bar " + (isLoading? "": "hide")}/>
      </div>
    </nav>
  );
}

function mapStateToProps(state, ownProps) {
  return { isLoggedIn: state.isLoggedIn, isLoading: state.isLoading, ownProps, ownProps };
}

export default withRouter(connect(mapStateToProps)(Navbar));
