const express = require('express');
const mongoose = require('mongoose');
const router = require('./database/routes/alarms.js');
const cors = require('cors');
const DATABASE_URL = "mongodb://localhost/alarms";
const app = express();

const corsOptions = {
  origin: 'http://127.0.0.1:5173', // Replace with the actual client domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
mongoose.connect(DATABASE_URL, { useNewUrlParser: true }).then(() => {
  console.log("Connected to database");
})
  .catch((error) => {
    console.log("Error connecting to database:", error);
  });
app.use(cors(corsOptions));
/*const db = mongoose.connection;
//.on will call the 2nd parameter function when something specific happens
//that is specified in the 1st paramater (in this case if there is an error, call the error function)
db.on('error', (error) => console.error(error));
//.once will call the 2nd paramater function once when the database is open once
db.once('open', () => console.log('Connected to Database'));
//first parameter of .get() is the route or the url you want to go to webpages, databases, and etc
//use middle ware whenever there is a request to a specific route, it calls the function before the request goes through (example: if you need to validate something, change data,)
//route specified in the 1st parameter (if 1st paramater isnt provided, it will be called for all routes)
app.use(express.json())
*/
//this is a middleware to bring in the necessary routes depending on
/*app.get('/', (req, res) => {
  res.send('We are on home');
});*/
app.use(express.json());
app.use('/alarms', router);
app.listen(3000, () => console.log('Server Started'));

