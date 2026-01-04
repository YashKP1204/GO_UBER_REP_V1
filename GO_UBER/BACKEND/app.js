const dotenv = require('dotenv');
dotenv.config();

const cors  = require('cors');
const express = require('express'); 
const { connectToDb } = require('./db/db');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require('./routes/user.routes');
connectToDb();

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/users', userRoutes);

module.exports = app;