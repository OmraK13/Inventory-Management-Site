// server.js - Server setup and database configuration

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());

// הגדרות חיבור למסד הנתונים
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'oIS331719336@',
    database: 'dynamo'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// API ליצירת משתמש חדש עם סיסמה מוצפנת ומספר טלפון
app.post('/api/createUser', (req, res) => {
    const { username, password, phone_number } = req.body;

    // הצפנת הסיסמה
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Error encrypting password' });
        }

        const sql = 'INSERT INTO users (username, password, first_login, phone_number, otp) VALUES (?, ?, 1, ?, NULL)';
        db.query(sql, [username, hashedPassword, phone_number], (err, result) => {
            if (err) {
                return res.status(500).json({ status: 'error', message: 'Error creating user' });
            }
            res.status(200).json({ status: 'success', message: 'User created successfully with encrypted password and phone number!' });
        });
    });
});

// API לכניסה
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT password FROM users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging in' });
        }

        if (results.length === 0) {
            return res.status(401).json({ status: 'error', message: 'שם המשתמש או הסיסמה שהוזנו שגויים' });
        }

        const hashedPassword = results[0].password;

        bcrypt.compare(password, hashedPassword, (err, match) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing passwords' });
            }

            if (match) {
                res.status(200).json({ status: 'success', message: 'Login successful' });
            } else {
                res.status(401).json({ status: 'error', message: 'שם המשתמש או הסיסמה שהוזנו שגויים' });
            }
        });
    });
});

// API לשינוי סיסמה
app.post('/api/changePassword', (req, res) => {
    const { username, oldPassword, newPassword } = req.body;

    const sql = 'SELECT password FROM users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error checking user' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'שם המשתמש לא קיים' });
        }

        const hashedPassword = results[0].password;

        bcrypt.compare(oldPassword, hashedPassword, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing passwords' });
            }

            if (!isMatch) {
                return res.status(401).json({ message: 'סיסמה ישנה שגויה' });
            }

            bcrypt.hash(newPassword, 10, (err, newHashedPassword) => {
                if (err) {
                    return res.status(500).json({ message: 'Error encrypting new password' });
                }

                const updateSql = 'UPDATE users SET password = ?, first_login = 0 WHERE username = ?';
                db.query(updateSql, [newHashedPassword, username], (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error updating password' });
                    }
                    res.status(200).json({ message: 'סיסמה עודכנה בהצלחה' });
                });
            });
        });
    });
});

// API לשליחת OTP
app.post('/api/resetPassword', (req, res) => {
    const { phone_number } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // יצירת OTP רנדומלי

    const sql = 'UPDATE users SET otp = ? WHERE phone_number = ?';
    db.query(sql, [otp, phone_number], (err, result) => {
        if (err || result.affectedRows === 0) {
            return res.status(500).json({ status: 'error', message: 'Error sending OTP' });
        }

        console.log(`OTP for ${phone_number}: ${otp}`); // הדפסה לצורך בדיקה בלבד

        res.status(200).json({ status: 'success', message: 'OTP נשלח בהצלחה' });
    });
});

// API לבדיקה של OTP
app.post('/api/verifyOtp', (req, res) => {
    const { phone_number, otp } = req.body;

    const sql = 'SELECT otp FROM users WHERE phone_number = ?';
    db.query(sql, [phone_number], (err, results) => {
        if (err || results.length === 0) {
            return res.status(500).json({ status: 'error', message: 'Error verifying OTP' });
        }

        const storedOtp = results[0].otp;

        if (storedOtp === otp) {
            res.status(200).json({ status: 'success', message: 'OTP נכון' });
        } else {
            res.status(401).json({ status: 'error', message: 'OTP שגוי' });
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = db;
