document.getElementById("verifyOtpForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const phoneNumber = document.getElementById("phone_number").value.trim();
    const otp = document.getElementById("otp").value.trim();
    const errorMessage = document.getElementById("error-message");
    const errorText = document.getElementById("error-text");

    // איפוס הודעות שגיאה קודמות
    errorMessage.style.display = 'none';

    // בדיקה אם השדות ריקים
    if (!phoneNumber || !otp) {
        errorText.textContent = 'יש למלא את מספר הטלפון וה-OTP';
        errorMessage.style.display = 'flex';

        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 4000); // הסתרת הודעת השגיאה לאחר 4 שניות

        return; // עצירת פעולת שליחת הטופס
    }

    // שליחת בקשה לאימות ה-OTP
    const response = await fetch(`${window.location.origin}/api/verifyOtp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone_number: phoneNumber, otp: otp })
    });
    

    const result = await response.json();

    if (result.status === 'success') {
        // OTP אומת בהצלחה
        alert("אימות ה-OTP הצליח! כעת ניתן לאפס את הסיסמה.");
        // הפניה לדף איפוס הסיסמה
        window.location.href = 'html/reset_password.html';
    } else {
        // שגיאה באימות ה-OTP
        errorText.textContent = 'ה-OTP שהוזן שגוי. נסה שוב.';
        errorMessage.style.display = 'flex';

        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 4000); // הסתרת הודעת השגיאה לאחר 4 שניות
    }
});
