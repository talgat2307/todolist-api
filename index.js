const express = require('express');
const mongoose = require('mongoose');
const users = require('./app/users');
const tasks = require('./app/tasks');
const app = express();
const port = 8000;

app.use(express.json());

const run = async () => {
  await mongoose.connect('mongodb://localhost/todolist',
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

  app.use('/users', users);
  app.use('/tasks', tasks);

  console.log('Connected to MongoDB');
  app.listen(port, () => console.log('Server started'));
};

run().catch(console.error);