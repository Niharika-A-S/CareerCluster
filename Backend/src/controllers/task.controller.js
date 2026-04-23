const { body, param, query } = require('express-validator');
const Group = require('../models/Group');
const Task = require('../models/Task');
const User = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');
const { fail, ok } = require('../utils/apiResponse');

const createTaskValidators = [
  body('groupId').isString().notEmpty(),
  body('title').isString().trim().notEmpty(),
  body('description').optional().isString(),
  body('domain').optional().isString(),
  body('assignedTo').optional().isString(),
  body('dueDate').optional().isISO8601(),
];

const listTasksValidators = [query('groupId').optional().isString(), query('assignedToMe').optional().isBoolean().toBoolean()];

const taskIdValidators = [param('id').isString().notEmpty()];

const createTask = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.body.groupId).exec();
  if (!group) throw fail('Group not found', 404);
  if (group.createdBy.toString() !== req.user.id) throw fail('Forbidden', 403);

  let assignedTo = null;
  if (req.body.assignedTo) {
    const user = await User.findOne({ _id: req.body.assignedTo, isActive: true }).exec();
    if (!user) throw fail('Assigned user not found', 404);
    assignedTo = user._id;
  }

  const task = await Task.create({
    group: group._id,
    title: req.body.title,
    description: req.body.description || '',
    domain: req.body.domain || group.interest,
    createdBy: req.user.id,
    assignedTo,
    dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null,
  });

  return ok(res, { data: { task } }, 201);
});

const listTasks = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.groupId) filter.group = req.query.groupId;
  if (req.query.assignedToMe) filter.assignedTo = req.user.id;

  // Safe defaults to avoid leaking tasks across groups:
  // - mentors see tasks they created unless they filter by group
  // - mentees see tasks assigned to them unless they filter by group
  if (!req.query.groupId && !req.query.assignedToMe) {
    if (req.user.role === 'mentor') filter.createdBy = req.user.id;
    else filter.assignedTo = req.user.id;
  }

  if (req.query.groupId) {
    const group = await Group.findById(req.query.groupId).exec();
    if (!group) throw fail('Group not found', 404);
    const isMember = group.members.some((m) => m.user.toString() === req.user.id);
    if (!isMember && group.createdBy.toString() !== req.user.id) throw fail('Forbidden', 403);
  }

  const tasks = await Task.find(filter)
    .populate('assignedTo', 'name email role')
    .populate('group', 'groupName interest')
    .sort({ createdAt: -1 })
    .exec();
  return ok(res, { data: { tasks } });
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).exec();
  if (!task) throw fail('Task not found', 404);

  const group = await Group.findById(task.group).exec();
  if (!group) throw fail('Group not found', 404);
  const isMember = group.members.some((m) => m.user.toString() === req.user.id);
  if (!isMember && group.createdBy.toString() !== req.user.id) throw fail('Forbidden', 403);

  return ok(res, { data: { task } });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).exec();
  if (!task) throw fail('Task not found', 404);

  const group = await Group.findById(task.group).exec();
  if (!group) throw fail('Group not found', 404);

  const isOwnerMentor = group.createdBy.toString() === req.user.id;
  const isAssignee = task.assignedTo?.toString() === req.user.id;

  if (!isOwnerMentor && !isAssignee) throw fail('Forbidden', 403);

  // Mentor can edit everything; mentee can only update status.
  const allowAll = isOwnerMentor;
  const allowed = allowAll ? ['title', 'description', 'domain', 'assignedTo', 'dueDate', 'status'] : ['status'];
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) task[k] = req.body[k];
  });

  await task.save();
  return ok(res, { data: { task } });
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).exec();
  if (!task) throw fail('Task not found', 404);

  const group = await Group.findById(task.group).exec();
  if (!group) throw fail('Group not found', 404);
  if (group.createdBy.toString() !== req.user.id) throw fail('Forbidden', 403);

  await task.deleteOne();
  return ok(res, { message: 'Task deleted' });
});

module.exports = {
  createTaskValidators,
  listTasksValidators,
  taskIdValidators,
  createTask,
  listTasks,
  getTaskById,
  updateTask,
  deleteTask,
};

