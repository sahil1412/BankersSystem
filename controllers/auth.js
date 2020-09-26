const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});


exports.login = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).render('login', {
                message: 'please enter valid email and password'
            });
        }
        db.query(`SELECT * FROM users WHERE email =?`, [email], async (err, result) => {
            console.log(result);
            if (!result || !(await bcrypt.compare(password, result[0].password))) {
                res.status(401).render('login', {
                    message: 'Invalid Email or Password'
                })
            }
            else {
                const id = result[0].id;

                const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                console.log('the token is:' + token);
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 100
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect(`/profile/${result[0].id}`);
            }
        })
    } catch (err) {
        console.log(err)
    }
}

exports.loginBanker = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).render('loginBanker', {
                message: 'please enter valid email and password'
            });
        }
        db.query(`SELECT * FROM banker WHERE email =?`, [email], async (err, result) => {
            console.log(result);
            if (!result || !(await bcrypt.compare(password, result[0].password))) {
                res.status(401).render('loginBanker', {
                    message: 'Invalid Email or Password'
                })
            } else {
                const id = result[0].id;

                const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                console.log('the token is:' + token);
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 5 * 60 * 100
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect(`/bankerprofile/${result[0].id}`);
            }
        })
    } catch (err) {
        console.log(err)
    }
}

exports.register = (req, res) => {
    console.log(req.body);
    //res.send("Form submitted");

    const { name, email, password, passwordconfirm, mobile } = req.body;

    if (req.body.usertype == 'Customer') {
        db.query(`SELECT email FROM users WHERE email=?`, [email], async (err, result) => {
            if (err) {
                res.send()
            }
            if (result.length > 0) {
                return res.render('register', {
                    message: 'user already exists'
                });
            } else if (password !== passwordconfirm) {
                return res.render('register', {
                    message: 'password do not match'
                });
            }
            let hashedPassword = await bcrypt.hash(password, 8);
            console.log(hashedPassword);
            db.query('INSERT INTO users SET ?', { name: name, mobile: mobile, email: email, password: hashedPassword }, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    return res.render('register', {
                        message: 'Registerd Successfully !!'
                    });
                }
            });
        });
    } else {
        db.query(`SELECT email FROM banker WHERE email=?`, [email], async (err, result) => {
            if (err) {
                res.send()
            }
            if (result.length > 0) {
                return res.render('register', {
                    message: 'user already exists'
                });
            } else if (password !== passwordconfirm) {
                return res.render('register', {
                    message: 'password do not match'
                });
            }
            let hashedPassword = await bcrypt.hash(password, 8);
            console.log(hashedPassword);
            db.query('INSERT INTO banker SET ?', { name: name, mobile: mobile, email: email, password: hashedPassword }, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    return res.render('register', {
                        message: 'Registerd Successfully !!'
                    });
                }
            });
        });

    }
}
exports.list = (req, res) => {
    var alloc = "Following are the users";
    db.get(req.body.id, { revs_info: true }, (err, body) => {
        if (!err) {
            console.log(body);

        }
        if (body) {
            alloc += "name: " + body.name + "<br/>Phone Number: " + body.mobile;
        }
        else {
            alloc = "no customer"
        }
        res.send(alloc)
    })
}
exports.delete = (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).render('profile/:id', {
                message: 'please enter valid id number'
            });
        }
        db.query(`DELETE * FROM banker WHERE id =?`, [id], async (err, result) => {
            if (!err)
                //console.log(rows);
                res.status(200).render('/', { message: 'Deleted Successfully' })
            else
                console.log(err);
        })
    } catch (err) {
        console.log(err)
    }
}
exports.deposit = (req, res) => {
    const { id, balance } = req.body;
    db.query('SELECT * FROM users WHERE id=?', [id], async (err, result) => {
        if (err) {
            res.send('error in deposit');
        }
        else {
            res.send('payment in progress');
        }
    })
}