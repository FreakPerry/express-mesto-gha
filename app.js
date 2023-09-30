const express = require('express');
const mongoose = require('mongoose');
const appRouter = require('./routes/index');

const app = express();
const port = 3000;

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
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
app.use((req, res, next) => {
  req.user = {
    _id: '65155526cdffa84145d3fb37',
  };

  next();
});
app.use(appRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('Привет, мир!');
});