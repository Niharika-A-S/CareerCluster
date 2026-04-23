const { body, param, query } = require('express-validator');
const Group = require('../models/Group');
const User = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');
const { fail, ok } = require('../utils/apiResponse');

const createGroupValidators = [
  body('groupName').isString().trim().notEmpty(),
  body('description').optional().isString(),
  body('interest').isString().trim().notEmpty(),
  body('isDiscoverable').optional().isBoolean(),
];

const groupIdValidators = [param('id').isString().notEmpty()];

const listMyGroupsValidators = [query('interest').optional().isString()];
const discoverGroupsValidators = [query('interest').optional().isString()];

const addStudentValidators = [param('id').isString().notEmpty(), body('studentId').isString().notEmpty()];

const createGroup = asyncHandler(async (req, res) => {
  const group = await Group.create({
    groupName: req.body.groupName,
    description: req.body.description || '',
    interest: req.body.interest,
    createdBy: req.user.id,
    isDiscoverable: req.body.isDiscoverable !== undefined ? req.body.isDiscoverable : true,
    members: [{ user: req.user.id, roleInGroup: 'mentor' }],
  });

  return ok(res, { data: { group } }, 201);
});

const getMyGroups = asyncHandler(async (req, res) => {
  const filter = { 'members.user': req.user.id };
  if (req.query.interest) filter.interest = req.query.interest;

  const groups = await Group.find(filter).sort({ updatedAt: -1 }).exec();
  return ok(res, { data: { groups } });
});

const discoverGroups = asyncHandler(async (req, res) => {
  const filter = { isDiscoverable: true };
  if (req.query.interest) filter.interest = req.query.interest;

  // exclude groups user already joined
  const groups = await Group.find({
    ...filter,
    members: { $not: { $elemMatch: { user: req.user.id } } },
  })
    .sort({ createdAt: -1 })
    .exec();

  return ok(res, { data: { groups } });
});

const getGroupById = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id)
    .populate('createdBy', 'name role profile')
    .populate('members.user', 'name role profile')
    .exec();
  if (!group) throw fail('Group not found', 404);
  return ok(res, { data: { group } });
});

const joinGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id).exec();
  if (!group) throw fail('Group not found', 404);

  const already = group.members.some((m) => m.user.toString() === req.user.id);
  if (already) return ok(res, { data: { group } });

  group.members.push({ user: req.user.id, roleInGroup: req.user.role });
  await group.save();

  return ok(res, { data: { group } });
});

const leaveGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id).exec();
  if (!group) throw fail('Group not found', 404);

  // creator mentor cannot leave their own group
  if (group.createdBy.toString() === req.user.id) {
    throw fail('Group owner cannot leave the group', 400);
  }

  group.members = group.members.filter((m) => m.user.toString() !== req.user.id);
  await group.save();
  return ok(res, { data: { group } });
});

const addStudentToGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id).exec();
  if (!group) throw fail('Group not found', 404);
  if (group.createdBy.toString() !== req.user.id) throw fail('Forbidden', 403);

  const student = await User.findOne({ _id: req.body.studentId, role: 'mentee', isActive: true }).exec();
  if (!student) throw fail('Student not found', 404);

  const already = group.members.some((m) => m.user.toString() === student._id.toString());
  if (already) return ok(res, { data: { group } });

  group.members.push({ user: student._id, roleInGroup: 'mentee' });
  await group.save();
  return ok(res, { data: { group } });
});

module.exports = {
  createGroupValidators,
  groupIdValidators,
  listMyGroupsValidators,
  discoverGroupsValidators,
  addStudentValidators,
  createGroup,
  getMyGroups,
  discoverGroups,
  getGroupById,
  joinGroup,
  leaveGroup,
  addStudentToGroup,
};

