import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import SignInWidget from './signinwidget';
import { withAuth } from '@okta/okta-react';

export default withAuth(
  class Login extends Component {
    constructor(props) {
      super(props);

      this.state = {
        authenticated: null,
      };
      this.checkAuthentication();
    }

    async checkAuthentication() {
      const authenticated = await this.props.auth.isAuthenticated();
      if (authenticated !== this.state.authenticated) {
        this.setState({ authenticated });
      }
    }

    componentDidUpdate() {
      this.checkAuthentication();
    }

    onSuccess = res => {
      if (res.status === 'SUCCESS') {
        return this.props.auth.redirect({
          sessionToken: res.session.token,
        });
      } else {
        // The user can be in another authentication state that requires further action.
        // For more information about these states, see:
        //   https://github.com/okta/okta-signin-widget#rendereloptions-success-error
      }
    };

    onError = err => {};

    render() {
      if (this.state.authenticated === null) return null;
      return this.state.authenticated ? (
        <Redirect to={{ pathname: '/' }} />
      ) : (
        <SignInWidget
          baseUrl={this.props.baseUrl}
          onSuccess={this.onSuccess}
          onError={this.onError}
        />
      );
    }
  }
);
