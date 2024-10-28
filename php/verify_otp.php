<?php
session_start();
require 'db_config.php'; // התחברות למסד הנתונים

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $otp_code = $_POST['otp_code'];
    $phone_number = $_SESSION['phone_number']; // שמור את מספר הטלפון ב-SESSION לאחר שליחת ה-OTP

    // בדיקה אם ה-OTP תואם למה שנשלח למספר הטלפון
    $stmt = $conn->prepare("SELECT * FROM users WHERE phone_number = ? AND otp = ?");
    $stmt->bind_param("si", $phone_number, $otp_code);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // אם ה-OTP תקין, מפנים את המשתמש לעמוד לאיפוס סיסמה
        header("Location: html/reset_password_form.html");
    } else {
        // במקרה של קוד שגוי, הצגת הודעת שגיאה
        echo "<script>
                document.getElementById('error-message').style.display = 'block';
              </script>";
    }
}
?>
