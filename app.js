const express = require("express");
const path = require("path");
const mysql = require("mysql");
const knex = require("knex");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var session = require('express-session');
const dotenv = require("dotenv");
dotenv.config({ path: './.env' });
const app = express();
var deposit = require('./controllers/function');
var withdraw = require('./controllers/function');
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('secret'));
app.use(session({
    secret: 'secret',
    maxAge: 12000,
    resave: true,
    saveUninitialized: true,
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//console.log(__dirname);
app.set('view engine', 'hbs');
db.connect((err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("Mysql connected...");

    }
})
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
//console.log(deposit(1000));
//console.log(withdraw(10000, 5000));

// get customer details
app.get('/profile/:id', (req, res) => {
    db.query('SELECT * FROM users WHERE ID = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            //console.log(rows);
            //res.send(rows);
            res.render('profile', { customer: rows[0] });
        }
        else
            console.log(err);
    })
});
//get bankers details
app.get('/bankerprofile/:id', (req, res) => {
    db.query('SELECT * FROM banker WHERE ID = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            //console.log(rows);
            //res.send(rows);
            res.render('bankerprofile', { banker: rows[0] });
        }
        else
            console.log(err);
    })
});
// get all users
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            //res.send(rows);
            //const users = rows[0]
            //console.log(user)
            res.render('list', { title: 'Customers list', user: rows[0] });
        }
        else {
            console.log(err);
        }
    });
});

//delete
//app.delete('/users/:id', (req, res) => {
//    db.query('Delete FROM users WHERE id = ?', [req.params.id], (err, rows, fields) => {
//        if (!err)
//            //console.log(rows);
//            res.send('Deleted successfully!!');
//        else
//            console.log(err);
//    })
//});
//deposit money
app.put('/deposit/:id', (req, res) => {

    var sql = "UPDATE users SET balance='15000' where id=? ";

    db.query(sql, [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deposit Successfully!!');
        else
            console.log(err);
    });
});
//withdraw money
app.put('/withdraw/:id', (req, res) => {

    var sql = "UPDATE users SET balance='15000' where id=? ";

    db.query(sql, [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('withdraw Successfully!!');
        else
            console.log(err);
    });
});
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on ${port} Port`);
});
module.exports = db;