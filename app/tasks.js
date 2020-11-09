const router = require('express').Router();
const Task = require('../model/Task');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find().populate('user');
    res.send(tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const task = new Task(req.body).populate('user');
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.put('/:id', auth, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task.user.toString() === req.user._id.toString()) {
    try {
      const task = await Task.updateOne({ _id: req.params.id },
        {
          $set: {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
          },
        },
      );
      res.send(task);
    } catch (e) {
      res.status(400).send(e);
    }
  } else {
    res.send({ error: 'Wrong user' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task.user.toString() === req.user._id.toString()) {
    try {
      const task = await Task.deleteOne({ _id: req.params.id });
      res.send(task);
    } catch (e) {
      res.status(400).send(e);
    }
  } else {
    res.send({ error: 'Wrong user' });
  }
});

module.exports = router;



