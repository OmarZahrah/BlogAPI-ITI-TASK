const express = require('express');
const groupController = require('../controllers/groupController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { groupSchema } = require('../utils/validators');

const router = express.Router();

router.use(authMiddleware);

router.post('/', validate(groupSchema), groupController.createGroup);
router.get('/', groupController.getGroups);
router.get('/:id', groupController.getGroup);
router.post('/:id/add-member', groupController.addMember);
router.delete('/:id/remove-member', groupController.removeMember);
router.post('/:id/grant-permission', groupController.grantPermission);
router.delete('/:id/revoke-permission', groupController.revokePermission);

module.exports = router;
