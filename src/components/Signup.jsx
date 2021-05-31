import React, { Component } from "react";
import "../css/auth.css";
import { Link} from "react-router-dom";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import {login} from '../actions/loginAction';
import { connect } from "react-redux";
import axiosNoTokensInstance from "../network-request/axiosNoTokensInstance";



// todo: display error messages for username, email and password

class Signup extends Component {
  
  state = {
    showPassword: false,
    password: "",
    confirm: "",
    name: "",
    email: "",
    username: "",
    error: false,
    validPassword: false,
    emailError: false,
    usernameError: false
  };

  handlePasswordChange = (prop) => (event) => {
    const input = event.target.value;
    
    this.setState({validPassword: (input===this.state.confirm), password: input})
  };

  handleConfirmPasswordChange = (prop) => (event) => {
    const input = event.target.value;
    this.setState({validPassword: (input===this.state.password), confirm: input})
  };

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  textFieldDidChange = (event) => {
    this.setState({ name: event.target.value });
  };

  emailFieldDidChange = (event) => {
    const input = event.target.value;
    if (event.nativeEvent.data === " ") {
      event.target.value = input.substr(0, input.length - 1);
      return;
    }
    this.setState({ email: input });
    if (input.length!==0) {
      const data = {
        "email": input
      }
      fetch(`${process.env.REACT_APP_API_DEV_LINK}auth/validate-email/`, {
        method: 'POST',
        body: JSON.stringify(data)
      }).then(res=>{
        let error = false;
        if (res.status === 500) error = true;
        this.setState({emailError: error})
      }).catch(e=>{
        //enable button anyway if validation request fails
        console.log("email error false")
        this.setState({emailError: false})
      })
    }
  };

  usernameFieldDidChange = (event) => {
    const input = event.target.value;
    if (event.nativeEvent.data === " ") {
      event.target.value = input.substr(0, input.length - 1);
      return;
    }
    this.setState({ username: input });
    if (input.length!==0) {
      const data = {
        "username": input
      }
      fetch(`${process.env.REACT_APP_API_DEV_LINK}auth/validate-username/`, {
        method: 'POST',
        body: JSON.stringify(data)
      }).then(res=>{
        let error = false;
        if (res.status === 500) error = true;
        this.setState({usernameError: error})
      }).catch(e=>{
        //enable button anyway if validation request fails
        console.log("username error false")
        this.setState({usernameError: false})
      })
    }
  };

  post = () => {
    const data = {
      "name": this.state.name.trim(),
      "email": this.state.email.trim(),
      "username": this.state.username.trim(),
      "password": this.state.password
    }

    axiosNoTokensInstance.post(`/auth/createaccount/`, data).then(res=>{
      console.log(res)
      localStorage.setItem("access_token", res["data"].tokens.access);
      localStorage.setItem("refresh_token", res["data"].tokens.refresh);
      localStorage.setItem("username", res.data["username"])
      localStorage.setItem("id", res.data["id"])
      localStorage.setItem("email", res.data["email"])
      this.props.dispatch(login())
    })
  };

  render() {
    return (
      <form className="form-radius border form-padding center-horizontal mt-5" style={{ width: "20%", minWidth: "500px" }}>
        <h3 className="mb-4">Create your account</h3>
        <div className="form-group d-flex justify-content-between">
          <FormControl className="" variant="outlined" style={{ width: "39%" }}>
            <TextField
              onChange={this.textFieldDidChange}
              id="outlined-basic"
              label="Name"
              variant="outlined"
            />
          </FormControl>
          <FormControl className="" variant="outlined" style={{ width: "59%" }}>
            <TextField
              onChange={this.emailFieldDidChange}
              id="outlined-basic"
              label="Email"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CancelOutlinedIcon className={"transparent "+ (this.state.emailError? "item-fade-in": "item-fade-out")} color="secondary"/>
                  </InputAdornment>
                )
              }}
            />
          </FormControl>
        </div>
        <div className="form-group">
          <FormControl className="w-100" variant="outlined">
            <TextField
              onChange={this.usernameFieldDidChange}
              id="outlined-basic"
              label="Username"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CancelOutlinedIcon className={"transparent "+ (this.state.usernameError? "item-fade-in": "item-fade-out")} color="secondary"/>
                  </InputAdornment>
                )
              }}
            />
          </FormControl>
        </div>
        <div className="form-group">
          <FormControl className="w-100" variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={this.state.showPassword ? "text" : "password"}
              value={this.state.password}
              onChange={this.handlePasswordChange("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={this.handleClickShowPassword}
                    onMouseDown={this.handleMouseDownPassword}
                    edge="end"
                  >
                    {this.state.showPassword ? (
                      <Visibility />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={70}
            />
          </FormControl>
        </div>
        <div className="form-group">
          <FormControl className="w-100" variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Confirm Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={this.state.showPassword ? "text" : "password"}
              value={this.state.confirm}
              onChange={this.handleConfirmPasswordChange("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={this.handleClickShowPassword}
                    onMouseDown={this.handleMouseDownPassword}
                    edge="end"
                  >
                    {this.state.showPassword ? (
                      <Visibility />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={135}
            />
          </FormControl>
        </div>
        <div className="form-group d-flex justify-content-between align-items-center">
          <p className="m-0 light-font">
            Already have an account?
            <Link className="ml-1" to="/login/">
              Login.
            </Link>
          </p>
          <Button
            className="pt-2 pb-2 pr-4 pl-4"
            onClick={this.post}
            disabled={
              this.state.validPassword &&
              this.state.email.length > 0 &&
              this.state.username.length > 0 &&
              !this.state.usernameError &&
              !this.state.emailError
                ? null
                : true
            }
          >
            next
          </Button>
        </div>
      </form>
    );
  }
}

const mapStateToProps = state => {
  return { isLoggedIn: state.isLoggedIn };
};


export default connect(mapStateToProps)(Signup)