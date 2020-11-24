const express = require('express');
const router = express.Router();

const db = require('./course-queries');


router.get('/', (req, res, next) => {
    db.getAllCourses(res);
})

router.get('/:courseId', (req, res, next) => {
    //get course obj from database where id = id
    db.getCourse(req.params.courseId, res);
})

router.post('/', (req, res, next) => {
    //get new course details from request body
    const course = req.body.course;

    //verify course details contain required info. send error response if request is missing data
    if (
        !course.name ||
        !course.teacherId ||
        !course.price ||
        !course.subjectId
    ) {
        res.status(400).send('Failed: Missing one or more required fields');
    } else {

        //call function from queries file to add course to database and send response
        db.postCourse(course, res);
    }

})

router.put('/:courseId', (req, res, next) => {
    //get new course details from request body
    const course = req.body.course;

    //verify course details contain required info. send error response if request is missing data
    if (
        !course.name ||
        !course.teacherId ||
        !course.price ||
        !course.subjectId
    ) {
        res.status(400).send('Failed: Missing one or more required fields');
    } else {

        //call function from queries file to update course in database. Assign returned course object to variable.
        db.updateCourse(req.params.courseId, course, res);

    }

})

router.delete('/:courseId', (req, res, next) => {
    //call function from queries file to delete course
    db.deleteCourse(req.params.courseId, res);
})

module.exports = router;