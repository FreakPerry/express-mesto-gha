const mongoose = require('mongoose');
const userModel = require('../models/user');

const createUser = async (req, res) => {
  try {
    const user = await userModel.create(req.body);
    return res.status(201).send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send({ message: e.message });
    }
    return res.status(500).send({ message: 'Server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    return res.status(200).send(users);
  } catch (e) {
    return res.status(500).send({ message: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    return res.status(200).send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      return res.status(400).send({ message: e.message });
    }
    return res.status(500).send({ message: 'Server error' });
  }
};

const updateUserById = async (req, res) => {
  try {
    const { name, about } = req.body;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send(updatedUser);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send({ message: e.message });
    }
    res.status(500).send({ message: 'Server error' });
  }
};

const updateUserAvatar = async (req, res) => {
  const { avatar } = req.body;
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).send({ message: 'User not found' });
    }
    return res.status(200).send(updatedUser);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send({ message: e.message });
    }
    return res.status(500).send({ message: 'Server error' });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  updateUserAvatar,
};
