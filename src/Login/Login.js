import './Login.css';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Cookies from 'universal-cookie';

function Login() {

  //initialize and handle form inputs state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('student');

  //initialize login status message state
  const [loginStatus, setLoginStatus] = useState('');

  //initilize router history to enable redirects
  let history = useHistory();

  //initialize cookies
  const cookies = new Cookies();

  //fetch user data based on user inputs
  const getUser = async (e) => {
    e.preventDefault();
    const user = {
      id: '',
      type: ''
    }
    const studentResponse = await fetch(/*students table:*/`http://localhost:6003/login?username=${username}&password=${password}`);

    if (studentResponse.status === 403) {
      const teacherResponse = await fetch(/*teachers table:*/ `http://localhost:3003/login?username=${username}&password=${password}`);

      if(teacherResponse.status === 403) {
        setLoginStatus('That user was not found');
        return;
      }

      user.id = await teacherResponse.json();
      user.type = 'teacher';
    }

    if(!user.id) {
      user.id = studentResponse.json();
      user.type = 'student';
    }
    //set cookies
    cookies.set('userId', user.id);
    cookies.set('userType', user.type);

    //Redirect to home page on successful login
    history.push('/')
  }

  const postUser = async (e) =>  {
    e.preventDefault();
    let response;
    if (userType === 'student') {
      response = await fetch(/*students table:*/'http://localhost:6003/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          "first_name": firstName,
          "last_name": lastName,
          "username": username,
          "password": password,
          "credit": 0
        })
      });

    } else if (userType === 'teacher') {
      response = await fetch(/*teachers table:*/'http://localhost:3003/addteacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          "fname": firstName,
          "lname": lastName,
          "uname": username,
          "pword": password
        })
      });

    } else {
      setLoginStatus('Error: missing user type');
      return;
    }

    if(response.status !== 201) {
      setLoginStatus(`Server error. Code: ${response.status}`)
    } else {
      //reinitialize state
      setFirstName('');
      setLastName('');
      setUsername('');
      setPassword('');
      setUserType('student');
      //redirect to member login
      setIsMember(true);
    }
  }

  //toggle between member login and new user sign up forms
  const [isMember, setIsMember] = useState(true);
  const renderForm = () => {
    return isMember ? memberForm : newForm;
  }

  const memberForm = (     
    <form onSubmit={getUser}>
      <input required 
        placeholder="Username" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)}></input>
      <br />
      <input required
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}></input>
      <br />
      <button type='submit'>Login</button>
    </form>);

    const newForm = (     
      <form onSubmit={postUser}>
        <input required 
          placeholder="First Name" 
          value={firstName} 
          onChange={(e) => setFirstName(e.target.value)}></input>
        <br />
        <input required 
          placeholder="Last Name" 
          value={lastName} 
          onChange={(e) => setLastName(e.target.value)}></input>
        <br />
        <input required 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}></input>
        <br />
        <input required
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}></input>
        <br />
        
        <input required defaultChecked
          type="radio" 
          id="student" 
          name="userType" 
          value="student" onClick={() => setUserType('student')} />
        <label htmlFor="student">Student</label>
              
        <input required 
          type="radio" 
          id="teacher" 
          name="userType" 
          value="teacher" onClick={() => setUserType('teacher')} />
        <label htmlFor="teacher">Teacher</label>
        
        <br />
        <button type='submit'>Sign-Up</button>
      </form>);

    const renderMemberOption = () => {
      if (isMember) {
        return (<p>Not a member? <button onClick={() => setIsMember(false)}>Sign-Up</button></p>)
      } else {
        return (<p>Already a member? <button onClick={() => setIsMember(true)}>Login</button></p>)
      }
    }

  return (
    <div>
      {renderForm()}
      <p>{loginStatus}</p>
      <br />
      {renderMemberOption()}
    </div>
  );
}

export default Login;
