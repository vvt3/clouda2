const express = require('express');
const sharp = require('sharp');
const multer = require('multer');
const AWS = require('aws-sdk');

const app = express();
const port = 3000;

// Middleware


// Set up a multer storage to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// S3 config
const s3 = new AWS.S3({
  accessKeyId: '',
  secretAccessKey: '',
});

// Define your routes here
app.get('/', (req, res) => {
  const response = { message: 'Hello, World!' };
  res.json(response);
});

// resize endpoint
app.post('/resize', upload.single('image'), (req, res) => {
  // Check if an image was uploaded
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  // Parse width height
  const width = parseInt(req.body.width, 10) || 300;
  const height = parseInt(req.body.height, 10) || 200;

  sharp(req.file.buffer)
    .resize(width, height)
    .toBuffer()
    .then((resizedImageBuffer) => {
      const bucketName = 'clouda2-g30';
      const key = 'formatted/image.jpg'; // add random number?

      // Upload to s3
      s3.upload(
        {
          Bucket: bucketName,
          Key: key,
          Body: resizedImageBuffer,
          ACL: 'public-read', // permissions look up
        },
        (err, data) => {
          if (err) {
            return res.status(500).json({ error: 'S3 upload failed' });
          }

          // Send the S3 URL back to the client
          res.json({ s3Url: data.Location });
        }
      );
    })
    .catch((error) => {
      res.status(500).json({ error: 'Image resizing failed' });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
