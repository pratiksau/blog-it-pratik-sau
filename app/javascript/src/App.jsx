import React from "react";

import {
  Route,
  Switch,
  BrowserRouter as Router,
  Redirect,
} from "react-router-dom";

import Blogs from "./components/Blogs";
import Lists from "./components/Lists";
import Sidebar from "./components/Sidebar";

const App = () => (
  <Router>
    <div className="flex h-screen w-full flex-row overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Switch>
          <Route exact path="/">
            <Redirect to="/blogs" />
          </Route>
          <Route exact component={Blogs} path="/blogs" />
          <Route exact component={Lists} path="/lists" />
        </Switch>
      </div>
    </div>
  </Router>
);

export default App;
