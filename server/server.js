const express = require('express');
const bodyParser = require('body-parser');

const app = express();
//const port = process.env.PORT || 3000;
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Define your routes here
app.get('/', (req, res) => {
  const response = { message: 'Hello, World!' };
  res.json(response);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
