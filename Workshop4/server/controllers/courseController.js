const Course = require("../models/courseModel");

/**
 * Creates a course
 *
 * @param {*} req
 * @param {*} res
 */
const coursePost = async (req, res) => {
  let course = new Course(req.body);
  await course.save()
    .then(course => {
      res.status(201); // CREATED
      res.header({
        'location': `/courses/?id=${course.id}`
      });
      res.json(course);
    })
    .catch( err => {
      res.status(422);
      console.log('error while saving the course', err);
      res.json({
        error: 'There was an error saving the course'
      });
    });
};

/**
 * Get all courses or one
 *
 * @param {*} req
 * @param {*} res
 */
const courseGet = (req, res) => {
  if (req.query && req.query.id) {
    Course.findById(req.query.id)
      .populate('teacher')
      .then((course) => {
        if (!course) {
          return res.status(404).json({ error: "Course doesnt exist" });
        }
        return res.json(course);
      })
      .catch(err => {
        console.log('error while querying the course', err);
        return res.status(500).json({ error: "Error querying course" });
      });
  } else {
    Course.find()
      .populate('teacher')
      .then(courses => {
        return res.json(courses);
      })
      .catch(err => {
        console.log('error while querying courses', err);
        return res.status(500).json({ error: "Error querying courses" });
      });
  }
};

/**
 * Updates a course by ID
 *
 * @param {*} req
 * @param {*} res
 */
const courseUpdate = (req, res) => {
  const courseId = req.params.id;
  Course.findById(courseId)
    .then((course) => {
      if (!course) {
        res.status(404).json({ error: "Course not found" });
        return;
      }

      // Update fields if provided in the request body
      course.name = req.body.name || course.name;
      course.code = req.body.code || course.code;
      course.description = req.body.description || course.description;
      course.teacher = req.body.teacher || course.teacher;

      // Save the updated course
      return course.save();
    })
    .then((updatedCourse) => {
      res.status(200).json(updatedCourse);
    })
    .catch((err) => {
      res.status(500).json({ error: "Error updating course", details: err.message });
    });
};

/**
 * Deletes a course by ID
 *
 * @param {*} req
 * @param {*} res
 */
const courseDelete = (req, res) => {
  const courseId = req.params.id;
  Course.findByIdAndDelete(courseId)
    .then((deletedCourse) => {
      if (!deletedCourse) {
        res.status(404).json({ error: "Course not found" });
        return;
      }
      res.status(200).json({ message: "Course deleted successfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: "Error deleting course", details: err.message });
    });
};

module.exports = {
  coursePost,
  courseGet,
  courseUpdate,
  courseDelete
};