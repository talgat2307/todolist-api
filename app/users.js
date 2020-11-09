const router = require('express').Router();
const User = require('../model/User');

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    user.generateToken();
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/sessions', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (!user) {
    return res.status(400).send({error: "Username not found"});
  }

  const isMatch = await user.checkPassword(req.body.password);
  if (!isMatch) {
    return res.status(400).send({error: "Password is wrong"});
  }

  user.generateToken();
  await user.save();

  res.send({message: "Username and password correct", user});
});


module.exports = router;