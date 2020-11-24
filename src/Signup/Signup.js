import './Signup.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

function Signup({ courses }) {

  let { id } = useParams();

  let course = courses.find(course => {
    return course.id === Number(id);
  })

  const [subject, setSubject] = useState('');
  const fetchSubject = async (id) => {
    const response = await fetch(`http://localhost:5003/subjects/${id}`);
    const jsonResponse = await response.json();

    setSubject(jsonResponse.subject.name);
  }

  const [teacher, setTeacher] = useState('');
  const fetchTeacher = async (id) => {
    const response = await fetch(/*Teacher table*/`http://localhost:3003/teachers/${id}`)
    const jsonResponse = await response.json();

    setTeacher(jsonResponse.teacher.name);
  }

  const [isRegistered, setIsRegistered] = useState(false);
  const fetchRegistration = async () => {
    const studentId = cookies.get('userId');
    const response = await fetch(/*studentsCourses table */`http://localhost:6003/courses/${studentId}`);
    const jsonResponse = await response.json();

    const courseStudent = jsonResponse.filter(pair => {
      return (pair.student_id === studentId && pair.course_id === course.id)
    });

    if (courseStudent.length > 0) {
      setIsRegistered(true);
    }
  }

  useEffect(() => {
    fetchSubject(course.subject_id);
    fetchTeacher(course.teacher_id);
    fetchRegistration();
  }, []);

  const handleSignup = async () => {
    await fetch(/*studentCourses table*/`http://localhost:6003/students_courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({
        "student_id": cookies.get('userId'),
        "course_id": course.id
      })
    });

    fetchRegistration();
  }

  const renderSignup = () => {
    if (isRegistered) {
      return <p>you are registered for this course</p>
    } else {
      return <button onClick={handleSignup}>Join</button>
    }
  }

  return (
    <div>
        <p>
          This is the signup page  for id: {id}
        </p>
        <p>Course Name: {course.name}</p>
        <p>Subject: {subject}</p>
        <p>Teacher: {teacher} </p>
        <p>Price: {course.price}</p>
        
        {renderSignup()}

    </div>
  );
}

export default Signup;
