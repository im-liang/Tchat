import React, { Component } from 'react';
import './Login.css';

class Login extends Component {


  render() {
    return (
      <div className="loginContainer">
        <form>
          <div className="group">
            <input type="text" required />
            <label>Username</label>
          </div>

          <div className="group">
            <input type="text" required />
            <label>Password</label>
          </div>
          <button>Log in</button>
        </form>
        <a className="registerButton" href="/register">Create an account</a>
      </div>
  );
  }
}

export default Login;
