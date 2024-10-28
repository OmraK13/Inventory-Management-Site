<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Check if user is logged in
if (!isset($_SESSION['username'])) {
    echo "Unauthorized access.";
    exit;
}

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $new_password = $_POST['new_password'];
    $confirm_password = $_POST['confirm_password'];

    // Validate password requirements
    if (!preg_match('/[a-z]/', $new_password) || !preg_match('/[A-Z]/', $new_password) || 
        !preg_match('/\d/', $new_password) || !preg_match('/[\W]/', $new_password)) {
        echo "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.";
        echo "<a href='change_password.php'>Try again</a>";  // Add link to try again
        exit;
    }

    // Check if passwords match
    if ($new_password !== $confirm_password) {
        echo "Passwords do not match.";
        echo "<a href='change_password.php'>Try again</a>";  // Add link to try again
        exit;
    }

    // Hash the new password
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

    // Update password in the database
    require 'db_config.php';
    $username = $_SESSION['username'];
    
    $stmt = $conn->prepare("UPDATE users SET password = ?, first_login = 0 WHERE username = ?");
    $stmt->bind_param("ss", $hashed_password, $username);

    if ($stmt->execute()) {
        echo "Password changed successfully!";
        // Redirect to dashboard or login page
        header("Location: html/dashboard.html");
        exit;
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
