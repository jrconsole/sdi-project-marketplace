import './App.css';
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from '../Home/Home';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';

function App() {

  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    const response = await fetch('http://localhost:5003/courses');
    const jsonResponse = await response.json();
    
    setCourses(jsonResponse.courses);
  };

  useEffect(fetchCourses, []);

  return (
    <div className="App">
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>

          <hr />

          <Switch>
            <Route exact path="/">
              <Home courses={courses} />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/signup/:id">
              <Signup courses={courses} />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
