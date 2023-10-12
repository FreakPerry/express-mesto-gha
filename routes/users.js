const router = require('express').Router();
const {
  getUserById,
  getUsers,
  updateUserById,
  updateUserAvatar,
  getMe,
} = require('../controllers/users');

router.get('/me', getMe);
router.get('/', getUsers);
router.patch('/me', updateUserById);
router.patch('/me/avatar', updateUserAvatar);
router.get('/:userId', getUserById);

module.exports = router;
