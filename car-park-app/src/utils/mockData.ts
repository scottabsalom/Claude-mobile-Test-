import type { User, ParkingSpace, Booking, CarParkConfig, SpaceType, EntranceMarker } from '../types';

// Helper function to calculate distance between two points
const calculateDistance = (x1: number, y1: number, x2: number, y2: number): number => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  // Convert percentage distance to approximate meters (assuming 100% = 50m)
  return Math.round(Math.sqrt(dx * dx + dy * dy) * 0.5);
};

export const generateMockData = () => {
  // Create users
  const users: User[] = [
    {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      vehicleNumber: 'ABC-123',
    },
    {
      id: 'user-2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      vehicleNumber: 'XYZ-789',
    },
    {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      vehicleNumber: 'ADM-001',
    },
  ];

  // Define entrance markers
  const entranceMarkers: EntranceMarker[] = [
    {
      id: 'entrance-1',
      x: 5,
      y: 50,
      label: 'Main Entrance',
      type: 'entrance',
    },
    {
      id: 'exit-1',
      x: 95,
      y: 50,
      label: 'Exit',
      type: 'exit',
    },
  ];

  // Create parking spaces in a 5x8 grid
  const rows = 5;
  const columns = 8;
  const spaces: ParkingSpace[] = [];

  // Main entrance position for distance calculation
  const entranceX = entranceMarkers[0].x;
  const entranceY = entranceMarkers[0].y;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const spaceNumber = row * columns + col + 1;
      const label = `${String.fromCharCode(65 + row)}${col + 1}`;

      let type: SpaceType = 'standard';
      let status: 'available' | 'disabled' = 'available';

      // Add some special spaces
      if (col === 0) {
        type = 'disabled'; // First column is disabled parking
      } else if (col === 7 && row < 2) {
        type = 'ev-charging'; // Last column, first 2 rows for EV
      } else if (row === 0 && col > 0 && col < 3) {
        type = 'vip'; // Some VIP spots
      } else if (row === 4 && col > 4) {
        type = 'compact';
      }

      // Disable some random spaces
      if (Math.random() < 0.05) {
        status = 'disabled';
      }

      // Calculate map position (percentage-based for responsive layout)
      // Spaces arranged in two columns with a center aisle
      const isLeftSide = col < 4;
      const columnOffset = isLeftSide ? col : col - 4;

      const x = isLeftSide
        ? 15 + (columnOffset * 8)  // Left side: 15% to 39%
        : 55 + (columnOffset * 8); // Right side: 55% to 79%

      const y = 15 + (row * 16); // 15% to 79% vertically

      // Calculate distance from entrance
      const distanceFromEntrance = calculateDistance(entranceX, entranceY, x, y);

      spaces.push({
        id: `space-${spaceNumber}`,
        row,
        column: col,
        label,
        status,
        type,
        x,
        y,
        distanceFromEntrance,
      });
    }
  }

  // Create some mock bookings
  const now = new Date();
  const bookings: Booking[] = [
    {
      id: 'booking-1',
      userId: 'user-1',
      userName: 'John Doe',
      spaceId: 'space-2',
      spaceLabel: 'A2',
      startDate: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 4 * 60 * 60 * 1000),
      vehicleNumber: 'ABC-123',
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      status: 'active',
    },
    {
      id: 'booking-2',
      userId: 'user-2',
      userName: 'Jane Smith',
      spaceId: 'space-10',
      spaceLabel: 'B2',
      startDate: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 6 * 60 * 60 * 1000),
      vehicleNumber: 'XYZ-789',
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      status: 'active',
    },
  ];

  // Update spaces with current bookings
  bookings.forEach(booking => {
    const space = spaces.find(s => s.id === booking.spaceId);
    if (space && booking.status === 'active') {
      space.status = 'reserved';
      space.currentBooking = booking;
    }
  });

  const config: CarParkConfig = {
    rows,
    columns,
    name: 'Main Office Car Park',
    spaces,
    entranceMarkers,
    viewMode: 'grid', // Default to grid view
    // Optional: Add a sample background image URL
    // backgroundImage: 'https://example.com/carpark-floor-plan.jpg',
  };

  return { users, spaces, bookings, config };
};
