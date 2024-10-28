let emptyFieldClickCount = 0; // מונה לניסיונות כאשר אין שם משתמש וסיסמה
let invalidLoginClickCount = 0; // מונה לניסיונות כאשר יש שם משתמש וסיסמה לא נכונים
let timeout; // משתנה לאחסון הטיימר להודעת השגיאה הראשונה
let invalidTimeout; // טיימר לשגיאת סיסמה לא נכונה

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    const invalidCredentialsMessage = document.getElementById('invalid-credentials-message');
    const errorText = document.getElementById('error-text');
    const loader = document.getElementById('loader');
    const counter = document.getElementById('click-counter');
    const invalidCounter = document.getElementById('click-counter-invalid');

    // איפוס הודעות שגיאה קודמות
    errorMessage.style.display = 'none';
    invalidCredentialsMessage.style.display = 'none';

    // כאשר אין שם משתמש או סיסמה
    if (!username || !password) {
        emptyFieldClickCount++; // העלאה של מונה לחיצות כשאין פרטים
        errorText.textContent = 'יש למלא שם משתמש וסיסמה';
        errorMessage.style.display = 'flex';

        // הצגת מונה רק לאחר ניסיון שני
        if (emptyFieldClickCount > 1) {
            counter.style.display = 'inline';
            counter.textContent = emptyFieldClickCount;
            counter.classList.add('shake');
            setTimeout(() => {
                counter.classList.remove('shake');
            }, 500);
        }

        const timerBar = document.createElement('div');
        timerBar.className = 'timer-bar';
        errorMessage.appendChild(timerBar);

        if (timeout) {
            clearTimeout(timeout); // ביטול טיימר קודם אם קיים
        }

        timeout = setTimeout(() => {
            errorMessage.style.display = 'none';
            errorMessage.removeChild(timerBar);
            emptyFieldClickCount = 0; // איפוס המונה לאחר 4 שניות
            counter.style.display = 'none';
        }, 4000);

        return; // מניעת שליחת הטופס
    }

    loader.style.display = 'block'; // הצגת טעינה

    // הגשת הנתונים ל-login.php
    const response = await fetch('php/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    });

    const result = await response.json();

    loader.style.display = 'none'; // הסתרת טעינה

    // אם ההתחברות מוצלחת
    if (result.status === 'success') {
        window.location.href = 'html/dashboard.html'; // הפניה לדף הבית
    } 
    // אם שם המשתמש או הסיסמה לא נכונים
    else {
        invalidLoginClickCount++; // העלאת מונה לניסיונות שגויים
        errorText.textContent = 'שם המשתמש או הסיסמה שהוזנו שגויים';
        invalidCredentialsMessage.style.display = 'flex';

        // הצגת מונה הניסיונות השגויים
        if (invalidLoginClickCount > 1) {
            invalidCounter.style.display = 'inline';
            invalidCounter.textContent = invalidLoginClickCount;
            invalidCounter.classList.add('shake');
            setTimeout(() => {
                invalidCounter.classList.remove('shake');
            }, 500);
        }

        const timerBar = document.createElement('div');
        timerBar.className = 'timer-bar';
        invalidCredentialsMessage.appendChild(timerBar);

        if (invalidTimeout) {
            clearTimeout(invalidTimeout); // ביטול טיימר קודם אם קיים
        }

        invalidTimeout = setTimeout(() => {
            invalidCredentialsMessage.style.display = 'none';
            invalidCredentialsMessage.removeChild(timerBar);
            invalidLoginClickCount = 0; // איפוס המונה לאחר 4 שניות
            invalidCounter.style.display = 'none';
        }, 4000);
    }
});
