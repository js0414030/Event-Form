const Event = require('../models/Event');

// Create event
const createEvent = async (req, res) => {
  try {
    const requiredFields = [
      'eventName', 'eventCategory', 'clubName',
      'eventDescription', 'startTime', 'endTime',
      'attendance', 'status'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0 || !req.file) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}${!req.file ? ', eventImage' : ''}`
      });
    }

    const eventData = {
      ...req.body,
      eventImage: req.file.path
    };

    const event = await Event.create(eventData);
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(el => el.message);
      return res.status(400).json({
        success: false,
        error: `Validation error: ${errors.join(', ')}`
      });
    }
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// Get all events with pagination
const getEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const events = await Event.find()
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Event.countDocuments();

    res.status(200).json({
      success: true,
      data: events,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get single event
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// // Update event
// const updateEvent = async (req, res) => {
//   try {
//     const event = await Event.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         error: 'Event not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: event
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       error: err.message
//     });
//   }
// };



// thi sis the above code commit exchange
const updateEvent = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // If a new image was uploaded, use its path
    if (req.file) {
      updateData.eventImage = req.file.path;
    } else if (req.body.eventImage && typeof req.body.eventImage === 'string') {
      // Keep existing image if no new one was uploaded
      updateData.eventImage = req.body.eventImage;
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(el => el.message);
      return res.status(400).json({
        success: false,
        error: `Validation error: ${errors.join(', ')}`
      });
    }
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};





// Delete event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent
};