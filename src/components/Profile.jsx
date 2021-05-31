import React, { Component } from 'react'
import axiosNoTokensInstance from '../network-request/axiosNoTokensInstance';

export default class Profile extends Component {
    componentDidMount () {
        const queryString = require("query-string");
        const userId = queryString.parse(this.props.location.search).user;
        axiosNoTokensInstance.get("/profile/user/", {
            params: { 
                userId: userId
            }
        }).then(res=>console.log(res))
    }

    render() {
        return (
            <div>
                profile page
            </div>
        )
    }
}
