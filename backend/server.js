const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const PORT = process.env.PORT || 4000;

dotenv.config();
const app = express();


app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

app.use(cors({
    origin: '',
  }));

app.use(express.json());


app.get('/generate-grid', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });  