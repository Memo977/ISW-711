const Teacher = require("../models/teacherModel");

/**
 * Creates a teacher
 *
 * @param {*} req
 * @param {*} res
 */
const teacherCreate = (req, res) => {
  let teacher = new Teacher();

  teacher.first_name = req.body.first_name;
  teacher.last_name = req.body.last_name;
  teacher.age = req.body.age;
  teacher.cedula = req.body.cedula;

  if (teacher.first_name && teacher.last_name) {
    teacher.save().then(() => {
        res.status(201); // CREATED
        res.header({
          'location': `/teachers/?id=${teacher.id}`
        });
        res.json(teacher);
      })
      .catch((err) => {
        res.status(422);
        console.log('error while saving the teacher', err);
        res.json({
          error: 'There was an error saving the teacher'
        });
    });
  } else {
    res.status(422);
    console.log('error while saving the teacher')
    res.json({
      error: 'No valid data provided for teacher'
    });
  }
};

/**
 * Get all teachers
 *
 * @param {*} req
 * @param {*} res
 */
const teacherGet = (req, res) => {
  // if an specific teacher is required
  if (req.query && req.query.id) {
    Teacher.findById(req.query.id)
      .then((teacher) => {
        if (!teacher) {
          // Si no se encuentra el profesor, enviar un error 404 y usar return para evitar enviar múltiples respuestas
          return res.status(404).json({ error: "Teacher doesn't exist" });
        }
        // Si se encuentra el profesor, enviar los datos
        res.json(teacher);
      })
      .catch((err) => {
        // Manejar errores de la base de datos
        console.error('Error while querying the teacher', err);
        res.status(500).json({ error: "There was an error querying the teacher" });
      });
  } else {
    // get all teachers
    Teacher.find()
      .then((teachers) => {
        res.json(teachers);
      })
      .catch((err) => {
        // Manejar errores de la base de datos
        console.error('Error while querying all teachers', err);
        res.status(422).json({ error: "There was an error querying the teachers" });
      });
  }
};

/**
 * Updates a teacher by ID
 *
 * @param {*} req
 * @param {*} res
 */
const teacherUpdate = (req, res) => {
  const teacherId = req.params.id;
  Teacher.findById(teacherId)
    .then((teacher) => {
      if (!teacher) {
        res.status(404).json({ error: "Teacher not found" });
        return;
      }

      // Update fields if provided in the request body
      teacher.first_name = req.body.first_name || teacher.first_name;
      teacher.last_name = req.body.last_name || teacher.last_name;
      teacher.age = req.body.age || teacher.age;
      teacher.cedula = req.body.cedula || teacher.cedula;

      // Save the updated teacher
      return teacher.save();
    })
    .then((updatedTeacher) => {
      res.status(200).json(updatedTeacher);
    })
    .catch((err) => {
      res.status(500).json({ error: "Error updating teacher", details: err.message });
    });
};

/**
 * Deletes a teacher by ID
 *
 * @param {*} req
 * @param {*} res
 */
const teacherDelete = (req, res) => {
  const teacherId = req.params.id;
  Teacher.findByIdAndDelete(teacherId)
    .then((deletedTeacher) => {
      if (!deletedTeacher) {
        res.status(404).json({ error: "Teacher not found" });
        return;
      }
      res.status(200).json({ message: "Teacher deleted successfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: "Error deleting teacher", details: err.message });
    });
};

module.exports = {
  teacherCreate,
  teacherGet,
  teacherUpdate,
  teacherDelete
};