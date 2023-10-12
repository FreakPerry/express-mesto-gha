const mongoose = require('mongoose');
const cardModel = require('../models/card');

const {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  ITERNAL_SERVER_ERRROR,
} = require('../utils/constants');

const getCards = async (req, res, next) => {
  try {
    const cards = await cardModel.find();
    res.status(OK).send(cards);
  } catch (e) {
    next(e);
  }
};

const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  try {
    const card = await cardModel.create({ name, link, owner: req.user._id });
    res.status(CREATED).send(card);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(BAD_REQUEST).send({ message: e.message });
    }
    next(e);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await cardModel.findByIdAndRemove(cardId).orFail();
    if (card.owner.toString() !== cardId) {
      return res
        .status(404)
        .send({ message: "You can't delete other people's cards" });
    }
    res.status(OK).send({ message: 'card was deleted' });
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST).send({ message: e.message });
    }
    if (e instanceof mongoose.Error.DocumentNotFoundError) {
      return res.status(NOT_FOUND).send({ message: 'Card not found' });
    }
    next(e);
  }
};

const likeCard = async (req, res, next) => {
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
    next(e);
  }
};

const dislikeCard = async (req, res, next) => {
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
    next(e);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
