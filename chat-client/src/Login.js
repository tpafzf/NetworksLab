import React from "react";
import "./App.css";

//this is easily the most bulky document, It handles both the markup and the functionality for frontend submission

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loginFields: {
        name: "user",
        pass: "test"
      },
      signupFields: {
        name: "user",
        pass: "test"
      },
      error: {
        display: false,
        message: null
      }
    };
  }

  componentWillUnmount() {
    this.setState({
      error: {
        display: false,
        message: null
      }
    });
  }


  //here is the render, which contains the structure for both login and signup 
  render() {
    return (
      <React.Fragment>
        <div className="LoginSignup">
          <div className="form-container">
            <strong>Login</strong>
            <br />
            <strong>Username:</strong> <br />{" "}
            <input
              type="text"
              name="name"
              placeholder="user"
              onChange={e => this.loginInputChangeHandler.call(this, e)}
              value={this.state.loginFields.username}
            />{" "}
            <br />
            <strong>Password:</strong> <br />{" "}
            <input
              type="password"
              name="pass"
              placeholder="********"
              onChange={e => this.loginInputChangeHandler.call(this, e)}
              value={this.state.loginFields.password}
            />{" "}
            <br />
            <button
              className="btn btn-primary"
              onClick={e => this.loginFormHandler(this.state.loginFields)}
            >
              Sign In
            </button>
          </div>
          <div className="form-container">
            <strong>Sign Up</strong>
            <br />
            <strong>Username:</strong> <br />{" "}
            <input
              type="text"
              name="name"
              placeholder="user"
              onChange={e => this.signupInputChangeHandler.call(this, e)}
              value={this.state.signupFields.username}
            />{" "}
            <br />
            <strong>Password:</strong> <br />{" "}
            <input
              type="password"
              name="pass"
              placeholder="********"
              onChange={e => this.signupInputChangeHandler.call(this, e)}
              value={this.state.signupFields.password}
            />{" "}
            <br />
            <button
              className="btn btn-primary"
              onClick={e => this.signupFormHandler(this.state.signupFields)}
            >
              Create Account
            </button>
          </div>
        </div>
        {this.state.error.display === false ? null : (
          <h5 className="errorMessage"> error: {this.state.error.message} </h5>
        )}
      </React.Fragment>
    );
  }

  //listener for when text field is changed in login 
  loginInputChangeHandler = e => {
    let loginFields = { ...this.state.loginFields };
    loginFields[e.target.name] = e.target.value;
    this.setState({
      loginFields
    });
  };
  //same thing but for signup info
  signupInputChangeHandler = e => {
    let signupFields = { ...this.state.signupFields };
    signupFields[e.target.name] = e.target.value;
    this.setState({
      signupFields
    });
  };

  //fetch request for logging in goes in the function below 
  //the front end does all of the form validation in this application 

  loginFormHandler = formFields => {
    fetch("http://localhost:17477/signin", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json"
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(formFields) // body data type must match "Content-Type" header
    }).then(res => {
      if (res.ok) {
        this.props.setUser(formFields);
      } else {
        this.setState({
          error: {
            display: true,
            message:
              "user may already be connected to socket, or invalid login credentials"
          }
        });
      }
    });
  };

  //here is the function for validating both login and signup forms
  checkValidity = formFields => {
      //checking for presence of a name and adequate length
    if (formFields.name === null || formFields.name.length >= 32) {
      this.setState({
          //if not valid, presents user with error message
        error: {
          display: true,
          message:
            "name(>32 characters) or password  (4 characters <= password <= 8 characters) is  not valid"
        }
      });
      return false;
    }
    //same as above, except with password now
    if (
      formFields.pass === null ||
      formFields.pass.length < 4 ||
      formFields.pass.length > 8
    ) {
      this.setState({
        error: {
          display: true,
          message:
            "name(>32 characters) or password  (4 characters <= password <= 8 characters) is  not valid"
        }
      });
      return false;
    }
    return true;
  };

  signupFormHandler = formFields => {
    if (this.checkValidity(formFields)) {
      fetch("http://localhost:17477/signup", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json"
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(formFields) // body data type must match "Content-Type" header
      }).then(res => {
        console.log(res);
        if (res.status === 200) {
          this.props.setUser(formFields);
          //if response is successful, calls back to App notifying that the form submission was successful and chat room should render
        } else {
            //else displays an error
          this.setState({
            error: {
              display: true,
              message:
                "user may already be connected to socket, or attempted signup already exists"
            }
          });
        }
      });
    }
  };
}

export default Login;
