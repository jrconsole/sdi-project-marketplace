const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'marketplace_db',
    password: 'postgres',
    port: 5432
})

function getAllCourses(res) {
    pool.query(`SELECT * FROM Courses`, (err, result) => {
        if (err) {
            throw err;
        }

        res.status(200).send({ courses: result.rows });
    })
}

const getCourse = (id, res) => {

    pool.query(`
        SELECT * from Courses 
        WHERE id = $1
        `, [id],
        (err, result) => {
            if (err) {
                throw err;
            }
            
            res.status(200).send({ course: result.rows[0] });
        }
    )
    
}

function postCourse(course, res) {
    pool.query(`
        INSERT INTO Courses (
            name,
            teacher_id,
            price,
            subject_id
        ) VALUES (
            $1, $2, $3, $4
        ) RETURNING id
        `, [
            course.name,
            course.teacherId,
            course.price,
            course.subjectId
        ], 
        (err, result) => {
            if (err) {
                throw err;
            }

            const lastId = result.rows[0].id;
            pool.query(`
                SELECT * from Courses 
                WHERE id = $1
                `, [lastId],
                (err, result) => {
                    if (err) {
                        throw err;
                    }
                    
                    const addedCourse = result.rows[0];
                    if (addedCourse) {
                        res.status(201).send({ course: addedCourse })
                    } else {
                        res.status(500).send('Server error. Could not add course');
                    }
                }
            )
        }
    )
}

function updateCourse(id, course, res) {
    pool.query(`
        UPDATE Courses
        SET name=$1, 
            teacher_id=$2, 
            price=$3,
            subject_id=$4
        WHERE id=$5
        `,[
            course.name,
            course.teacherId,
            course.price,
            course.subjectId,
            id
        ],
        (err) => {
            if (err) {
                throw err;
            }

            pool.query(`
                SELECT * from Courses 
                WHERE id = $1
                `, [id],
                (err, result) => {
                    if (err) {
                        throw err;
                    }
                    
                    const updatedCourse = result.rows[0];
                    //send success/fail response based on result of database query
                    if (updatedCourse) {
                        res.status(201).send({ course: updatedCourse });
                    } else {
                        res.status(500).send('Server error. Could not add update course');
                    }
                }
            )
        }
    )
}

function deleteCourse (id, res) {
    pool.query(`DELETE FROM Courses WHERE id=$1`, [id], (err) => {
        if (err) {
            throw err;
        }

        res.status(204).send('Successfully deleted course')
    })
}

module.exports = { 
    getAllCourses, 
    getCourse, 
    postCourse, 
    updateCourse, 
    deleteCourse
}