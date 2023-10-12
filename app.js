require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const appRouter = require('./routes/index');
const { NOT_FOUND } = require('./utils/constants');
const { login, createUser } = require('./controllers/users');
const error = require('./middlewares/error');
const { errors } = require('celebrate');
const authMiddleware = require('./middlewares/auth');
const {
  loginValidator,
  registerValidator,
} = require('./utils/validators/userValidator');
const { DATABASE_URL, PORT } = require('./utils/config');

const app = express();
app.use(cookieParser());

mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Подключено к MongoDB');
  })
  .catch((e) => {
    console.error('Ошибка подключения к MongoDB:', e);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signin', loginValidator, login);
app.post('/signup', registerValidator, createUser);

app.use(authMiddleware);
app.use(appRouter);

app.use('*', (req, res) => {
  res.status(NOT_FOUND).send({
    message: 'The requested page was not found',
  });
});

app.use(errors());
app.use(error);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
