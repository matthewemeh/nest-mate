const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);

const { connection } = mongoose;
connection.once('open', () => console.log('MongoDB database connection established successfully'));

const roomRoutes = require('./routes/room');
const userRoutes = require('./routes/user');
const entryRoutes = require('./routes/entry');
const emailRoutes = require('./routes/email');
const hostelRoutes = require('./routes/hostel');
const ratingRoutes = require('./routes/rating');
const reservationRoutes = require('./routes/reservation');

app.use('/users', userRoutes);
app.use('/rooms', roomRoutes);
app.use('/email', emailRoutes);
app.use('/entries', entryRoutes);
app.use('/hostels', hostelRoutes);
app.use('/ratings', ratingRoutes);
app.use('/reservations', reservationRoutes);

app.use(express.urlencoded({ extended: true }));

app.listen(port, () => console.log(`Server is running on port: ${port}`));
