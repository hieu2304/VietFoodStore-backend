const express = require("express");
const cors = require("cors");
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser')
const app = express();
const morgan  = require('morgan')

app.use(
    cookieSession({
        name: 'VietFood',
        keys: ['VietFood'],
        maxAge: 24 * 60 * 60 * 1000 //24h
    })
);
app.use(morgan('combined'))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use('/api', require('./api'));
app.get("/", (req, res) => {
    res.json({ message: "Return server app" });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
  });