const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas Connection
const DB_URI = 'mongodb+srv://haneeshdabbadi:dabbadihaneesh@cluster0.pmazw.mongodb.net/test?retryWrites=true&w=majority';

require('dotenv').config();
mongoose.connect(DB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
	.then(() => console.log('Connected to MongoDB Atlas'))
	.catch((error) => console.error('Error connecting to MongoDB:', error));

// Routes
app.use('/api/events', eventRoutes);

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
