const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
const app = express();
const port = 3000;
const multer = require("multer");
const upload = multer();
const { spawn } = require('child_process');

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
  //console.log("Received file: ", userFile.originalname);
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
  // Check if an image was uploaded
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }
  //image conversion using ImageMagick
  // Temp buffer
  //const outputBuffer = Buffer.from([]);
  //const outputName = "output_" + Date.now() + ".jpg";
  //const outputPath = path.join(__dirname, "temp", outputName);

  const convertArgs = [
    'jpg:-',
    '-resize',
    `${width}x${height}`,
    'jpg:-',
  ];
  const convert = spawn('/usr/bin/convert', convertArgs);

  convert.stdout.on('data', data => {
    console.log(`stdout: ${data}`);
  });

  convert.stderr.on('data', data => {
    console.error(`stderr: ${data}`);
  });

  convert.on('close', code => {
    if (code === 0) {
      // Conversion successful
      res.contentType('image/jpeg');
      res.sendFile('output.jpg');
    } else {
      // Conversion failed
      res.status(500).send('Image conversion failed.');
    }
  });

});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
