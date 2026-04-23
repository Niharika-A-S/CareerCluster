const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, lowercase: true, unique: true, required: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['mentor', 'mentee'], required: true, index: true },
    interests: { type: [String], default: [], index: true },
    profile: {
      title: { type: String, default: '' },
      bio: { type: String, default: '' },
      company: { type: String, default: '' },
      location: { type: String, default: '' },
      avatarUrl: { type: String, default: '' },
      availability: {
        type: [
          {
            dayOfWeek: { type: Number, min: 0, max: 6, required: true },
            start: { type: String, required: true }, // "09:00"
            end: { type: String, required: true }, // "17:00"
          },
        ],
        default: [],
      },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.methods.verifyPassword = async function verifyPassword(plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.statics.hashPassword = async function hashPassword(plain) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(plain, salt);
};

userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    interests: this.interests,
    profile: this.profile,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const User = mongoose.model('User', userSchema);

module.exports = User;

