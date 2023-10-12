const router = require('express').Router();

const usersRouter = require('./users');
const cardsRouter = require('./cards');
const authMiddleware = require('../middlewares/auth');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

module.exports = router;
