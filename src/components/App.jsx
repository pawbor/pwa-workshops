import React, { Fragment, Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import List from "./List";
import EmptyPage from "./EmptyPage";
import TabBar from "./TabBar";
import ItemShow from "./ItemShow";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "./style.scss";

class App extends Component {
  state = {
    wines: []
  };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    fetch("https://api-wine.herokuapp.com/api/v2/wines")
      .then(res => res.json())
      .then(data => {
        this.setState({ wines: data });
      });
  };

  renderContent(location) {
    if (!this.state.wines.length) {
      return <div />;
    }

    return (
      <Fragment>
        <TransitionGroup>
          <CSSTransition key={location.key} classNames="fade" timeout={200}>
            <Switch location={location}>
              <Route
                exact
                path="/"
                component={() => <List items={this.state.wines} />}
              />
              <Route
                path="/wine/:id"
                component={() => <ItemShow items={this.state.wines} />}
              />
              <Route path="/wishlist" component={EmptyPage} />
              <Route path="/cellar" component={EmptyPage} />
              <Route path="/articles" component={EmptyPage} />
              <Route path="/profile" component={EmptyPage} />
            </Switch>
          </CSSTransition>
          <TabBar />
        </TransitionGroup>
      </Fragment>
    );
  }

  render() {
    return (
      <Router>
        <Route render={({ location }) => this.renderContent(location)} />
      </Router>
    );
  }
}

export default App;
