import React, { Component } from "react";
import axiosNoTokensInstance from "../network-request/axiosNoTokensInstance";
import Result from "./Result";
import timeFromNow from "../utils/timeFromNow";
import "../css/result.css";

const queryString = require("query-string");

export default class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: null,
    };
  }

  componentDidMount() {
    const searchQuery = queryString.parse(this.props.location.search)
      .search_query;
    this.fetchResults(searchQuery);
  }

  componentDidUpdate(prevProps) {
    const searchQuery = queryString.parse(this.props.location.search)
      .search_query;
    if (searchQuery !== this.props.searchQuery || this.props.searchQuery !== prevProps.searchQuery)
      this.fetchResults(searchQuery);
  }

  fetchResults = (query) => {
    this.props.onSearch(query)
    axiosNoTokensInstance
      .get("/pdf/search-results/", {
        params: {
          query: query,
        },
      })
      .then((res) => {
        const searchResults = res["data"]["search_results"];
        for (let i = 0; i < searchResults.length; i++) {
          searchResults[i]["created_at"] = timeFromNow(
            searchResults[i]["created_at"]
          );
        }
        this.setState({
          searchResults: searchResults,
          numberOfResults: res["data"]["number_of_results"],
        });
      });
  };

  render() {
    return (
      <div style={{ marginTop: "2rem" }}>
        {this.state.numberOfResults && this.state.numberOfResults > 0 && (
          <div className="number-of-results mb-3">
            Showing {this.state.numberOfResults} results
          </div>
        )}
        <div className="search-container">
          {this.state.searchResults &&
            this.state.searchResults.map((result) => (
              <Result
                title={result.title}
                description={result.description}
                id={result.id}
                createdAt={result.created_at}
                views={result.views}
                authors={result.authors}
              />
            ))}
        </div>
      </div>
    );
  }
}
