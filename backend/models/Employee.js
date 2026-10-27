const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, 'Ma nhan vien la bat buoc'],
      unique: true,
      trim: true
    },
    fullName: {
      type: String,
      required: [true, 'Ho ten la bat buoc'],
      trim: true
    },
    gender: {
      type: String,
      enum: ['Nam', 'Nu', 'Khac'],
      default: 'Khac'
    },
    dateOfBirth: {
      type: Date
    },
    department: {
      type: String,
      trim: true
    },
    position: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email la bat buoc'],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    hireDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Dang lam viec', 'Da nghi viec', 'Tam nghi'],
      default: 'Dang lam viec'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Employee', employeeSchema);
