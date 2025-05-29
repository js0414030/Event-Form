// // const cloudinary = require('cloudinary').v2;
// // const { CloudinaryStorage } = require('multer-storage-cloudinary');

// // // Configure Cloudinary
// // cloudinary.config({
// //   cloud_name: dwgpelc7q,
// //   api_key: 922288566677691,
// //   api_secret: wfH3BBrqWdlZ09bdPzKJ1BvOqeU
// // });

// // // Set up storage engine
// // const storage = new CloudinaryStorage({
// //   cloudinary: cloudinary,
// //   params: {
// //     folder: 'event_images',
// //     allowed_formats: ['jpg', 'jpeg', 'png'],
// //     transformation: [{ width: 500, height: 500, crop: 'limit' }]
// //   }
// // });

// // const upload = multer({ storage });

// // module.exports = {
// //   cloudinary,
// //   upload  // Make sure this is exported
// // };

// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const multer = require('multer');
// require('dotenv').config(); // Load .env file

// // Configure Cloudinary with environment variables
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // Set up storage engine
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'event_images',
//     allowed_formats: ['jpg', 'jpeg', 'png'],
//     transformation: [{ width: 500, height: 500, crop: 'limit' }]
//   }
// });

// const upload = multer({ storage });

// module.exports = {
//   cloudinary,
//   upload
// };



const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'event_images',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

const upload = multer({ storage });

module.exports = {
  cloudinary,
  upload
};