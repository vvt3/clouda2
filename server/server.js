const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const cors = require('cors');
const app = express();
const port = 3000;
require("dotenv").config();

// Middleware
app.use(cors());

// Set up a multer storage to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to upload to S3
const uploadToS3 = async (userFile) => {
  const S3_BUCKET = "clouda2-g30";

  const params = {
    Bucket: S3_BUCKET,
    Key: userFile.name,
    Body: userFile,
  };

  var upload = s3
    .putObject(params)
    .on("httpUploadProgress", (evt) => {
      console.log(
        "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
      );
    })
    .promise();

  await upload.then((err, data) => {
    console.log(err);
    alert("File uploaded successfully.");
  });
};

// Upload to S3 endpoint
app.post('/upload', upload.single('image'), (req, res) => {
  
  // Check if an image was uploaded
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  uploadToS3(req.file);

  return express.json("File uploaded S3")

});


// Define your routes here
app.get('/', (req, res) => {
  const response = { message: 'Hello, World!' };
  res.json(response);
});

// resize endpoint
// app.post('/resize', upload.single('image'), (req, res) => {
//   // Check if an image was uploaded
//   if (!req.file) {
//     return res.status(400).json({ error: 'No image file provided' });
//   }

//   // Parse width height
//   const width = parseInt(req.body.width, 10) || 300;
//   const height = parseInt(req.body.height, 10) || 200;

//   sharp(req.file.buffer)
//     .resize(width, height)
//     .toBuffer()
//     .then((resizedImageBuffer) => {
//       const bucketName = 'clouda2-g30';
//       const key = 'formatted/image.jpg'; // add random number?

//       // Upload to s3
//       s3.upload(
//         {
//           Bucket: bucketName,
//           Key: key,
//           Body: resizedImageBuffer,
//           ACL: 'public-read', // permissions look up
//         },
//         (err, data) => {
//           if (err) {
//             return res.status(500).json({ error: 'S3 upload failed' });
//           }

//           // Send the S3 URL back to the client
//           res.json({ s3Url: data.Location });
//         }
//       );
//     })
//     .catch((error) => {
//       res.status(500).json({ error: 'Image resizing failed' });
//     });
// });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
