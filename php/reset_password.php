<?php
require __DIR__ . '/vendor/autoload.php'; // חיבור ל-SDK של Twilio

use Twilio\Rest\Client;

// פרטי חשבון Twilio שלך
$account_sid = 'AC3839b388f003b3d2509acebdd5c5e331'; // הכנס את ה-Account SID שלך
$auth_token = '4438ab52f4ada21eeda53d5ad81c252c';   // הכנס את ה-Auth Token שלך
$twilio_number = '+12402563016'; // מספר הטלפון שקיבלת מ-Twilio

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // טיפול במספר טלפון ובדיקת תקינות
    $phone_number = $_POST['phone_number'];

    // הוספת קידומת בינלאומית לישראל (+972) אם המספר מתחיל ב-0
    if (substr($phone_number, 0, 1) == '0') {
        $phone_number = '+972' . substr($phone_number, 1); // למשל, ממיר 054 ל-+97254
    }

    // בדיקה אם מספר הטלפון קיים במאגר הנתונים
    $stmt = $conn->prepare("SELECT * FROM users WHERE phone_number = ?");
    $stmt->bind_param("s", $phone_number);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // מספר הטלפון נמצא, ניצור OTP
        $otp = rand(100000, 999999); // יצירת OTP באורך 6 ספרות

        // שמירת ה-OTP ב-DB
        $stmt = $conn->prepare("UPDATE users SET otp = ? WHERE phone_number = ?");
        $stmt->bind_param("is", $otp, $phone_number);
        $stmt->execute();

        // שליחת ה-OTP למספר הטלפון
        try {
            $client = new Client($account_sid, $auth_token);
            $client->messages->create(
                $phone_number, // מספר הטלפון אליו תשלח ההודעה
                array(
                    'from' => $twilio_number, // מספר ה-Twilio שלך
                    'body' => "קוד האימות שלך הוא: $otp"
                )
            );
            echo "OTP נשלח למספר הטלפון שלך!";
        } catch (Exception $e) {
            // טיפול בשגיאה אם שליחת ה-OTP נכשלת
            echo "אירעה שגיאה בשליחת ה-OTP: " . $e->getMessage();
        }
    } else {
        echo "מספר הטלפון לא נמצא!";
    }
}
