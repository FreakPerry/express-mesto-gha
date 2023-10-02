const router = require('express').Router();
const {
  createUser,
  getUserById,
  getUsers,
  updateUserById,
  updateUserAvatar,
} = require('../controllers/users');

router.post(createUser);
router.get(getUsers);
router.get('/:userId', getUserById);
router.patch('/me', updateUserById);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
