const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  createGroup,
  getMyGroups,
  discoverGroups,
  getGroupById,
  joinGroup,
  leaveGroup,
  addStudentToGroup,
  createGroupValidators,
  groupIdValidators,
  listMyGroupsValidators,
  discoverGroupsValidators,
  addStudentValidators,
} = require('../controllers/group.controller');

const router = express.Router();

router.post('/', requireAuth, requireRole('mentor'), createGroupValidators, validate, createGroup);

router.get('/my-groups', requireAuth, listMyGroupsValidators, validate, getMyGroups);
router.get('/discover', requireAuth, discoverGroupsValidators, validate, discoverGroups);

router.get('/:id', requireAuth, groupIdValidators, validate, getGroupById);
router.post('/:id/join', requireAuth, groupIdValidators, validate, joinGroup);
router.post('/:id/leave', requireAuth, groupIdValidators, validate, leaveGroup);

router.post(
  '/:id/add-student',
  requireAuth,
  requireRole('mentor'),
  addStudentValidators,
  validate,
  addStudentToGroup
);

module.exports = router;

