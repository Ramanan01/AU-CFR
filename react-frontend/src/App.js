import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Router, Switch, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import SelectExpert from "./components/SelectExpert"
import ShowStats from "./components/Stats"
import ReorderForScore from "./components/ReorderForScore";

import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";

import { history } from "./helpers/history";

import AuthVerify from "./common/AuthVerify";
import EventBus from "./common/EventBus";
import axios from "axios";

const API_URL = "http://localhost:5000/";

const App = () => {
  const [showExpertSelectionPage, setShowExpertSelectionPage] = useState(false);

  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const downloadFile = ({ data, fileName, fileType }) => {
    const blob = new Blob([data], { type: fileType })

    const a = document.createElement('a')
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
  }

  const DownloadExpertCSV = e => {
    e.preventDefault()
    let headers = ['id, app_gen_id, name, title, expert_name, expert_designation, expert_department, expert_specialization, score'];
    axios.get(API_URL + "api/expert/select")
      .then(response => {
        (() => {
          let resultCsv = response?.data?.result.reduce((acc, row) => {
            const { id,
              app_gen_id,
              name,
              title,
              expert_name,
              expert_designation,
              expert_department,
              expert_specialization,
              score } = row

            acc.push([id,
              app_gen_id,
              name,
              title,
              expert_name,
              expert_designation,
              expert_department,
              expert_specialization,
              score].join(','))
            return acc
          }, [])

          downloadFile({
            data: [...headers, ...resultCsv].join('\n'),
            fileName: 'data.csv',
            fileType: 'text/csv',
          })
        })();
      }).catch(e => {
        console.log("Error: ", e);
      });
  };

  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage()); // clear message when changing location
    });
  }, [dispatch]);

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser !== null && currentUser?.tokenString !== null) {
      setShowExpertSelectionPage(true);
    } else {
      setShowExpertSelectionPage(false);
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, [currentUser, logOut]);

  return (
    <Router history={history}>
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            Expert Identification
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link" style={{ color:"white" }}>
                Home
              </Link>
            </li>
            {currentUser ? (<li className="nav-item">
              <Link to={"/reorder"} className="nav-link" style={{ color:"white" }}>
                Reorder
              </Link>
            </li>) : (<li></li>)}
            {showExpertSelectionPage && (
              <li className="nav-item">
                <Link to={"/select-expert"} className="nav-link">
                  Board
                </Link>
              </li>
            )}

          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              {showExpertSelectionPage ? (
                  <li className="nav-item">
                    <button style={{ backgroundColor: "white", color: "black", borderRadius: "5px", padding: "5px" }} onClick={DownloadExpertCSV}>Download CSV</button>
                  </li>
              ) : (<p></p>)}
              <li className="nav-item">
                    <Link to={"/stats"} className="nav-link" style={{ color:"white" }}>
                      Stats
                    </Link>
              </li>
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link" style={{ color:"white", textTransform: "capitalize" }}>
                  {currentUser.name}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={logOut}>
                  Logout
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div>
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/select-expert" component={SelectExpert} />
            <Route exact path="/stats" component={ShowStats} />
            <Route exact path="/reorder" component={ReorderForScore} />
          </Switch>
        </div>

        <AuthVerify logOut={logOut} />
      </div>
    </Router>
  );
};

export default App;
