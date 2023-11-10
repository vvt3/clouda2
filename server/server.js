const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
const app = express();
const port = 3000;
const multer = require("multer");
const upload = multer();
const gm = require('gm').subClass({ imageMagick: true });

// Middleware
app.use(cors());
app.use(express.json());

const s3 = new AWS.S3();
const S3_BUCKET = 'clouda2-g30';

//Test Endpoint
app.post('/testing', upload.single("file"), (req, res) => {
  console.log("Received file: ", req.file);
});

// Upload to S3 endpoint
app.post('/upload', upload.single("file"), (req, res) => {
  const userFile = req.file;
  // Check if an image was uploaded
  if (!userFile) {
    return res.status(400).json({ error: 'No image file provided' });
  }
  //Buffer
  let buff = Buffer.from(userFile.buffer, "binary");
  //Key
  let key = userFile.originalname;

  // Prepare parameters
  const params = {
    Bucket: S3_BUCKET,
    Key: key,
    Body: buff,
  };

  s3.upload(params, (error, data) => {
    if (error) {
      console.log(error);
      return res.status(500).send('S3 upload failed.');
    }
  })

  // Provide a success response
  res.status(200).send('File ', key,  ' was uploaded to S3.');
});

// Define your routes here
app.get('/', (req, res) => {
  const response = { message: 'Hello, World!' };
  res.json(response);
});

//Resize endpoint
app.post('/resize', upload.single('file'), (req, res) => {
  const userFile = req.file;
  const width = req.body.width;
  const height = req.body.height;

  if (!userFile) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  // Perform image resizing using gm
  gm(userFile.buffer)
    .resize(width, height)
    .toBuffer('JPEG', (err, buffer) => {
      if (err) {
        console.error('Image conversion failed:', err);
        return res.status(500).send('Image conversion failed.');
      }

      res.contentType('image/jpeg');
      res.send(buffer);
            console.log("Conversion Sucess!");
    });
});

// Get s3 endpoint
app.get("/gets3", (req, res) => {
  const fileName = req.query.fileName;
  // Set up parameters for getObject method
  const params = {
    Bucket: S3_BUCKET,
    Key: fileName,
  };
  // Use getObject to retrieve the file
  s3.getObject(params, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving file from S3');
    }
    // Set response headers based on the S3 response
    res.set({
      'Content-Type': data.ContentType,
      'Content-Length': data.ContentLength,
    });

    // Send the file data in the response
    res.send(data.Body);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
