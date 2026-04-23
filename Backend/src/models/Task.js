const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true, index: true },
    title: { type: String, trim: true, required: true },
    description: { type: String, default: '' },
    domain: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, // mentor
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true }, // mentee optional
    dueDate: { type: Date, default: null },
    status: { type: String, enum: ['open', 'in_progress', 'done'], default: 'open', index: true },
  },
  { timestamps: true }
);

taskSchema.index({ title: 'text', description: 'text', domain: 'text' });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

