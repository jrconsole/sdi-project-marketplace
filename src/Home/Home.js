import './Home.css';
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Cookies from 'universal-cookie';


function Home({ courses }) {
  const cookies = new Cookies();
  const userType = cookies.get('userType');

  const [subjects, setSubjects] = useState([]);
  const fetchSubjects = async () => {
    const response = await fetch('http://localhost:5003/subjects');
    const jsonResponse = await response.json();

    setSubjects(jsonResponse.subjects);
  }
  useEffect(fetchSubjects, []);

  const [selectedCourses, setSelectedCourses] = useState(courses);
  useEffect(() => {
    if(courses.length > 0) setSelectedCourses(courses)
  }, [courses]);

  const handleSelect = (e) => {
    if (e.target.value === 'all') {
      setSelectedCourses(courses);
    } else {
      const selectedCourses = courses.filter(course => course.subject_id === Number(e.target.value));
      setSelectedCourses(selectedCourses);
    }
  }

  return (
    <div>
        {userType === 'teacher' ?
          (<>
            <a href="http://localhost:3001">
            <button>Add Course</button>
            </a>
            <br /><br />
          </>)
          : null
        }

        <select name='subjects' onChange={handleSelect}>
          <option value='all'>All Subjects</option>
          {subjects.map(subject => {
            return (
              <option value={subject.id}>
                {subject.name}
              </option>
            );
          })}
        </select>
        <br /><br />

        {selectedCourses.map(course => {
          return (
            <>
              <span>{course.name}:</span>
              <a href="http://localhost:4001"><button>Forum</button></a> 
              {userType === 'teacher' ? 
                null : 
                <Link to={`/signup/${course.id}`}><button>Sign-up</button></Link>
              }
            </>
          )
        })}
    </div>
  );
}

export default Home;
