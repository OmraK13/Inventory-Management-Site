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
        emptyFieldClickCount++;
        errorText.textContent = 'יש למלא שם משתמש וסיסמה';
        errorMessage.style.display = 'flex';

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
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            errorMessage.style.display = 'none';
            errorMessage.removeChild(timerBar);
            emptyFieldClickCount = 0;
            counter.style.display = 'none';
        }, 4000);

        return;
    }

    loader.style.display = 'block';

    // שליחת בקשת התחברות ל-API של Node.js
    const response = await fetch(`${window.location.origin}/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });    

    const result = await response.json();

    loader.style.display = 'none';
    
    // אם ההתחברות מוצלחת
    if (result.status === 'success') {
        window.location.href = 'html/dashboard.html';
    } else {
        invalidLoginClickCount++;
        errorText.textContent = result.message;
        invalidCredentialsMessage.style.display = 'flex';

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
            clearTimeout(invalidTimeout);
        }

        invalidTimeout = setTimeout(() => {
            invalidCredentialsMessage.style.display = 'none';
            invalidCredentialsMessage.removeChild(timerBar);
            invalidLoginClickCount = 0;
            invalidCounter.style.display = 'none';
        }, 4000);
    }
});
