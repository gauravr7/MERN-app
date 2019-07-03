const express = require('express');
const mongoose = require('mongoose');

const app = express();

//DB Config
const db = require('./config/keys').mongoURI;

//connect to mongo DB
mongoose
.connect(db, { useNewUrlParser: true })
.then(() => console.log('MongoDB Connected'))
.catch( err => console.log(err));

app.get('/', (req, res) => res.send('Hello again')); 

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on ${port}`));