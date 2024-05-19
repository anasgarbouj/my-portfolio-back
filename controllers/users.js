const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const requestIp = require('request-ip');
const useragent = require('useragent');
const axios = require('axios');
const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d', // specify the expiration time
    });
  };
  const getLocationData = async (ip) => {
    try {
        const response = await axios.get(`https://ipinfo.io/${ip}/geo`);
        return {
            city: response.data.city,
            region: response.data.region,
            country: response.data.country
        };
    } catch (error) {
        console.error('Failed to get location data', error);
        return {};
    }
};
// Sign up a new user
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const ip = requestIp.getClientIp(req);
    const ua = useragent.parse(req.headers['user-agent']);

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const locationData = await getLocationData(ip);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'normal',
      lastLoginDetails: {
        ip,
        device: ua.toString(),
        location: {
          city: locationData.city,
          region: locationData.region,
          country: locationData.country
        }
      }
    });

    const user = await newUser.save();
    const token = generateToken(user);
    res.status(201).json({ message: 'User created successfully!', token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
  
exports.signin = async (req, res) => {
  try {
      const { email, password } = req.body;
      const ip = requestIp.getClientIp(req);
      const ua = useragent.parse(req.headers['user-agent']);

      const user = await User.findOne({ email });
      if (!user) {
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      const locationData = await getLocationData(ip);

      // Update last login details
      const updatedUser = await User.findByIdAndUpdate(user._id, {
          lastLoginDetails: {
              ip,
              device: ua.toString(),
              location: locationData
          }
      }, { new: true });

      const token = generateToken(updatedUser);

      res.status(200).json({ message: 'User signed in successfully!', token, user: updatedUser });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
// Get a single user by id
exports.getUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Update a user by id
  exports.updateUser = async (req, res) => {
    try {
      const updateData = req.body;
  
      // If the password needs to be updated, hash the new password
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 12);
      }
  
      const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User updated', user: updatedUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Delete a user by id
  exports.deleteUser = async (req, res) => {
    try {
      const user = await User.findByIdAndRemove(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // List all users
  exports.listUsers = async (req, res) => {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };  