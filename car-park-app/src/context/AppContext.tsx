import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, ParkingSpace, Booking, CarParkConfig, SpaceStatus } from '../types';
import { generateMockData } from '../utils/mockData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  parkingSpaces: ParkingSpace[];
  bookings: Booking[];
  carParkConfig: CarParkConfig;
  login: (email: string) => void;
  logout: () => void;
  createBooking: (spaceId: string, startDate: Date, endDate: Date, vehicleNumber?: string) => boolean;
  cancelBooking: (bookingId: string) => void;
  updateSpaceStatus: (spaceId: string, status: SpaceStatus) => void;
  updateCarParkConfig: (config: Partial<CarParkConfig>) => void;
  toggleFavoriteSpace: (spaceId: string) => void;
  extendBooking: (bookingId: string, newEndDate: Date) => boolean;
  checkIn: (bookingId: string) => void;
  checkOut: (bookingId: string) => void;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [parkingSpaces, setParkingSpaces] = useState<ParkingSpace[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [carParkConfig, setCarParkConfig] = useState<CarParkConfig>({
    rows: 0,
    columns: 0,
    name: '',
    spaces: [],
  });

  // Initialize with mock data
  useEffect(() => {
    const mockData = generateMockData();
    setUsers(mockData.users);
    setParkingSpaces(mockData.spaces);
    setBookings(mockData.bookings);
    setCarParkConfig(mockData.config);

    // Auto-login first user for demo
    setCurrentUser(mockData.users[0]);
  }, []);

  const login = (email: string) => {
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUserId', user.id);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUserId');
  };

  const createBooking = (spaceId: string, startDate: Date, endDate: Date, vehicleNumber?: string): boolean => {
    if (!currentUser) return false;

    const space = parkingSpaces.find(s => s.id === spaceId);
    if (!space || space.status !== 'available') return false;

    // Check for conflicting bookings
    const hasConflict = bookings.some(b =>
      b.spaceId === spaceId &&
      b.status === 'active' &&
      ((startDate >= b.startDate && startDate < b.endDate) ||
       (endDate > b.startDate && endDate <= b.endDate) ||
       (startDate <= b.startDate && endDate >= b.endDate))
    );

    if (hasConflict) return false;

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      spaceId,
      spaceLabel: space.label,
      startDate,
      endDate,
      vehicleNumber: vehicleNumber || currentUser.vehicleNumber,
      createdAt: new Date(),
      status: 'active',
    };

    setBookings([...bookings, newBooking]);

    // Update space status
    const updatedSpaces = parkingSpaces.map(s =>
      s.id === spaceId
        ? { ...s, status: 'reserved' as SpaceStatus, currentBooking: newBooking }
        : s
    );
    setParkingSpaces(updatedSpaces);

    return true;
  };

  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    setBookings(bookings.map(b =>
      b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
    ));

    // Update space status
    const updatedSpaces = parkingSpaces.map(s =>
      s.id === booking.spaceId
        ? { ...s, status: 'available' as SpaceStatus, currentBooking: undefined }
        : s
    );
    setParkingSpaces(updatedSpaces);
  };

  const updateSpaceStatus = (spaceId: string, status: SpaceStatus) => {
    setParkingSpaces(parkingSpaces.map(s =>
      s.id === spaceId ? { ...s, status } : s
    ));
  };

  const updateCarParkConfig = (config: Partial<CarParkConfig>) => {
    setCarParkConfig({ ...carParkConfig, ...config });
  };

  const toggleFavoriteSpace = (spaceId: string) => {
    if (!currentUser) return;

    const favorites = currentUser.favoriteSpaces || [];
    const newFavorites = favorites.includes(spaceId)
      ? favorites.filter(id => id !== spaceId)
      : [...favorites, spaceId];

    const updatedUser = { ...currentUser, favoriteSpaces: newFavorites };
    setCurrentUser(updatedUser);

    // Update in users list
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const extendBooking = (bookingId: string, newEndDate: Date): boolean => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking || booking.status !== 'active') return false;

    // Check for conflicts with new end date
    const hasConflict = bookings.some(b =>
      b.id !== bookingId &&
      b.spaceId === booking.spaceId &&
      b.status === 'active' &&
      newEndDate > b.startDate && newEndDate <= b.endDate
    );

    if (hasConflict) return false;

    setBookings(bookings.map(b =>
      b.id === bookingId ? { ...b, endDate: newEndDate } : b
    ));

    return true;
  };

  const checkIn = (bookingId: string) => {
    setBookings(bookings.map(b =>
      b.id === bookingId
        ? { ...b, checkedIn: true, checkedInAt: new Date() }
        : b
    ));

    // Update space status to occupied
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setParkingSpaces(parkingSpaces.map(s =>
        s.id === booking.spaceId ? { ...s, status: 'occupied' as SpaceStatus } : s
      ));
    }
  };

  const checkOut = (bookingId: string) => {
    setBookings(bookings.map(b =>
      b.id === bookingId
        ? { ...b, checkedOut: true, checkedOutAt: new Date(), status: 'completed' as const }
        : b
    ));

    // Update space status to available
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setParkingSpaces(parkingSpaces.map(s =>
        s.id === booking.spaceId
          ? { ...s, status: 'available' as SpaceStatus, currentBooking: undefined }
          : s
      ));
    }
  };

  const toggleDarkMode = () => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, darkMode: !currentUser.darkMode };
    setCurrentUser(updatedUser);

    // Update in users list
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));

    // Apply dark mode to document
    if (updatedUser.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Apply dark mode on load
  useEffect(() => {
    if (currentUser?.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentUser]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        parkingSpaces,
        bookings,
        carParkConfig,
        login,
        logout,
        createBooking,
        cancelBooking,
        updateSpaceStatus,
        updateCarParkConfig,
        toggleFavoriteSpace,
        extendBooking,
        checkIn,
        checkOut,
        toggleDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
