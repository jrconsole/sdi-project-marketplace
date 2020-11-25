const db = require('./course-queries');
const pool = db.connect();


function getAllSubjects(res) {

    pool.query(`SELECT * FROM Subjects`, (err, result) => {
        if (err) {
            throw err;
        }

        res.status(200).send({ subjects: result.rows });
    })
}

const getSubject = (id, res) => {

    pool.query(`
        SELECT * from Subjects 
        WHERE id = $1
        `, [id],
        (err, result) => {
            if (err) {
                throw err;
            }
            
            res.status(200).send({ subject: result.rows[0] });
        }
    )
    
}

function postSubject(subject, res) {
    pool.query(`
        INSERT INTO Subjects (
            name
        ) VALUES (
            $1
        ) RETURNING id
        `, [
            subject.name
        ], 
        (err, result) => {
            if (err) {
                throw err;
            }

            const lastId = result.rows[0].id;
            pool.query(`
                SELECT * from Subjects 
                WHERE id = $1
                `, [lastId],
                (err, result) => {
                    if (err) {
                        throw err;
                    }
                    
                    const addedSubject = result.rows[0];
                    if (addedSubject) {
                        res.status(201).send({ subject: addedSubject })
                    } else {
                        res.status(500).send('Server error. Could not add subject');
                    }
                }
            )
        }
    )
}

function updateSubject(id, subject, res) {
    pool.query(`
        UPDATE Subjects
        SET name=$1
        WHERE id=$2
        `,[
            subject.name,
            id
        ],
        (err) => {
            if (err) {
                throw err;
            }

            pool.query(`
                SELECT * from Subjects 
                WHERE id = $1
                `, [id],
                (err, result) => {
                    if (err) {
                        throw err;
                    }
                    
                    const updatedSubject = result.rows[0];
                    //send success/fail response based on result of database query
                    if (updatedSubject) {
                        res.status(201).send({ subject: updatedSubject });
                    } else {
                        res.status(500).send('Server error. Could not add update subject');
                    }
                }
            )
        }
    )
}

function deleteSubject (id, res) {
    pool.query(`DELETE FROM Subjects WHERE id=$1`, [id], (err) => {
        if (err) {
            throw err;
        }

        res.status(204).send('Successfully deleted subject')
    })
}

module.exports = { 
    getAllSubjects, 
    getSubject, 
    postSubject, 
    updateSubject, 
    deleteSubject
}