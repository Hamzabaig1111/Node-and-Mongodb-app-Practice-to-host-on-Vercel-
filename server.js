const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB to connect with live Mongodb
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define a sample schema
const SampleSchema = new mongoose.Schema({
  name: String,
  age: Number
});

const SampleModel = mongoose.model('Sample', SampleSchema);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve HTML form
app.get('/', (req, res) => {
  res.send(`
    <form action="/" method="POST">
      <label for="name">Name:</label><br>
      <input type="text" id="name" name="name"><br>
      <label for="age">Age:</label><br>
      <input type="number" id="age" name="age"><br><br>
      <button type="submit">Submit</button>
    </form>
  `);
});

// Define routes
app.get('/samples', async (req, res) => {
  try {
    const samples = await SampleModel.find();
    res.json(samples);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/', async (req, res) => {
  const sample = new SampleModel({
    name: req.body.name,
    age: req.body.age
  });

  try {
    const newSample = await sample.save();
    res.status(201).json(newSample);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
