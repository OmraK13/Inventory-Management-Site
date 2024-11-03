let emptyPhoneClickCount = 0; // מונה לניסיונות כאשר אין מספר טלפון
let timeout; // משתנה לאחסון הטיימר להודעת השגיאה

document.getElementById('resetPasswordForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const phoneNumber = document.getElementById('phone_number').value.trim();
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const counter = document.getElementById('click-counter');

    // איפוס הודעות שגיאה קודמות
    errorMessage.style.display = 'none';

    // כאשר אין מספר טלפון
    if (!phoneNumber) {
        emptyPhoneClickCount++; // העלאה של מונה לחיצות כשאין מספר טלפון
        errorText.textContent = 'חובה להזין מספר טלפון';
        errorMessage.style.display = 'flex';

        if (emptyPhoneClickCount > 1) {
            counter.style.display = 'inline';
            counter.textContent = emptyPhoneClickCount;
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
            emptyPhoneClickCount = 0; // איפוס המונה לאחר 4 שניות
            counter.style.display = 'none';
        }, 4000);

        return; // מניעת שליחת הטופס
    }

    // שליחת בקשת OTP לשרת
    const response = await fetch(`${window.location.origin}/api/resetPassword`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone_number: phoneNumber })
    });
    

    const result = await response.json();

    if (result.status === 'success') {
        // מעביר את המשתמש לדף הזנת הקוד
        window.location.href = 'html/verify_otp.html';
    } else {
        errorText.textContent = 'אירעה שגיאה בשליחת ה-OTP. נסה שוב.';
        errorMessage.style.display = 'flex';
    }
});
