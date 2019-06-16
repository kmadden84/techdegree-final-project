import React, { Component } from 'react';
import Courses from './components/Courses';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import CourseDetails from './components/CourseDetails';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import UserSignOut from './components/UserSignOut';
import NoResults from './components/NoResults';
import Forbidden from './components/Forbidden';

import Header from './components/Header';
import { Route, Switch, Redirect } from 'react-router-dom';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      emailAddress: "",
      password: "",
      firstName: "",
      lastName: "",
      loader: false,
      detailsLoader: ""
    }
    this.signIn = this.signIn.bind(this);
    this.clearState = this.clearState.bind(this);
  }
  signIn = (user, pass) => {
    this.setState({
      loader:true,
    });
    return new Promise((resolve, reject) => {
      fetch("http://localhost:5000/api/users", {
        method: "GET",
        mode: 'cors',
        headers: new Headers({
          'Authorization': 'Basic ' + btoa(user + ':' + pass)
        }),
      })
        .then((response) => {
          this.setState({
              loader:false,
          });
          if (response.status === 200) {
            this.setState({
              emailAddress: user,
              password: pass,
            });
            this.props.history.push("/");
          }
          response.json().then((responseJson) => {
            if (response.status === 401) {
              alert(responseJson.Error)
            }
            this.setState({
              firstName: responseJson["First Name"],
              lastName: responseJson["Last Name"]
            })

          })
        }).catch((error) => {
          reject(error);
          this.props.history.push("/error");
        })
    })
  }
  clearState = () => {
    this.setState({
      emailAddress: "",
      password: "",
      firstName: "",
      lastName: ""
    });
    this.props.history.push("/signin");
  }

  render(props) {

    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route {...rest} render={(props) => (
        this.state.emailAddress !== ""
          ? <Component {...props} password={this.state.password} user={this.state.emailAddress} />
          : <Redirect to='/signin' />
      )} />
    )
    return (
      <div>
        <Route path="*" render={(props) => <Header currentState={this.state} signout={this.clearState} {...props} />} />
        <Switch>
          <Route exact path="/" render={(props) => <Courses {...props} />} />
          <Route path="/signout" exact={true} render={(props) => <UserSignOut signout={this.clearState} {...props} />} />
          <Route path={`${this.props.match.path}signin`} render={(props) => <UserSignIn loader={this.state.loader} currentState={this.state} userdata={this.signIn} {...props} />} />
          <PrivateRoute path={`${this.props.match.path}courses/create`} component={CreateCourse} />
          <PrivateRoute exact path={`${this.props.match.path}courses/:id/update`} component={UpdateCourse} />
          <Route exact path={`${this.props.match.path}courses/:id`} render={(props) => <CourseDetails password={this.state.password} user={this.state.emailAddress} {...props} />} />
          <Route exact path={`${this.props.match.path}signup`} render={(props) => <UserSignUp userdata={this.signIn} {...props} />} />
          <Route exact path='/forbidden' exact={true} component={Forbidden} />
          <Route path='/error' exact={true} component={Error} />
          <Route path='*' exact={true} component={NoResults} />
        </Switch>
      </div>
    );
  }
}

export default App;
