export type SpaceStatus = 'available' | 'occupied' | 'reserved' | 'disabled';
export type UserRole = 'user' | 'admin';
export type SpaceType = 'standard' | 'disabled' | 'ev-charging' | 'compact' | 'vip';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  vehicleNumber?: string;
  favoriteSpaces?: string[];
  darkMode?: boolean;
}

export interface ParkingSpace {
  id: string;
  row: number;
  column: number;
  label: string;
  status: SpaceStatus;
  type: SpaceType;
  currentBooking?: Booking;
  // Map view coordinates (percentage-based for responsive layout)
  x?: number;
  y?: number;
  // Distance from entrance in meters
  distanceFromEntrance?: number;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  spaceId: string;
  spaceLabel: string;
  startDate: Date;
  endDate: Date;
  vehicleNumber?: string;
  createdAt: Date;
  status: 'active' | 'completed' | 'cancelled';
  checkedIn?: boolean;
  checkedInAt?: Date;
  checkedOut?: boolean;
  checkedOutAt?: Date;
}

export interface EntranceMarker {
  id: string;
  x: number;
  y: number;
  label: string;
  type: 'entrance' | 'exit';
}

export interface CarParkLocation {
  id: string;
  name: string;
  address?: string;
  rows: number;
  columns: number;
  spaces: ParkingSpace[];
  backgroundImage?: string;
  entranceMarkers?: EntranceMarker[];
  viewMode?: 'grid' | 'map';
}

export interface CarParkConfig {
  rows: number;
  columns: number;
  name: string;
  spaces: ParkingSpace[];
  backgroundImage?: string;
  entranceMarkers?: EntranceMarker[];
  viewMode?: 'grid' | 'map';
  locations?: CarParkLocation[];
  activeLocationId?: string;
}
