const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: [true, 'Event name is required'] },
  eventLocation: String,
  eventCategory: { type: String, required: [true, 'Event category is required'] },
  clubName: { type: String, required: [true, 'Club name is required'] },
  eventDescription: { type: String, required: [true, 'Description is required'] },
  eventImage: { type: String, required: [true, 'Image is required'] },
  startTime: { type: Date, required: [true, 'Start time is required'] },
  endTime: { type: Date, required: [true, 'End time is required'] },
  attendance: { type: String, required: [true, 'Attendance type is required'] },
  targetAudience: String,
  expectedAudience: Number,
  status: { type: String, required: [true, 'Status is required'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema); 