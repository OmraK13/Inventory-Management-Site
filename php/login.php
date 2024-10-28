<?php
session_start();
require 'db_config.php';

$response = ['status' => 'error', 'message' => '']; // תשובת ברירת מחדל

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // בדיקת שם המשתמש והסיסמה במסד הנתונים
    $stmt = $conn->prepare("SELECT password FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->bind_result($hashed_password);
    $stmt->fetch();
    $stmt->close();

    // אם שם המשתמש לא נמצא
    if (!$hashed_password) {
        $response['message'] = 'שם המשתמש או הסיסמה שהוזנו שגויים';
    } else {
        // בדיקת הסיסמה
        if (password_verify($password, $hashed_password)) {
            $_SESSION['username'] = $username;
            $response['status'] = 'success'; // התחברות מוצלחת
        } else {
            $response['message'] = 'שם המשתמש או הסיסמה שהוזנו שגויים'; // סיסמה שגויה
        }
    }
}

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>
