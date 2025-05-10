const mongoose = require('mongoose');

const touristSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tourist name is required'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  visitDate: {
    type: Date,
    required: [true, 'Visit date is required'],
    validate: {
      validator: function(date) {
        // Compare only the date part (ignore time/timezone)
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset to midnight
        return date >= today;
      },
      message: 'Visit date must be today or in the future (YYYY-MM-DD format)'
    }
  },
  attractions: {
    type: [String],
    default: ['General Sightseeing']
  },
  budget: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Tourist', touristSchema);