require('dotenv').config();
const express = require('express');
const app = express();
// database connection
const mongoose = require("mongoose");
const db = mongoose.connect(process.env.MONGODB_URI);

// parser for the request body (required for the POST and PUT methods)
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// check for cors
const cors = require("cors");
const { teacherCreate, teacherGet, teacherUpdate, teacherDelete } = require('./controllers/teacherController');
const { coursePost, courseGet, courseUpdate, courseDelete } = require('./controllers/courseController');
app.use(cors({
  domains: '*',
  methods: "*"
}));


app.post('/teachers', teacherCreate);
app.get("/teachers/",teacherGet);
app.patch('/teachers/:id', teacherUpdate);
app.delete('/teachers/:id', teacherDelete);
app.post('/courses', coursePost);
app.get('/courses', courseGet);
app.patch('/courses/:id', courseUpdate);
app.delete('/courses/:id', courseDelete);

app.listen(3001, () => console.log(`Example app listening on port 3001!`))
