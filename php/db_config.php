<?php
// Database configuration
$servername = "localhost";
$username = "root"; 
$password = "oIS331719336@"; // וודא שזו הסיסמה הנכונה עבור משתמש root ב-MySQL
$dbname = "dynamo"; 

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
