# Car Park Management System

A comprehensive web-based car park management application built with React, TypeScript, and Tailwind CSS. This application allows organizations to manage parking spaces, enable users to book spaces, and provides administrative controls for car park configuration.

## Features

### Core Functionality

- **Interactive Car Park Map**: Visual grid-based representation of parking spaces with real-time availability
- **Space Booking System**: Users can select and book available parking spaces with date/time selection
- **Booking Management**: View, manage, and cancel bookings
- **User Profiles**: User authentication and profile management
- **Admin Panel**: Comprehensive administrative controls for car park management

### Parking Space Types

- **Standard**: Regular parking spaces
- **Disabled**: Accessible parking for people with disabilities
- **EV Charging**: Electric vehicle charging stations
- **Compact**: Smaller spaces for compact vehicles
- **VIP**: Reserved spaces for VIP users

### Space Status Indicators

- **Available**: Green - Space is free to book
- **Reserved**: Blue - Space has an active booking
- **Occupied**: Red - Space is currently in use
- **Disabled**: Gray - Space is out of service

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **date-fns** - Date manipulation and formatting

## Getting Started

### Prerequisites

- Node.js 16+ and npm installed on your system

### Installation

1. Navigate to the project directory:
```bash
cd car-park-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage Guide

### For Users

1. **Login**: Select your user profile from the Profile tab (demo users are pre-loaded)

2. **View Car Park Map**: Navigate to the "Map" tab to see all parking spaces
   - Green spaces are available
   - Blue spaces are reserved
   - Red spaces are occupied
   - Gray spaces are disabled

3. **Book a Space**:
   - Click on any available (green) parking space
   - Fill in the booking details (start/end date and time)
   - Optionally add vehicle number
   - Confirm the booking

4. **Manage Bookings**:
   - Go to "My Bookings" tab
   - View all active and past bookings
   - Cancel active bookings if needed

### For Administrators

1. **Login as Admin**: Use the admin account from the Profile tab

2. **Access Admin Panel**: Click the "Admin" tab

3. **View Overview**:
   - System statistics
   - Occupancy rates
   - Total spaces and users

4. **Manage Bookings**:
   - View all bookings across all users
   - Monitor booking status

5. **Manage Spaces**:
   - View all parking spaces
   - Change space status (available, occupied, disabled)
   - Monitor space types

6. **Manage Users**:
   - View all registered users
   - See user roles and vehicle information

## Project Structure

```
car-park-app/
├── src/
│   ├── components/          # React components
│   │   ├── AdminPanel.tsx   # Admin dashboard
│   │   ├── BookingHistory.tsx
│   │   ├── BookingModal.tsx # Booking creation dialog
│   │   ├── CarParkMap.tsx   # Main map view
│   │   ├── ParkingSpace.tsx # Individual space component
│   │   └── UserProfile.tsx  # User management
│   ├── context/
│   │   └── AppContext.tsx   # Global state management
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   ├── utils/
│   │   └── mockData.ts      # Mock data generator
│   ├── App.tsx              # Main application component
│   ├── index.css            # Global styles
│   └── main.tsx             # Application entry point
├── public/                  # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## Demo Users

The application comes with pre-loaded demo users:

1. **John Doe** (User)
   - Email: john@example.com
   - Vehicle: ABC-123

2. **Jane Smith** (User)
   - Email: jane@example.com
   - Vehicle: XYZ-789

3. **Admin User** (Administrator)
   - Email: admin@example.com
   - Vehicle: ADM-001
   - Full access to admin panel

## Configuration

### Car Park Layout

The default configuration includes:
- 5 rows (A-E)
- 8 columns (1-8)
- 40 total parking spaces
- Mix of standard, disabled, EV charging, VIP, and compact spaces

To modify the layout, edit `src/utils/mockData.ts`

## Features in Detail

### Real-time Availability

The system tracks space availability in real-time. When a user books a space:
- Space status changes from "available" to "reserved"
- Space is no longer selectable by other users
- Booking appears in the user's booking history

### Conflict Prevention

The booking system prevents double-booking by:
- Checking for overlapping time slots
- Only allowing one active booking per space at a time
- Validating date ranges

### Responsive Design

The application is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices

## Future Enhancements

Potential features for future development:

- Backend API integration
- Database persistence
- Real-time updates with WebSocket
- Email notifications
- QR code generation for bookings
- Payment integration
- Multi-location support
- Reporting and analytics
- Mobile app (React Native)
- Integration with gate systems

## Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available for educational and commercial use.

## Support

For issues, questions, or suggestions, please open an issue in the repository.

---

Built with React, TypeScript, and Tailwind CSS
