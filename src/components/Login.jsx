import React, { Component } from "react";
import "../css/auth.css";
import { Link } from "react-router-dom";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { login } from "../actions/loginAction";
import { connect } from "react-redux";
import axiosNoTokensInstance from "../network-request/axiosNoTokensInstance";
import { notAnonymous, anonymous } from "../actions/anonymousAction";

class Login extends Component {
  state = {
    showPassword: false,
    password: "",
    input: "",
    error: false,
  };

  handlePasswordChange = (prop) => (event) => {
    const input = event.nativeEvent.data;
    let password = this.state.password;
    if (input !== null) {
      password += input;
      this.setState({ password: password });
    } else {
      if (this.state.password.length !== 0) {
        password = password.slice(0, -1);
        this.setState({ password: password });
      }
    }
  };

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  inputFieldDidChange = (event) => {
    this.setState({ input: event.target.value });
  };

  post = () => {
    let data = {
      password: this.state.password,
    };
    if (this.state.input.includes("@")) {
      data["email"] = this.state.input;
    } else {
      data["username"] = this.state.input;
    }


    axiosNoTokensInstance.post("/auth/login/", data).then((res) => {
      console.log(res)
      const refreshToken = res["data"].tokens.refresh;
      localStorage.setItem("access_token", res["data"].tokens.access);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("username", res.data["username"])
      localStorage.setItem("id", res.data["id"])
      localStorage.setItem("email", res.data["email"])
      localStorage.setItem("isAnonymous", res.data["anonymous_mode"].toString())
      this.props.dispatch(login());
      // this.props.dispatch()
      res.data["anonymous_mode"] ? this.props.dispatch(anonymous()) : this.props.dispatch(notAnonymous())
    });
  };

  render() {
    return (
      <form
        className="center-horizontal mt-5 form-radius border form-padding"
        style={{ width: "20%", minWidth: "500px" }}
      >
        <h3 className="mb-4">Login</h3>
        <div className="form-group">
          <FormControl className="w-100" variant="outlined">
            <TextField
              onChange={this.inputFieldDidChange}
              id="outlined-basic"
              label="Username or Email"
              variant="outlined"
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
        <div className="form-group d-flex justify-content-between align-items-center">
          <p className="m-0 light-font">
            Don't have an account?
            <Link className="ml-1" to="/signup/">
              Create one.
            </Link>
          </p>
          <Button
            className="pt-2 pb-2 pr-4 pl-4"
            onClick={this.post}
            disabled={
              this.state.input.length > 0 && this.state.password.length > 0
                ? null
                : true
            }
          >
            Login
          </Button>
        </div>
      </form>
    );
  }
}

const mapStateToProps = (state) => {
  return { isLoggedIn: state.isLoggedIn, isAnonymous: state.isAnonymous };
};

export default connect(mapStateToProps)(Login);
