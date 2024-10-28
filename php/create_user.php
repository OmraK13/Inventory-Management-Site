<?php
// בדוק אם הבקשה נשלחה דרך טופס POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // קבל את שם המשתמש והסיסמה הזמנית מהטופס
    $username = $_POST['username'];
    $password = $_POST['password'];

    // הצפן את הסיסמה באמצעות password_hash
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // התחבר למסד הנתונים
    require 'db_config.php';

    // הכנס את המשתמש החדש למסד הנתונים עם הסיסמה המוצפנת וסטטוס התחברות ראשונה
    $stmt = $conn->prepare("INSERT INTO users (username, password, first_login) VALUES (?, ?, 1)");
    $stmt->bind_param("ss", $username, $hashed_password);

    if ($stmt->execute()) {
        echo "User created successfully with temporary password!";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
