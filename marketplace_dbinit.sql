DROP TABLE IF EXISTS Subjects;
CREATE TABLE IF NOT EXISTS Subjects (id serial PRIMARY KEY, name text NOT NULL);
INSERT INTO Subjects (name) VALUES ('foo'), ('bar');

DROP TABLE IF EXISTS Courses;
CREATE TABLE IF NOT EXISTS Courses (
    id serial PRIMARY KEY, 
    name text NOT NULL, 
    teacher_id int NOT NULL, 
    price real NOT NULL, 
    subject_id int NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES Subjects(id) ON DELETE NO ACTION ON UPDATE CASCADE);
INSERT INTO Courses (name, teacher_id, price, subject_id) VALUES 
( 'Course 1', 1, 1, 1),
( 'Course 2', 1, 2, 2),
( 'Course 3', 1, 3, 1),
( 'Course 4', 1, 4, 2);
