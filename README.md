# DriveEasy - Car Rental Service Website

A fully functional car rental service website built with HTML5, CSS3, and JavaScript. No backend server required - all data is stored in the browser's localStorage.

## 📋 Project Overview

DriveEasy is a responsive web application that allows users to:

- Browse and search for available rental cars
- Register and manage user accounts
- Book cars with date selection
- View and manage their bookings
- Admin panel for managing cars and bookings

## ✨ Features

### User Features

- **User Authentication**: Registration and login system
- **Car Browsing**: Search and filter cars by category, price, and transmission
- **Booking System**: Full booking functionality with date selection and price calculation
- **Dashboard**: View all bookings with status tracking
- **Profile Management**: Edit personal information and change password
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Admin Features

- **Car Management**: Add, edit, and delete cars from inventory
- **Booking Management**: View all customer bookings and statistics
- **User Management**: Monitor registered users and their booking history
- **Analytics**: Total revenue, bookings, and user statistics

## 🎯 Technical Stack

### Frontend

- **HTML5**: Semantic markup and structure
- **CSS3**: Responsive design with Flexbox and Grid
- **JavaScript**: Client-side logic and interactivity
- **Local Storage**: Data persistence in browser

### No Backend Required

- All data is stored in browser localStorage
- No database server needed
- No backend API required

## 📁 Project Structure

```
car-rental/
│
├── index.html                 # Homepage
├── login.html                 # Login page
├── register.html              # Registration page
├── cars.html                  # Car listing and browsing
├── booking.html               # Make a booking
├── dashboard.html             # User dashboard
├── profile.html               # User profile settings
├── admin.html                 # Admin control panel
│
├── css/
│   └── style.css             # All styling
│
├── js/
│   ├── app.js                # Core app logic and data management
│   ├── index.js              # Homepage functionality
│   ├── auth.js               # Authentication logic
│   ├── cars.js               # Cars page logic
│   ├── booking.js            # Booking page logic
│   ├── dashboard.js          # Dashboard functionality
│   ├── profile.js            # Profile management
│   └── admin.js              # Admin panel logic
│
├── images/                    # Image assets
└── README.md                  # This file
```

## 🚀 Getting Started

### Installation

1. **Clone or Download**

   ```bash
   # If using git
   git clone <repository-url>

   # Or download the ZIP file and extract it
   ```

2. **No Installation Required**
   - No npm packages to install
   - No backend server to run
   - No database setup needed

3. **Open in Browser**
   ```bash
   # Simply open index.html in your web browser
   # Or use a local server (optional):
   python -m http.server 8000
   # Then visit: http://localhost:8000
   ```

### Demo Credentials

**Admin Account:**

- Username: `ridewithjenish`
- Password: `jenish123`

**User Account:**

- Username: `user1`
- Password: `user123`

## 📖 Usage Guide

### For Users

1. **Register/Login**
   - Create a new account on the Register page or use demo credentials
   - Login with your credentials

2. **Browse Cars**
   - Navigate to "Our Cars" page
   - Filter by category, price, or transmission
   - View car details and specifications

3. **Make a Booking**
   - Click "Book Now" on any car
   - Select start and end dates
   - Enter driver information and pickup location
   - Confirm booking

4. **Manage Bookings**
   - access your dashboard to see all bookings
   - Cancel confirmed bookings
   - Download booking receipts

5. **Profile Settings**
   - Update email, phone, and password
   - Delete your account if needed

### For Admins

1. **Access Admin Panel**
   - Login with admin credentials
   - Click "Admin Panel" in navigation

2. **Manage Cars**
   - Add new cars to inventory
   - Edit existing car prices
   - Delete cars from system
   - View all cars and their status

3. **View Reports**
   - See all customer bookings
   - Monitor user registrations
   - Track revenue from bookings
   - View detailed statistics

## 🎨 Features in Detail

### Car Categories

- Sedan
- SUV
- Hatchback
- Luxury

### Booking Features

- Date range selection
- Automatic price calculation
- Multiple pickup locations
- Special requests notes
- Booking confirmation and receipt download

### Payment Information (Included)

- Full insurance coverage
- 24/7 roadside assistance
- Free fuel top-up
- Free cancellation within 48 hours

## 💾 Data Storage

All data is stored in browser localStorage:

- **Users**: Registration and login data
- **Cars**: Vehicle inventory and details
- **Bookings**: Reservation information

**Note**: Data will persist until browser cache is cleared. Each browser maintains its own data.

## 📱 Responsive Design

The website is fully responsive with breakpoints for:

- **Desktop**: 1200px and above
- **Tablet**: 768px to 1199px
- **Mobile**: Below 768px

## 🔐 Security Features

- Basic password validation (6+ characters)
- Email validation
- Phone number validation
- Session management
- Protected routes for authenticated users

**Note**: This is a frontend-only application. For production use, implement proper backend security measures.

## 🎨 Design Features

- **Color Scheme**: Modern blue and cyan primary colors
- **Typography**: Clean, readable fonts (Segoe UI)
- **Icons**: Unicode emoji for visual appeal
- **Animations**: Smooth transitions and hover effects
- **Accessibility**: Semantic HTML and form labels

## 📊 Sample Data

The application comes with pre-loaded sample cars:

1. Toyota Camry (Sedan) - Rs. 2500/day
2. Honda CR-V (SUV) - Rs. 3500/day
3. Maruti Swift (Hatchback) - Rs. 1500/day
4. BMW 5 Series (Luxury) - Rs. 7500/day
5. Creta (SUV) - Rs. 3000/day

## 🔧 Customization

### Add More Cars

Edit `js/app.js` and add to the cars array in `initializeApp()`

### Change Colors

Modify CSS variables in `css/style.css`:

```css
:root {
  --primary-color: #1e40af;
  --secondary-color: #06b6d4;
  /* ... other colors */
}
```

### Add New Features

- Create new HTML pages
- Add corresponding JavaScript files
- Update navigation links

## ⚠️ Important Notes

1. **Data Loss**: Clearing browser cache will delete all data
2. **Local Storage Limit**: Most browsers support 5-10MB of localStorage
3. **Single Browser**: Data doesn't sync across devices or browsers
4. **No Email Notifications**: Contact form submissions are simulated
5. **No Payment Processing**: Payment gateway integration needs backend

## 🚀 For Production Use

To deploy this application:

1. **Add Backend Server**
   - Implement with Node.js, Python Flask, or PHP
   - Add proper database (MySQL, PostgreSQL, MongoDB)
   - Implement RESTful API

2. **Security Enhancements**
   - Add HTTPS/SSL
   - Implement proper authentication (JWT tokens)
   - Add password hashing (bcrypt)
   - Implement CSRF protection

3. **Features to Add**
   - Email notifications
   - Payment gateway integration
   - SMS notifications
   - File uploads (ID verification)
   - Map integration for locations
   - Rating and review system

4. **Hosting Options**
   - GitHub Pages (frontend only)
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - Traditional web hosting

## 📞 Support

For issues or questions:

- Check the code comments in JavaScript files
- Review the HTML structure for page elements
- Refer to CSS for styling details

## 📄 License

This is a student project for educational purposes.

## 📝 Changelog

### Version 1.0 (Current)

- Initial release
- Core features implemented
- Responsive design
- Admin panel
- Booking system

---

**Created for**: Texas College of Management & IT  
**Course**: Web Technology (BIT233)  
**Year**: Second Year / Third Semester

**Happy Coding!** 🚗✨
