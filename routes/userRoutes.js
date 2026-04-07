const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const restrictTo = require('../middleware/restrictTo');

const router = express.Router();

router.use(authMiddleware);

router.get('/', restrictTo('super-admin'), userController.getUsers);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
