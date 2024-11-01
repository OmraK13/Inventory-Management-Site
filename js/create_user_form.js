document.getElementById("createUserForm").addEventListener("submit", function(event) {
    event.preventDefault(); // מונע את שליחת הטופס כברירת מחדל

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // בדיקה אם אחד השדות ריק
    if (!username || !password) {
        const errorMessage = document.getElementById("error-message");
        errorMessage.style.display = "flex";
        document.getElementById("error-text").textContent = "יש להזין שם משתמש ולהקליד סיסמה זמנית";

        // הסתרת הודעת השגיאה אחרי 4 שניות
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 4000); // 4 שניות

        return; // עצור את פעולת שליחת הטופס
    }

    // יצירת FormData ושליחת הנתונים לשרת אם שני השדות מלאים
    const formData = new FormData(this);

    fetch('../php/create_user.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === "success") {
            const successMessage = document.getElementById("success-message");
            successMessage.style.display = "flex"; // הצגת הודעת ההצלחה
            document.getElementById("success-text").textContent = "המשתמש נוצר בהצלחה!";

            // הסתרת הודעת ההצלחה אחרי 4 שניות
            setTimeout(() => {
                successMessage.style.display = "none";
            }, 4000); // 4 שניות
        } else {
            const errorMessage = document.getElementById("error-message");
            errorMessage.style.display = "flex"; // הצגת הודעת השגיאה
            document.getElementById("error-text").textContent = result.message;

            // הסתרת הודעת השגיאה אחרי 4 שניות
            setTimeout(() => {
                errorMessage.style.display = "none";
            }, 4000); // 4 שניות
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
