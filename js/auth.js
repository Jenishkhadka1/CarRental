// Authentication related functionality

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    const result = loginUser(username, password);
    
    if (result.success) {
        showAlert('Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        showAlert(result.message, 'error');
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    // Validation
    if (!username || !email || !phone || !password || !confirmPassword) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showAlert('Please enter a valid email', 'error');
        return;
    }

    if (!validatePhone(phone)) {
        showAlert('Phone number must be 10 digits', 'error');
        return;
    }

    if (!validatePassword(password)) {
        showAlert('Password must be at least 6 characters', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
    }

    if (!document.getElementById('agreeTerms').checked) {
        showAlert('Please agree to the Terms & Conditions', 'error');
        return;
    }

    const result = registerUser(username, email, password, phone);
    
    if (result.success) {
        showAlert('Registration successful! Redirecting to login...', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    } else {
        showAlert(result.message, 'error');
    }
}

function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    const alertId = 'alert-' + Date.now();
    
    const alertHTML = `
        <div id="${alertId}" class="alert alert-${type} show">
            ${message}
        </div>
    `;
    
    alertContainer.innerHTML += alertHTML;
    
    setTimeout(() => {
        const alert = document.getElementById(alertId);
        if (alert) {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 300);
        }
    }, 3000);
}

// Redirect if already logged in
document.addEventListener('DOMContentLoaded', function() {
    if (isLoggedIn()) {
        if (window.location.pathname.includes('login') || window.location.pathname.includes('register')) {
            window.location.href = 'dashboard.html';
        }
    }
});
