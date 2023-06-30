const express = require('express');
const app = express();
const port = process.env.PORT || 5000; // Replace with your desired port number

// Middleware to parse JSON body
app.use(express.json());

// Enable CORS middleware
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

// Define routes
app.get('/', (req, res) => {
  res.send('welcome to AssistantGPT');
});


// POST route
app.post('/assist', (req, res) => {
  // Extract data from the request body
  const { question } = req.body;
  res.send(question);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


