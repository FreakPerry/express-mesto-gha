const router = require('express').Router();
const {
  getUserById,
  getUsers,
  updateUserById,
  updateUserAvatar,
  getMe,
} = require('../controllers/users');
const {
  userInfoValidator,
  avatarValidator,
  userIdValidator,
} = require('../utils/validators/userValidator');

router.get('/me', getMe);
router.get('/', getUsers);
router.patch('/me', userInfoValidator, updateUserById);
router.patch('/me/avatar', avatarValidator, updateUserAvatar);
router.get('/:userId', userIdValidator, getUserById);

module.exports = router;
