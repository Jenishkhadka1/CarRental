// ==================== LOCAL STORAGE & DATA MANAGEMENT ====================

// Initialize localStorage with default data
function initializeApp() {
    // Initialize users database
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([
            {
                id: 1,
                username: 'ridewithjenish',
                password: 'jenish123',
                email: 'admin@carental.com',
                phone: '9841234567',
                role: 'admin'
            },
            {
                id: 2,
                username: 'user1',
                password: 'user123',
                email: 'user1@carental.com',
                phone: '9842234567',
                role: 'user'
            }
        ]));
    }

    // Initialize cars database
    if (!localStorage.getItem('cars')) {
        localStorage.setItem('cars', JSON.stringify([
            {
                id: 1,
                name: 'Toyota Camry',
                category: 'sedan',
                price: 2500,
                image: '🚗',
                seats: 5,
                transmission: 'Automatic',
                fuel: 'Petrol',
                available: true,
                description: 'Comfort and reliability combined'
            },
            {
                id: 2,
                name: 'Honda CR-V',
                category: 'suv',
                price: 3500,
                image: '🚙',
                seats: 7,
                transmission: 'Automatic',
                fuel: 'Petrol',
                available: true,
                description: 'Spacious SUV for family trips'
            },
            {
                id: 3,
                name: 'Maruti Swift',
                category: 'hatchback',
                price: 1500,
                image: '🚕',
                seats: 5,
                transmission: 'Manual',
                fuel: 'Petrol',
                available: true,
                description: 'Compact and economical'
            },
            {
                id: 4,
                name: 'BMW 5 Series',
                category: 'luxury',
                price: 7500,
                image: '🚗',
                seats: 5,
                transmission: 'Automatic',
                fuel: 'Diesel',
                available: true,
                description: 'Premium luxury experience'
            },
            {
                id: 5,
                name: 'Creta',
                category: 'suv',
                price: 3000,
                image: '🚙',
                seats: 5,
                transmission: 'Automatic',
                fuel: 'Diesel',
                available: true,
                description: 'Modern SUV with great features'
            }
        ]));
    }

    // Initialize bookings database
    if (!localStorage.getItem('bookings')) {
        localStorage.setItem('bookings', JSON.stringify([]));
    }

    // Initialize current user session
    if (!sessionStorage.getItem('currentUser')) {
        sessionStorage.setItem('currentUser', JSON.stringify(null));
    }
}

// ==================== USER AUTHENTICATION ====================

function registerUser(username, email, password, phone) {
    const users = JSON.parse(localStorage.getItem('users'));
    
    // Check if user already exists
    if (users.some(u => u.username === username || u.email === email)) {
        return { success: false, message: 'Username or email already exists' };
    }

    const newUser = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        username,
        password, // In real app, hash this
        email,
        phone,
        role: 'user'
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true, message: 'Registration successful' };
}

function loginUser(username, password) {
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return { success: false, message: 'Invalid username or password' };
    }

    // Create session
    sessionStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role
    }));
    return { success: true, message: 'Login successful', user };
}

function logoutUser() {
    sessionStorage.setItem('currentUser', JSON.stringify(null));
}

function getCurrentUser() {
    const user = sessionStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}

function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

// ==================== CAR MANAGEMENT ====================

function getAllCars(category = null) {
    let cars = JSON.parse(localStorage.getItem('cars'));
    if (category) {
        cars = cars.filter(car => car.category === category);
    }
    return cars;
}

function getCarById(id) {
    const cars = JSON.parse(localStorage.getItem('cars'));
    return cars.find(car => car.id === id);
}

function addCar(carData) {
    const cars = JSON.parse(localStorage.getItem('cars'));
    const newCar = {
        id: Math.max(...cars.map(c => c.id), 0) + 1,
        ...carData
    };
    cars.push(newCar);
    localStorage.setItem('cars', JSON.stringify(cars));
    return newCar;
}

function updateCar(id, carData) {
    const cars = JSON.parse(localStorage.getItem('cars'));
    const index = cars.findIndex(c => c.id === id);
    if (index !== -1) {
        cars[index] = { ...cars[index], ...carData };
        localStorage.setItem('cars', JSON.stringify(cars));
        return cars[index];
    }
    return null;
}

function deleteCar(id) {
    const cars = JSON.parse(localStorage.getItem('cars'));
    const filtered = cars.filter(c => c.id !== id);
    localStorage.setItem('cars', JSON.stringify(filtered));
    return true;
}

// ==================== BOOKING MANAGEMENT ====================

function createBooking(userId, carId, startDate, endDate) {
    const bookings = JSON.parse(localStorage.getItem('bookings'));
    const car = getCarById(carId);

    if (!car) {
        return { success: false, message: 'Car not found' };
    }

    // Calculate days and total price
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
    const totalPrice = days * car.price;

    const newBooking = {
        id: Math.max(...bookings.map(b => b.id), 0) + 1,
        userId,
        carId,
        carName: car.name,
        startDate,
        endDate,
        days,
        totalPrice,
        status: 'confirmed',
        bookingDate: new Date().toISOString()
    };

    bookings.push(newBooking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    return { success: true, booking: newBooking };
}

function getUserBookings(userId) {
    const bookings = JSON.parse(localStorage.getItem('bookings'));
    return bookings.filter(b => b.userId === userId);
}

function getAllBookings() {
    return JSON.parse(localStorage.getItem('bookings'));
}

function cancelBooking(bookingId) {
    const bookings = JSON.parse(localStorage.getItem('bookings'));
    const booking = bookings.find(b => b.id === bookingId);
    
    if (booking) {
        booking.status = 'cancelled';
        localStorage.setItem('bookings', JSON.stringify(bookings));
        return true;
    }
    return false;
}

// ==================== UTILITY FUNCTIONS ====================

function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Initialize app on load
window.addEventListener('load', initializeApp);
