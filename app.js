import React, { Component } from 'react';
import Login from './components/login';
import Comments from './components/comments/list';

export default class App extends Component {

  state = {
    user: undefined, // not logged in yet
  };

  // Gets called after user logs in with Facebook or Google
  onLoggedIn = (user) => {
    this.setState({ user });
  };

  render() {
    const { user } = this.state;
    return user
      // Show comments if user is logged in
      ? <Comments user={user} />
      // Show login screen otherwise
      : <Login onLoggedIn={this.onLoggedIn} />;
  }
}
