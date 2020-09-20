const express = require("express");
const path = require("path");
const mysql = require("mysql");
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");
dotenv.config({ path: './.env' });
const app = express();
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
console.log(__dirname);
app.set('view engine', 'hbs');
db.connect((err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("Mysql connected...");

    }
})
//app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.get("/", (req, res) => {
    //res.send("HOME PAGE")
    res.render("index")
});
app.get("/register", (req, res) => {
    //res.send("HOME PAGE")
    res.render("register")
});
app.get("/login", (req, res) => {
    //res.send("HOME PAGE")
    res.render("login")
});
const port = 5000;
app.listen(port, () => {
    console.log(`Server started on ${port} Port`);
});