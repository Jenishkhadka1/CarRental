// Cars page functionality

function displayCars(cars = null) {
    if (!cars) {
        cars = getAllCars();
    }

    const container = document.getElementById('carsContainer');
    const noResults = document.getElementById('noResults');

    if (cars.length === 0) {
        container.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
    }

    noResults.classList.add('hidden');
    
    container.innerHTML = cars.map(car => `
        <div class="car-card">
            <div class="car-image">${car.image}</div>
            <div class="car-info">
                <div class="car-name">${car.name}</div>
                <span class="car-category">${car.category}</span>
                <div class="car-specs">
                    <div class="spec-item">👥 ${car.seats} Seats</div>
                    <div class="spec-item">⚙️ ${car.transmission}</div>
                    <div class="spec-item">⛽ ${car.fuel}</div>
                    <div class="spec-item">${car.available ? '✅ Available' : '❌ Booked'}</div>
                </div>
                <div class="car-price">Rs. ${car.price.toLocaleString()}<small>/day</small></div>
                <div class="car-description">${car.description}</div>
                <button class="btn btn-primary btn-block" 
                    onclick="handleBookCar(${car.id})" 
                    ${!car.available ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
                    ${car.available ? 'Book Now' : 'Not Available'}
                </button>
            </div>
        </div>
    `).join('');
}

function applyFilters() {
    let cars = getAllCars();

    const category = document.getElementById('categoryFilter').value;
    const maxPrice = document.getElementById('priceFilter').value;
    const transmission = document.getElementById('transmissionFilter').value;

    if (category) {
        cars = cars.filter(car => car.category === category);
    }

    if (maxPrice) {
        cars = cars.filter(car => car.price <= parseInt(maxPrice));
    }

    if (transmission) {
        cars = cars.filter(car => car.transmission === transmission);
    }

    displayCars(cars);
}

function resetFilters() {
    document.getElementById('categoryFilter').value = '';
    document.getElementById('priceFilter').value = '';
    document.getElementById('transmissionFilter').value = '';
    displayCars();
}

function handleBookCar(carId) {
    if (!isLoggedIn()) {
        showAlert('Please log in to book a car', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }

    window.location.href = `booking.html?carId=${carId}`;
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
    displayCars();
    updateAuthUI();
});
