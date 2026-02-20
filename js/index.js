// Homepage specific functionality

function displayFeaturedCars() {
    const featuredCars = getAllCars().slice(0, 3);
    const container = document.getElementById('featuredCars');
    
    container.innerHTML = featuredCars.map(car => `
        <div class="car-card">
            <div class="car-image">${car.image}</div>
            <div class="car-info">
                <div class="car-name">${car.name}</div>
                <span class="car-category">${car.category}</span>
                <div class="car-specs">
                    <div class="spec-item">👥 ${car.seats} Seats</div>
                    <div class="spec-item">⚙️ ${car.transmission}</div>
                    <div class="spec-item">⛽ ${car.fuel}</div>
                    <div class="spec-item">✅ Available</div>
                </div>
                <div class="car-price">Rs. ${car.price.toLocaleString()}<small>/day</small></div>
                <div class="car-description">${car.description}</div>
                <button class="btn btn-primary btn-block" onclick="redirectToBooking(${car.id})">Book Now</button>
            </div>
        </div>
    `).join('');
}

function redirectToBooking(carId) {
    if (isLoggedIn()) {
        window.location.href = `booking.html?carId=${carId}`;
    } else {
        showAlert('Please log in to book a car', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }
}

function handleContactSubmit() {
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !message) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showAlert('Please enter a valid email', 'error');
        return;
    }

    // Simulate sending message
    showAlert('Thank you! We will get back to you soon.', 'success');
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactMessage').value = '';
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
        authSection.classList.remove('hidden');
        logoutSection.classList.add('hidden');
        navDashboard.classList.add('hidden');
        navAdmin.classList.add('hidden');
        navProfile.classList.add('hidden');
    }
}

function handleLogout() {
    logoutUser();
    showAlert('Logged out successfully', 'success');
    updateAuthUI();
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    displayFeaturedCars();
    updateAuthUI();
});
