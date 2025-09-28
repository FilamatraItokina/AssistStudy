const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const authRoute = require('./routes/auth.route');
const subRoute = require('./routes/subject.route');
const taskRoute = require('./routes/task.route');


app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoute);
app.use('/subjects', subRoute);
app.use('/tasks', taskRoute);

module.exports = app;