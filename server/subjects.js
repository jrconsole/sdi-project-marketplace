const express = require('express');
const router = express.Router();

const db = require('./subject-queries');

router.get('/', (req, res, next) => {
    db.getAllSubjects(res);
})

router.get('/:subjectId', (req, res, next) => {
    db.getSubject(req.params.subjectId, res);
})

router.post('/', (req, res, next) => {
    //get new course details from request body
    const subject = req.body.subject;

    //verify course details contain required info. send error response if request is missing data
    if (!subject.name) {
        res.status(400).send('Failed: Subject needs a name');
    } else {

        //call function from queries file to add course to database and send response
        db.postSubject(subject, res);
    }

})

router.put('/:subjectId', (req, res, next) => {
    //get new course details from request body
    const subject = req.body.subject;

    //verify course details contain required info. send error response if request is missing data
    if (!subject.name) {
        res.status(400).send('Failed: Subject needs a name');
    } else {

        //call function from queries file to update course in database. Assign returned course object to variable.
        db.updateSubject(req.params.subjectId, subject, res);

    }

})

router.delete('/:subjectId', (req, res, next) => {
    //call function from queries file to delete course
    db.deleteSubject(req.params.subjectId, res);
})

module.exports = router;