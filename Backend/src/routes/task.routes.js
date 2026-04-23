const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  createTask,
  listTasks,
  getTaskById,
  updateTask,
  deleteTask,
  createTaskValidators,
  listTasksValidators,
  taskIdValidators,
} = require('../controllers/task.controller');

const router = express.Router();

router.post('/', requireAuth, requireRole('mentor'), createTaskValidators, validate, createTask);
router.get('/', requireAuth, listTasksValidators, validate, listTasks);
router.get('/:id', requireAuth, taskIdValidators, validate, getTaskById);
router.put('/:id', requireAuth, taskIdValidators, validate, updateTask);
router.delete('/:id', requireAuth, requireRole('mentor'), taskIdValidators, validate, deleteTask);

module.exports = router;

