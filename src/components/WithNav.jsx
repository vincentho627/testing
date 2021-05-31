import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Reader from "./Reader";
import Navbar from "./Navbar/Navbar";
import SearchResults from "./SearchResults";
import Home from "./Home";
import Profile from "./Profile";

export default class WithNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: null,
    };
  }

  onSearch = (e) => {
    this.setState({ searchQuery: e });
  };

  render() {
    return (
      <Router>
        <div
          className="h-100 w-100"
          style={{
            // backgroundColor: "rgb(249, 249, 249)",
            position: "absolute",
            bottom: "0",
            top: "0",
            right: "0",
            left: "0",
          }}
        >
          <Navbar onSearch={(e) => this.onSearch(e)} />
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/view" component={Reader} />
            <Route
              path="/search"
              render={(props) => (
                <SearchResults
                  searchQuery={this.state.searchQuery}
                  onSearch={(e) => this.onSearch(e)}
                  {...props}
                />
              )} 
            />
            <Route path="/profile" component={Profile}/>
            <Route path="*">
              <h1>page not found</h1>
              <h1>page not found</h1>
              <h1>page not found</h1>
              <h1>page not found</h1>
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}
