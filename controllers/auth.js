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
                return res.send(401).render('login', {
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
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 100
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect('/');
            }
        })
    } catch (err) {
        console.log(err)
    }
}



exports.register = (req, res) => {
    console.log(req.body);

    //const name = req.body.name;
    //const email = req.body.email;
    //const password = req.body.password;
    //const confirmpassword = req.body.confirmpassword;

    const { name, email, password, passwordconfirm } = req.body;


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
        db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, (err, result) => {
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