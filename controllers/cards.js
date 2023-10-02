const mongoose = require('mongoose');
const cardModel = require('../models/card');

const {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  ITERNAL_SERVER_ERRROR,
} = require('../utils/constants');

const getCards = async (req, res) => {
  try {
    const cards = await cardModel.find();
    res.status(OK).send(cards);
  } catch (e) {
    res.status(ITERNAL_SERVER_ERRROR).send({ message: 'Server error' });
  }
};

const createCard = async (req, res) => {
  const { name, link } = req.body;
  try {
    const card = await cardModel.create({ name, link, owner: req.user._id });
    res.status(CREATED).send(card);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(BAD_REQUEST).send({ message: e.message });
    }
    return res.status(ITERNAL_SERVER_ERRROR).send({ message: 'Server error' });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    await cardModel.findByIdAndRemove(cardId).orFail();
    res.status(OK).send({ message: 'card was deleted' });
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST).send({ message: e.message });
    }
    if (e instanceof mongoose.Error.DocumentNotFoundError) {
      return res.status(NOT_FOUND).send({ message: 'Card not found' });
    }
    res.status(ITERNAL_SERVER_ERRROR).send({ message: 'Server error' });
  }
};

const likeCard = async (req, res) => {
  try {
    const updatedCard = await cardModel
      .findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } },
        {
          new: true,
          runValidators: true,
        },
      )
      .orFail();
    return res.status(OK).send(updatedCard);
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST).send({ message: e.message });
    }
    if (e instanceof mongoose.Error.DocumentNotFoundError) {
      return res.status(NOT_FOUND).send({ message: 'Card not found' });
    }
    return res.status(ITERNAL_SERVER_ERRROR).send({ message: 'Server error' });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const updatedCard = await cardModel
      .findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } },
        {
          new: true,
          runValidators: true,
        },
      )
      .orFail();
    return res.status(OK).send(updatedCard);
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST).send({ message: e.message });
    }
    if (e instanceof mongoose.Error.DocumentNotFoundError) {
      return res.status(NOT_FOUND).send({ message: 'Card not found' });
    }
    return res.status(ITERNAL_SERVER_ERRROR).send({ message: 'Server error' });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
