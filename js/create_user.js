let emptyFieldClickCount = 0; // Counter for empty field attempts
let timeout; // Timer for error message

document.getElementById("createUserForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const phoneNumber = document.getElementById("phone_number").value.trim();
    const errorMessage = document.getElementById("error-message");
    const errorText = document.getElementById("error-text");
    const counter = document.getElementById("click-counter");
    const successMessage = document.getElementById("success-message");
    const successText = document.getElementById("success-text");

    // Reset previous error and success messages
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';

    // Check if any field is empty
    if (!username || !password || !phoneNumber) {
        emptyFieldClickCount++;
        errorText.textContent = "יש להזין שם משתמש, סיסמה זמנית ומספר טלפון";
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
            if (timerBar) errorMessage.removeChild(timerBar);
            emptyFieldClickCount = 0;
            counter.style.display = 'none';
        }, 4000);

        return; // Stop form submission
    }

    // Create request body
    const data = {
        username: username,
        password: password,
        phone_number: phoneNumber
    };

    // Send data to server
    fetch(`${window.location.origin}/api/createUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === "success") {
            successText.textContent = "המשתמש נוצר בהצלחה!";
            successMessage.style.display = "flex"; // Show success message

            const successTimerBar = document.createElement('div');
            successTimerBar.className = 'timer-bar';
            successMessage.appendChild(successTimerBar);

            // Hide success message after 4 seconds
            setTimeout(() => {
                successMessage.style.display = "none";
                if (successTimerBar) successMessage.removeChild(successTimerBar);
            }, 4000);
        } else {
            errorText.textContent = result.message;
            errorMessage.style.display = "flex";

            // Hide error message after 4 seconds
            setTimeout(() => {
                errorMessage.style.display = "none";
            }, 4000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        errorText.textContent = "שגיאה ביצירת המשתמש"; // Display a generic error message
        errorMessage.style.display = "flex";

        // Hide error message after 4 seconds
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 4000);
    });
});
