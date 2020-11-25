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
import Cookies from 'universal-cookie';

function App() {

  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    const response = await fetch('http://localhost:5003/courses');
    const jsonResponse = await response.json();
    
    setCourses(jsonResponse.courses);
  };

  useEffect(fetchCourses, []);


  const cookies = new Cookies();
  const userId = cookies.get('userId');
  const userType = cookies.get('userType');

  const renderDashLink = () => {
    if (userId) {
      const port = (userType === 'teacher') ? 3001 : 6002;
      return (<a href={`http://localhost:${port}`}>Dashboard</a>);
    } else {
      return (<Link to="/login">Login</Link>);
    }
  }

  return (
    <div className="App">
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              {renderDashLink()}
            </li>
            <li>
              <a href={`http://localhost:7001/${userId}`}>Messages</a>
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
