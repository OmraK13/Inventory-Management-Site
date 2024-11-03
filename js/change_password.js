const bcrypt = require('bcrypt');
const db = require('./server'); // נניח שהחיבור למסד הנתונים מוגדר ב-server.js

// פונקציה לשינוי סיסמה
function changePassword(req, res) {
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

                const updateSql = 'UPDATE users SET password = ? WHERE username = ?';
                db.query(updateSql, [newHashedPassword, username], (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error updating password' });
                    }
                    res.status(200).json({ message: 'סיסמה עודכנה בהצלחה' });
                });
            });
        });
    });
}

module.exports = changePassword;
