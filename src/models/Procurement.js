const mongoose = require('mongoose');

const procurementSchema = new mongoose.Schema({
  produceName: {
    type: String,
    required: [true, 'Produce name is required'],
    trim: true,
    match: [/^[a-zA-Z0-9\s]+$/, 'Produce name must be alphanumeric'],
  },
  produceType: {
    type: String,
    required: [true, 'Produce type is required'],
    trim: true,
    minlength: [2, 'Produce type must be at least 2 characters'],
    match: [/^[a-zA-Z\s]+$/, 'Produce type must contain only letters'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now,
  },
  time: {
    type: String,
    required: [true, 'Time is required'],
    validate: {
      validator: function(v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Please enter a valid time (HH:MM)',
    },
  },
  tonnage: {
    type: Number,
    required: [true, 'Tonnage is required'],
    min: [100, 'Tonnage must be at least 100 kg'],
    validate: {
      validator: Number.isInteger,
      message: 'Tonnage must be a whole number',
    },
  },
  cost: {
    type: Number,
    required: [true, 'Cost is required'],
    min: [10000, 'Cost must be at least 10,000 UgX'],
  },
  dealerName: {
    type: String,
    required: [true, 'Dealer name is required'],
    trim: true,
    minlength: [2, 'Dealer name must be at least 2 characters'],
    match: [/^[a-zA-Z0-9\s]+$/, 'Dealer name must be alphanumeric'],
  },
  branch: {
    type: String,
    required: [true, 'Branch is required'],
    enum: {
      values: ['Maganjo', 'Matugga'],
      message: 'Branch must be either Maganjo or Matugga',
    },
  },
  contact: {
    type: String,
    required: [true, 'Contact number is required'],
    match: [/^[0-9]{10,12}$/, 'Please enter a valid phone number'],
  },
  sellingPrice: {
    type: Number,
    required: [true, 'Selling price is required'],
    min: [1000, 'Selling price must be at least 1,000 UgX'],
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Procurement', procurementSchema);