const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const {
    createEvent,
    getEvents,
    getEvent,
    updateEvent,
    deleteEvent
} = require('../controllers/eventController');

// Event routes
router.post('/', upload.single('eventImage'), createEvent);
router.get('/', getEvents);
router.get('/:id', getEvent);
router.put('/:id', upload.single('eventImage'), updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;