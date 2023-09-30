const mongoose = require('mongoose');
const cardModel = require('../models/card');

const getCards = async (req, res) => {
  try {
    const cards = await cardModel.find();
    res.status(200).send(cards);
  } catch (e) {
    res.status(500).send({ message: 'Server error' });
  }
};

const createCard = async (req, res) => {
  const { name, link } = req.body;
  try {
    const card = await cardModel.create({ name, link, owner: req.user._id });
    res.status(201).send(card);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send({ message: e.message });
    }
    return res.status(500).send({ message: 'Server error' });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await cardModel.findByIdAndDelete(cardId);
    if (!card) {
      return res.status(404).send({ message: 'Card not found' });
    }
    res.status(200).send({ message: 'card was deleted' });
  } catch (e) {
    res.status(500).send({ message: 'Server error' });
  }
};

const likeCard = async (req, res) => {
  try {
    const updatedCard = await cardModel.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedCard) {
      return res.status(404).send({ message: 'Card not found' });
    }
    return res.status(200).send(updatedCard);
  } catch (e) {
    return res.status(500).send({ message: 'Server error' });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const updatedCard = await cardModel.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedCard) {
      return res.status(404).send({ message: 'Card not found' });
    }
    return res.status(200).send(updatedCard);
  } catch (e) {
    return res.status(500).send({ message: 'Server error' });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
