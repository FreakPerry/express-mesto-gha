const { Joi, celebrate } = require('celebrate');

const cardIdValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});

const cardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string()
      .required()
      .pattern(/^https?:\/\/.+\.(png|jpg|jpeg|gif|bmp|svg)$/),
  }),
});

module.exports = {
  cardIdValidator,
  cardValidator,
};
