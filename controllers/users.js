const mongoose = require('mongoose');
const userModel = require('../models/user');

const {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  ITERNAL_SERVER_ERRROR,
} = require('../utils/constants');

const createUser = async (req, res) => {
  try {
    const user = await userModel.create(req.body);
    return res.status(CREATED).send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(BAD_REQUEST).send({ message: e.message });
    }
    return res.status(ITERNAL_SERVER_ERRROR).send({ message: 'Server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).orFail();
    return res.status(OK).send(users);
  } catch (e) {
    if (e instanceof mongoose.Error.DocumentNotFoundError) {
      return res.status(NOT_FOUND).send({ message: 'Users list is not found' });
    }
    return res.status(ITERNAL_SERVER_ERRROR).send({ message: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId).orFail();
    return res.status(OK).send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST).send({ message: e.message });
    }
    if (e instanceof mongoose.Error.DocumentNotFoundError) {
      return res.status(NOT_FOUND).send({ message: 'User is not found' });
    }
    return res.status(ITERNAL_SERVER_ERRROR).send({ message: 'Server error' });
  }
};

const updateUser = async (req, res, updateData) => {
  try {
    const updatedUser = await userModel
      .findByIdAndUpdate(req.user._id, updateData, {
        new: true,
        runValidators: true,
      })
      .orFail();
    res.status(OK).send(updatedUser);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(BAD_REQUEST).send({ message: e.message });
    }
    if (e instanceof mongoose.Error.DocumentNotFoundError) {
      return res.send(NOT_FOUND).send({ message: 'User is not found' });
    }
    res.status(ITERNAL_SERVER_ERRROR).send({ message: 'Server error' });
  }
};

const updateUserById = async (req, res) => {
  const { name, about } = req.body;
  const updateData = { name, about };
  updateUser(req, res, updateData);
};
const updateUserAvatar = async (req, res) => {
  const { avatar } = req.body;
  const updateData = { avatar };
  updateUser(req, res, updateData);
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  updateUserAvatar,
};
