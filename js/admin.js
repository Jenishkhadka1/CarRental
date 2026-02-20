// Admin panel functionality

function loadAdminDashboard() {
    const user = getCurrentUser();
    
    if (!user || user.role !== 'admin') {
        showAlert('Access denied. Admin only.', 'error');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        return;
    }

    // Load stats
    const users = JSON.parse(localStorage.getItem('users'));
    const cars = getAllCars();
    const bookings = getAllBookings();

    document.getElementById('totalUsers').textContent = users.filter(u => u.role === 'user').length;
    document.getElementById('totalCars').textContent = cars.length;
    document.getElementById('totalBookings').textContent = bookings.length;
    document.getElementById('totalRevenue').textContent = `Rs. ${bookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}`;

    // Load initial data
    displayCarsList();
    updateAuthUI();
}

function displayCarsList() {
    const cars = getAllCars();
    const container = document.getElementById('carsListContainer');

    if (cars.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--light-text);">No cars added yet</p>';
        return;
    }

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Daily Price</th>
                    <th>Seats</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${cars.map(car => `
                    <tr>
                        <td><strong>${car.name}</strong></td>
                        <td><span style="text-transform: capitalize;">${car.category}</span></td>
                        <td>Rs. ${car.price.toLocaleString()}</td>
                        <td>${car.seats}</td>
                        <td>
                            <span class="badge ${car.available ? 'badge-success' : 'badge-danger'}">
                                ${car.available ? 'Available' : 'Not Available'}
                            </span>
                        </td>
                        <td>
                            <button class="btn edit-btn" onclick="editCar(${car.id})" style="padding: 0.5rem 1rem; font-size: 0.9rem;">Edit</button>
                            <button class="btn delete-btn" onclick="deleteCar(${car.id})" style="padding: 0.5rem 1rem; font-size: 0.9rem; margin-left: 0.5rem;">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function displayBookingsList() {
    const bookings = getAllBookings();
    const container = document.getElementById('bookingsListContainer');

    if (bookings.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--light-text);">No bookings yet</p>';
        return;
    }

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Booking ID</th>
                    <th>Car</th>
                    <th>Customer</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Total Price</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${bookings.map(booking => {
                    const users = JSON.parse(localStorage.getItem('users'));
                    const customer = users.find(u => u.id === booking.userId);
                    return `
                        <tr>
                            <td>#${booking.id.toString().padStart(5, '0')}</td>
                            <td><strong>${booking.carName}</strong></td>
                            <td>${customer ? customer.username : 'Unknown'}</td>
                            <td>${formatDate(booking.startDate)}</td>
                            <td>${formatDate(booking.endDate)}</td>
                            <td>Rs. ${booking.totalPrice.toLocaleString()}</td>
                            <td>
                                <span class="badge ${getBadgeClass(booking.status)}">
                                    ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function displayUsersList() {
    const users = JSON.parse(localStorage.getItem('users')).filter(u => u.role === 'user');
    const container = document.getElementById('usersListContainer');

    if (users.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--light-text);">No users registered yet</p>';
        return;
    }

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Total Bookings</th>
                    <th>Total Spent</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(user => {
                    const bookings = getAllBookings().filter(b => b.userId === user.id);
                    const totalSpent = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
                    return `
                        <tr>
                            <td><strong>${user.username}</strong></td>
                            <td>${user.email}</td>
                            <td>${user.phone}</td>
                            <td>${bookings.length}</td>
                            <td>Rs. ${totalSpent.toLocaleString()}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function switchAdminTab(tab) {
    // Hide all tabs
    document.getElementById('carsTab').classList.add('hidden');
    document.getElementById('bookingsTab').classList.add('hidden');
    document.getElementById('usersTab').classList.add('hidden');

    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    // Show selected tab
    if (tab === 'cars') {
        document.getElementById('carsTab').classList.remove('hidden');
        displayCarsList();
    } else if (tab === 'bookings') {
        document.getElementById('bookingsTab').classList.remove('hidden');
        displayBookingsList();
    } else if (tab === 'users') {
        document.getElementById('usersTab').classList.remove('hidden');
        displayUsersList();
    }

    event.target.classList.add('active');
}

function toggleAddCarForm() {
    const form = document.getElementById('addCarForm');
    form.classList.toggle('hidden');
    
    if (!form.classList.contains('hidden')) {
        document.getElementById('carName').focus();
    }
}

function handleAddCar(event) {
    event.preventDefault();

    const name = document.getElementById('carName').value.trim();
    const category = document.getElementById('carCategory').value;
    const price = parseInt(document.getElementById('carPrice').value);
    const seats = parseInt(document.getElementById('carSeats').value);
    const transmission = document.getElementById('carTransmission').value;
    const fuel = document.getElementById('carFuel').value;
    const description = document.getElementById('carDescription').value.trim();

    if (!name || !category || !price || !seats || !transmission || !fuel) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }

    const newCar = addCar({
        name,
        category,
        price,
        seats,
        transmission,
        fuel,
        description: description || `${name} - Premium rental option`,
        available: true,
        image: '🚗'
    });

    if (newCar) {
        showAlert(`Car "${name}" added successfully!`, 'success');
        
        // Reset form
        document.getElementById('carName').value = '';
        document.getElementById('carCategory').value = '';
        document.getElementById('carPrice').value = '';
        document.getElementById('carSeats').value = '';
        document.getElementById('carTransmission').value = '';
        document.getElementById('carFuel').value = '';
        document.getElementById('carDescription').value = '';
        
        toggleAddCarForm();
        displayCarsList();
    }
}

function editCar(carId) {
    const car = getCarById(carId);
    if (!car) {
        showAlert('Car not found', 'error');
        return;
    }

    const newPrice = prompt(`Edit daily price for ${car.name}:`, car.price);
    if (newPrice !== null) {
        const price = parseInt(newPrice);
        if (isNaN(price) || price <= 0) {
            showAlert('Please enter a valid price', 'error');
            return;
        }

        updateCar(carId, { price });
        showAlert('Car updated successfully!', 'success');
        displayCarsList();
    }
}

function deleteCar(carId) {
    const car = getCarById(carId);
    if (confirm(`Are you sure you want to delete ${car.name}? This action cannot be undone.`)) {
        deleteCar(carId);
        showAlert('Car deleted successfully!', 'success');
        displayCarsList();
    }
}

function getBadgeClass(status) {
    switch(status) {
        case 'confirmed': return 'badge-info';
        case 'completed': return 'badge-success';
        case 'cancelled': return 'badge-danger';
        default: return 'badge-warning';
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

function updateAuthUI() {
    const user = getCurrentUser();
    const navDashboard = document.getElementById('navDashboard');
    const navAdmin = document.getElementById('navAdmin');

    if (user) {
        document.getElementById('userGreeting').textContent = `${user.username} (Admin)`;

        if (user.role === 'admin') {
            navAdmin.style.display = 'block';
        }
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
    loadAdminDashboard();
});
