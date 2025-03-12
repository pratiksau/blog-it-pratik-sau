import React, { useEffect } from "react";

import { either, isEmpty, isNil } from "ramda";
import {
  Route,
  Switch,
  BrowserRouter as Router,
  Redirect,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { setAuthHeaders } from "./apis/axios";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
import Blogs from "./components/Blogs";
import Show from "./components/Blogs/Show";
import PrivateRoute from "./components/commons/PrivateRoute";
import CreateBlog from "./components/Create";
import EditBlog from "./components/Edit";
import Lists from "./components/Lists";
import PreviewPage from "./components/Preview/PreviewPage";
import Sidebar from "./components/Sidebar";
import Summary from "./components/Summary";
import { getFromLocalStorage } from "./utils/storage";

const App = () => {
  const authToken = getFromLocalStorage("authToken");
  const isLoggedIn = !either(isEmpty, isNil)(authToken);
  const hideSidebar = !isLoggedIn;

  useEffect(() => {
    setAuthHeaders();
  }, []);

  return (
    <Router>
      <div className="flex h-screen w-full flex-row overflow-hidden">
        {!hideSidebar && <Sidebar />}
        <ToastContainer />
        <div className="flex-1 overflow-auto">
          <Switch>
            <Route exact path="/">
              <Redirect to="/blogs" />
            </Route>
            <Route exact component={Blogs} path="/blogs" />
            <Route exact component={Signup} path="/signup" />
            <Route exact path="/login">
              {isLoggedIn ? <Redirect to="/blogs" /> : <Login />}
            </Route>
            <Route exact component={Lists} path="/lists" />
            <Route exact component={CreateBlog} path="/blogs/create" />
            <Route exact component={Show} path="/blogs/:slug" />
            <Route exact component={EditBlog} path="/blogs/:slug/edit" />
            <Route exact component={Summary} path="/summary" />
            <Route exact component={PreviewPage} path="/preview/:slug" />
            <PrivateRoute
              component={Blogs}
              condition={isLoggedIn}
              path="/"
              redirectRoute="/login"
            />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
