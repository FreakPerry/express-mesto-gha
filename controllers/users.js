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
    const users = await userModel
      .find({})
      .orFail(() => new Error('No users found'));
    return res.status(OK).send(users);
  } catch (e) {
    return res.status(ITERNAL_SERVER_ERRROR).send({ message: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel
      .findById(userId)
      .orFail(() => new Error('User is not found'));
    if (!user) {
      return res.status(NOT_FOUND).send({ message: 'User not found' });
    }
    return res.status(OK).send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST).send({ message: e.message });
    }
    return res.status(ITERNAL_SERVER_ERRROR).send({ message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const updatedUser = await userModel
      .findByIdAndUpdate(
        req.user._id,
        { name, about, avatar },
        {
          new: true,
          runValidators: true,
        },
      )
      .orFail(() => new Error('User is not found'));
    if (!updatedUser) {
      return res.status(NOT_FOUND).send({ message: 'User not found' });
    }
    res.status(OK).send(updatedUser);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(BAD_REQUEST).send({ message: e.message });
    }
    res.status(ITERNAL_SERVER_ERRROR).send({ message: 'Server error' });
  }
};

const updateUserById = updateUser;
const updateUserAvatar = updateUser;

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  updateUserAvatar,
};
