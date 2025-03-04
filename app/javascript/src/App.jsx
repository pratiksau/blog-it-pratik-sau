import React from "react";

import {
  Route,
  Switch,
  BrowserRouter as Router,
  Redirect,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Blogs from "./components/Blogs";
import Show from "./components/Blogs/Show";
import CreateBlog from "./components/Create";
import Lists from "./components/Lists";
import Sidebar from "./components/Sidebar";

const App = () => (
  <Router>
    <div className="flex h-screen w-full flex-row overflow-hidden">
      <Sidebar />
      <ToastContainer />
      <div className="flex-1 overflow-auto">
        <Switch>
          <Route exact path="/">
            <Redirect to="/blogs" />
          </Route>
          <Route exact component={Blogs} path="/blogs" />
          <Route exact component={Lists} path="/lists" />
          <Route exact component={CreateBlog} path="/blogs/create" />
          <Route exact component={Show} path="/blogs/:slug" />
        </Switch>
      </div>
    </div>
  </Router>
);

export default App;
