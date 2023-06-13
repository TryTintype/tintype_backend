// controllers/authController.js
const bcrypt = require('bcrypt');
const Users = require('../models/userModels');

module.exports.register = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;

        // console.log({ username, email, password })
      // Check if username already exists
        const existingUsername = await Users.findOne({ username });
        console.log({existingUsername})
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Check if email already exists
      const existingEmail = await Users.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const newUser = new Users({
        username,
        email,
        password: hashedPassword
      });

      const savedUser = await newUser.save();
      res.status(201).json({ message: 'New user created' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error registering user' });
    }
  };


module.exports.login = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    console.log({ username, email, password })
      // Check if user exists

   // Determine the login identifier (username or email)
   const loginIdentifier = username ? { username } : { email };

    const user = await Users.findOne(loginIdentifier);
    if (!user) {
      return res.status(400).send('Invalid email or password');
    }

    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send('Invalid email or password');
    }

    res.status(200).json({status: true, user})
  } catch (error) {
    console.error(error);
    res.status(500).send('Error logging in user');
  }
};
