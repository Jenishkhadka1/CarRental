// Booking page functionality

let selectedCar = null;

function getUrlParameter(name) {
    const url = new URLSearchParams(window.location.search);
    return url.get(name);
}

function loadCarDetails() {
    const carId = getUrlParameter('carId');
    
    if (!carId) {
        showAlert('No car selected. Redirecting...', 'error');
        setTimeout(() => {
            window.location.href = 'cars.html';
        }, 1500);
        return;
    }

    selectedCar = getCarById(parseInt(carId));
    
    if (!selectedCar) {
        showAlert('Car not found. Redirecting...', 'error');
        setTimeout(() => {
            window.location.href = 'cars.html';
        }, 1500);
        return;
    }

    // Set minimum dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    document.getElementById('startDate').min = today.toISOString().split('T')[0];
    
    // Load car into summary
    document.getElementById('summaryCarName').textContent = selectedCar.name;
    document.getElementById('summaryDailyRate').textContent = `Rs. ${selectedCar.price.toLocaleString()}`;

    // Display car details
    const carDetailsHTML = `
        <div style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">${selectedCar.image}</div>
            <div style="font-size: 1.3rem; font-weight: bold; margin-bottom: 0.5rem;">${selectedCar.name}</div>
            <span style="background: var(--primary-color); color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem;">${selectedCar.category}</span>
            <div style="margin-top: 1rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.95rem; color: var(--light-text);">
                <div>👥 ${selectedCar.seats} Seats</div>
                <div>⚙️ ${selectedCar.transmission}</div>
                <div>⛽ ${selectedCar.fuel}</div>
                <div>💵 Rs. ${selectedCar.price.toLocaleString()}/day</div>
            </div>
        </div>
    `;
    
    document.getElementById('carDetails').innerHTML = carDetailsHTML;
}

function updateBookingSummary() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!startDate || !endDate) {
        document.getElementById('rentalDays').value = '';
        document.getElementById('summaryDays').textContent = '0';
        document.getElementById('summaryTotal').textContent = 'Rs. 0';
        return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
        showAlert('End date must be after start date', 'error');
        document.getElementById('endDate').value = '';
        return;
    }

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
    const total = days * selectedCar.price;

    document.getElementById('rentalDays').value = `${days} day(s)`;
    document.getElementById('summaryDays').textContent = days;
    document.getElementById('summaryTotal').textContent = `Rs. ${total.toLocaleString()}`;
}

function handleBooking(event) {
    event.preventDefault();

    if (!isLoggedIn()) {
        showAlert('Please log in to book a car', 'error');
        return;
    }

    const user = getCurrentUser();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const driverName = document.getElementById('driverName').value.trim();
    const driverLicense = document.getElementById('driverLicense').value.trim();
    const driverPhone = document.getElementById('driverPhone').value.trim();
    const pickupLocation = document.getElementById('pickupLocation').value;
    const additionalNotes = document.getElementById('additionalNotes').value.trim();
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // Validation
    if (!startDate || !endDate || !driverName || !driverLicense || !driverPhone || !pickupLocation) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }

    if (!agreeTerms) {
        showAlert('Please agree to the rental agreement and insurance terms', 'error');
        return;
    }

    // Create booking
    const result = createBooking(user.id, selectedCar.id, startDate, endDate);

    if (result.success) {
        showAlert('Booking confirmed! Redirecting to dashboard...', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        showAlert(result.message || 'Booking failed. Please try again.', 'error');
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
    }, 4000);
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
        showAlert('Please log in to book a car', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
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

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    loadCarDetails();
    updateAuthUI();

    document.getElementById('startDate').addEventListener('change', updateBookingSummary);
    document.getElementById('endDate').addEventListener('change', updateBookingSummary);
});
