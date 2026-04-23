const mongoose = require('mongoose');

const groupMemberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    roleInGroup: { type: String, enum: ['mentor', 'mentee'], required: true },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const groupSchema = new mongoose.Schema(
  {
    groupName: { type: String, trim: true, required: true },
    description: { type: String, default: '' },
    interest: { type: String, trim: true, required: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    members: { type: [groupMemberSchema], default: [] },
    isDiscoverable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

groupSchema.index({ groupName: 'text', description: 'text', interest: 'text' });

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;

