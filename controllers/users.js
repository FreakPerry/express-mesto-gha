const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const { JWT_SECRET } = process.env;

const {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  ITERNAL_SERVER_ERRROR,
} = require('../utils/constants');

const createUser = async (req, res, next) => {
  try {
    const { name, about, avatar, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    return res.status(CREATED).send(user);
  } catch (e) {
    if (e.code === 11000) {
      return res
        .status(409)
        .send({ message: 'User with this email already exists' });
    }
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(BAD_REQUEST).send({ message: e.message });
    }
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.checkUser(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    });
    res
      .cookie('jwt', token, {
        httpOnly: true,
        maxAge: 3600000 * 24 * 7,
      })
      .status(OK)
      .send({ token });
  } catch (e) {
    next(e);
  }
};

const getUsers = async (req, res, next) => {
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

const getUserById = async (req, res, next) => {
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
    next(e);
  }
};

const updateUser = async (req, res, updateData, next) => {
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
    next(e);
  }
};

const updateUserById = async (req, res, next) => {
  const { name, about } = req.body;
  const updateData = { name, about };
  updateUser(req, res, updateData);
};
const updateUserAvatar = async (req, res) => {
  const { avatar } = req.body;
  const updateData = { avatar };
  updateUser(req, res, updateData);
};

const getMe = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ _id: req.user._id });
    res.status(OK).send(user);
  } catch (e) {
    res.status(404).send({ message: 'user not found' });
    next(e);
  }
};

module.exports = {
  createUser,
  login,
  getUsers,
  getUserById,
  updateUserById,
  updateUserAvatar,
  getMe,
};
