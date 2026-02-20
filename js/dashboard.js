// Dashboard page functionality

function displayDashboard() {
    const user = getCurrentUser();
    
    if (!user) {
        showAlert('Please log in to view your dashboard', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }

    // Load user info
    document.getElementById('userUsername').textContent = user.username;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('userPhone').textContent = user.phone;
    document.getElementById('userSince').textContent = new Date().toLocaleDateString();

    // Load bookings
    loadBookings();
}

function loadBookings() {
    const user = getCurrentUser();
    const userBookings = getUserBookings(user.id);

    const activeBookings = userBookings.filter(b => b.status === 'confirmed');
    const completedBookings = userBookings.filter(b => b.status === 'completed');
    const cancelledBookings = userBookings.filter(b => b.status === 'cancelled');

    // Update stats
    document.getElementById('totalBookings').textContent = userBookings.length;
    document.getElementById('activeBookings').textContent = activeBookings.length;
    document.getElementById('completedBookings').textContent = completedBookings.length;

    // Display bookings
    displayBookingsList('activeBookingsList', activeBookings, 'confirmed');
    displayBookingsList('completedBookingsList', completedBookings, 'completed');
    displayBookingsList('cancelledBookingsList', cancelledBookings, 'cancelled');

    // Show message if no bookings
    const noBookings = document.getElementById('noBookings');
    if (userBookings.length === 0) {
        noBookings.classList.remove('hidden');
    } else {
        noBookings.classList.add('hidden');
    }
}

function displayBookingsList(elementId, bookings, status) {
    const element = document.getElementById(elementId);
    
    if (bookings.length === 0) {
        element.innerHTML = `
            <div class="card">
                <div class="card-body text-center">
                    <p style="color: var(--light-text);">No ${status} bookings</p>
                </div>
            </div>
        `;
        return;
    }

    element.innerHTML = bookings.map(booking => `
        <div class="booking-card">
            <div class="booking-card-icon">🚗</div>
            
            <div class="booking-card-details">
                <div class="booking-card-detail">
                    <div class="booking-card-detail-label">Car</div>
                    <div class="booking-card-detail-value">${booking.carName}</div>
                </div>
                <div class="booking-card-detail">
                    <div class="booking-card-detail-label">Booking ID</div>
                    <div class="booking-card-detail-value">#${booking.id.toString().padStart(5, '0')}</div>
                </div>
                <div class="booking-card-detail">
                    <div class="booking-card-detail-label">Start Date</div>
                    <div class="booking-card-detail-value">${formatDate(booking.startDate)}</div>
                </div>
                <div class="booking-card-detail">
                    <div class="booking-card-detail-label">End Date</div>
                    <div class="booking-card-detail-value">${formatDate(booking.endDate)}</div>
                </div>
                <div class="booking-card-detail">
                    <div class="booking-card-detail-label">Duration</div>
                    <div class="booking-card-detail-value">${booking.days} day(s)</div>
                </div>
                <div class="booking-card-detail">
                    <div class="booking-card-detail-label">Total Price</div>
                    <div class="booking-card-detail-value" style="color: var(--success-color);">Rs. ${booking.totalPrice.toLocaleString()}</div>
                </div>
            </div>

            <div class="booking-card-actions">
                <span class="badge ${getBadgeClass(status)}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
                ${status === 'confirmed' ? `
                    <button onclick="cancelBooking(${booking.id})" class="btn btn-danger">Cancel</button>
                    <button onclick="downloadBookingReceipt(${booking.id})" class="btn btn-secondary">Receipt</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function getBadgeClass(status) {
    switch(status) {
        case 'confirmed': return 'badge-info';
        case 'completed': return 'badge-success';
        case 'cancelled': return 'badge-danger';
        default: return 'badge-warning';
    }
}

function switchTab(tab) {
    // Hide all tabs
    document.getElementById('activeTab').classList.add('hidden');
    document.getElementById('completedTab').classList.add('hidden');
    document.getElementById('cancelledTab').classList.add('hidden');

    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    // Show selected tab
    if (tab === 'active') {
        document.getElementById('activeTab').classList.remove('hidden');
        event.target.classList.add('active');
    } else if (tab === 'completed') {
        document.getElementById('completedTab').classList.remove('hidden');
        event.target.classList.add('active');
    } else if (tab === 'cancelled') {
        document.getElementById('cancelledTab').classList.remove('hidden');
        event.target.classList.add('active');
    }
}

function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
        const result = cancelBooking(bookingId);
        if (result) {
            showAlert('Booking cancelled successfully', 'success');
            loadBookings();
        } else {
            showAlert('Failed to cancel booking', 'error');
        }
    }
}

function downloadBookingReceipt(bookingId) {
    const bookings = getAllBookings();
    const booking = bookings.find(b => b.id === bookingId);
    
    if (!booking) {
        showAlert('Booking not found', 'error');
        return;
    }

    const receiptText = `
DriveEasy - Rental Receipt
==========================

Booking ID: #${booking.id.toString().padStart(5, '0')}
Car: ${booking.carName}

Start Date: ${formatDate(booking.startDate)}
End Date: ${formatDate(booking.endDate)}
Duration: ${booking.days} day(s)

Daily Rate: Rs. ${(booking.totalPrice / booking.days).toLocaleString()}
Total Price: Rs. ${booking.totalPrice.toLocaleString()}

Status: ${booking.status}
Booking Date: ${formatDate(booking.bookingDate)}

Included Benefits:
- Full Insurance Coverage
- 24/7 Roadside Assistance
- Free Fuel Top-up
- Free Cancellation (48hrs)

Thank you for choosing DriveEasy!
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(receiptText));
    element.setAttribute('download', `receipt-${booking.id}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    showAlert('Receipt downloaded successfully', 'success');
}

function downloadReceipt() {
    const user = getCurrentUser();
    const userBookings = getUserBookings(user.id);

    if (userBookings.length === 0) {
        showAlert('No bookings to download', 'warning');
        return;
    }

    const receiptText = `
DriveEasy - All Bookings Receipt
=================================

Customer: ${user.username}
Email: ${user.email}
Phone: ${user.phone}

Bookings Summary:
-----------------
${userBookings.map(b => `
Booking #${b.id.toString().padStart(5, '0')}: ${b.carName}
- Period: ${formatDate(b.startDate)} to ${formatDate(b.endDate)}
- Cost: Rs. ${b.totalPrice.toLocaleString()}
- Status: ${b.status}
`).join('\n')}

Total Bookings: ${userBookings.length}
Total Spent: Rs. ${userBookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}

Thank you for choosing DriveEasy!
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(receiptText));
    element.setAttribute('download', `bookings-receipt-${user.id}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    showAlert('Receipt downloaded successfully', 'success');
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
    displayDashboard();
    updateAuthUI();
});
