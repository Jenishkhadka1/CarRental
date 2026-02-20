// Profile page functionality

function loadProfile() {
    const user = getCurrentUser();
    
    if (!user) {
        showAlert('Please log in to view your profile', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }

    document.getElementById('profUsername').value = user.username;
    document.getElementById('profEmail').value = user.email;
    document.getElementById('profPhone').value = user.phone;
}

function handleProfileUpdate(event) {
    event.preventDefault();

    const user = getCurrentUser();
    const email = document.getElementById('profEmail').value.trim();
    const phone = document.getElementById('profPhone').value.trim();
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validation
    if (!email || !phone) {
        showAlert('Please fill in all required fields', 'error');
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

    // Handle password change
    if (newPassword || confirmPassword || currentPassword) {
        if (!currentPassword || !newPassword || !confirmPassword) {
            showAlert('Please fill in all password fields to change password', 'error');
            return;
        }

        if (!validatePassword(newPassword)) {
            showAlert('New password must be at least 6 characters', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showAlert('New passwords do not match', 'error');
            return;
        }

        // Verify current password
        const users = JSON.parse(localStorage.getItem('users'));
        const userInDb = users.find(u => u.id === user.id);
        
        if (userInDb.password !== currentPassword) {
            showAlert('Current password is incorrect', 'error');
            return;
        }

        // Update password in database
        userInDb.password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Update user info in database
    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(u => u.id === user.id);
    users[userIndex].email = email;
    users[userIndex].phone = phone;
    localStorage.setItem('users', JSON.stringify(users));

    // Update session
    user.email = email;
    user.phone = phone;
    sessionStorage.setItem('currentUser', JSON.stringify(user));

    showAlert('Profile updated successfully!', 'success');
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

function confirmDeleteAccount() {
    if (confirm('⚠️ Are you sure you want to delete your account? This action cannot be undone.\n\nAll your bookings and personal data will be deleted permanently.')) {
        if (confirm('This is your final warning. Are you absolutely sure?')) {
            deleteAccount();
        }
    }
}

function deleteAccount() {
    const user = getCurrentUser();
    
    // Delete user from database
    const users = JSON.parse(localStorage.getItem('users'));
    const filteredUsers = users.filter(u => u.id !== user.id);
    localStorage.setItem('users', JSON.stringify(filteredUsers));

    // Delete user bookings
    const bookings = JSON.parse(localStorage.getItem('bookings'));
    const filteredBookings = bookings.filter(b => b.userId !== user.id);
    localStorage.setItem('bookings', JSON.stringify(filteredBookings));

    // Logout
    logoutUser();
    
    showAlert('Account deleted successfully. Redirecting...', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
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

function updateAuthUI() {
    const user = getCurrentUser();
    const authSection = document.getElementById('authSection');
    const logoutSection = document.getElementById('logoutSection');
    const navDashboard = document.getElementById('navDashboard');
    const navAdmin = document.getElementById('navAdmin');
    const navProfile = document.getElementById('navProfile');

    if (user) {
        authSection.classList.add('hidden');
        logoutSection.classList.remove('hidden');
        navDashboard.classList.remove('hidden');
        navProfile.classList.remove('hidden');
        
        document.getElementById('userGreeting').textContent = `Welcome, ${user.username}!`;

        if (user.role === 'admin') {
            navAdmin.classList.remove('hidden');
        } else {
            navAdmin.classList.add('hidden');
        }
    } else {
        window.location.href = 'login.html';
    }
}

function handleLogout() {
    logoutUser();
    showAlert('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProfile();
    updateAuthUI();
});
