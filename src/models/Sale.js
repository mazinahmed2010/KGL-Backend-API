const mongoose = require('mongoose');

// Base schema - only define common fields that ALL sales will have
const saleSchema = new mongoose.Schema({
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  discriminatorKey: 'saleType' // This tells Mongoose which field to use as discriminator
});

// Create the base model
const Sale = mongoose.model('Sale', saleSchema);

// Cash Sale Schema - extends the base schema
const CashSale = Sale.discriminator('Cash', new mongoose.Schema({
  produceName: {
    type: String,
    required: [true, 'Produce name is required'],
    trim: true,
  },
  tonnage: {
    type: Number,
    required: [true, 'Tonnage is required'],
    min: [1, 'Tonnage must be at least 1 kg'],
  },
  amountPaid: {
    type: Number,
    required: [true, 'Amount paid is required'],
    min: [10000, 'Amount paid must be at least 10,000 UgX'],
  },
  buyerName: {
    type: String,
    required: [true, 'Buyer name is required'],
    trim: true,
    minlength: [2, 'Buyer name must be at least 2 characters'],
    match: [/^[a-zA-Z0-9\s]+$/, 'Buyer name must be alphanumeric'],
  },
  salesAgentName: {
    type: String,
    required: [true, 'Sales agent name is required'],
    trim: true,
    minlength: [2, 'Sales agent name must be at least 2 characters'],
    match: [/^[a-zA-Z0-9\s]+$/, 'Sales agent name must be alphanumeric'],
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
  }
}));

// Credit Sale Schema - extends the base schema
const CreditSale = Sale.discriminator('Credit', new mongoose.Schema({
  buyerName: {
    type: String,
    required: [true, 'Buyer name is required'],
    trim: true,
    minlength: [2, 'Buyer name must be at least 2 characters'],
    match: [/^[a-zA-Z0-9\s]+$/, 'Buyer name must be alphanumeric'],
  },
  nationalId: {
    type: String,
    required: [true, 'National ID is required'],
    match: [/^[A-Z0-9]{10,15}$/, 'Please enter a valid NIN'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    minlength: [2, 'Location must be at least 2 characters'],
    match: [/^[a-zA-Z0-9\s]+$/, 'Location must be alphanumeric'],
  },
  contacts: {
    type: String,
    required: [true, 'Contact number is required'],
    match: [/^[0-9]{10,12}$/, 'Please enter a valid phone number'],
  },
  amountDue: {
    type: Number,
    required: [true, 'Amount due is required'],
    min: [10000, 'Amount due must be at least 10,000 UgX'],
  },
  salesAgentName: {
    type: String,
    required: [true, 'Sales agent name is required'],
    trim: true,
    minlength: [2, 'Sales agent name must be at least 2 characters'],
    match: [/^[a-zA-Z0-9\s]+$/, 'Sales agent name must be alphanumeric'],
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
  },
  produceName: {
    type: String,
    required: [true, 'Produce name is required'],
    trim: true,
  },
  produceType: {
    type: String,
    required: [true, 'Produce type is required'],
    trim: true,
  },
  tonnage: {
    type: Number,
    required: [true, 'Tonnage is required'],
    min: [1, 'Tonnage must be at least 1 kg'],
  },
  dispatchDate: {
    type: Date,
    required: [true, 'Dispatch date is required'],
    default: Date.now,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paymentDate: {
    type: Date,
  }
}));

module.exports = { Sale, CashSale, CreditSale };