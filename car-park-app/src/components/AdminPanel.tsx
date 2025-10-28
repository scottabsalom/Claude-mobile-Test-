import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Users, Calendar, ParkingSquare, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export const AdminPanel: React.FC = () => {
  const { currentUser, parkingSpaces, bookings, users, updateSpaceStatus } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'spaces' | 'users'>('overview');

  if (currentUser?.role !== 'admin') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">Access Denied</h3>
        <p className="text-yellow-700">You need administrator privileges to access this panel.</p>
      </div>
    );
  }

  const stats = {
    totalSpaces: parkingSpaces.length,
    available: parkingSpaces.filter(s => s.status === 'available').length,
    reserved: parkingSpaces.filter(s => s.status === 'reserved').length,
    occupied: parkingSpaces.filter(s => s.status === 'occupied').length,
    disabled: parkingSpaces.filter(s => s.status === 'disabled').length,
    totalBookings: bookings.length,
    activeBookings: bookings.filter(b => b.status === 'active').length,
    totalUsers: users.length,
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b p-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-purple-100 text-purple-700 font-medium'
                : 'hover:bg-gray-100'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'bg-purple-100 text-purple-700 font-medium'
                : 'hover:bg-gray-100'
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('spaces')}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'spaces'
                ? 'bg-purple-100 text-purple-700 font-medium'
                : 'hover:bg-gray-100'
            }`}
          >
            Spaces
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-purple-100 text-purple-700 font-medium'
                : 'hover:bg-gray-100'
            }`}
          >
            Users
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'overview' && (
          <div>
            <h3 className="font-semibold text-lg mb-4">System Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <ParkingSquare className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Total Spaces</span>
                </div>
                <div className="text-2xl font-bold">{stats.totalSpaces}</div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <ParkingSquare className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Available</span>
                </div>
                <div className="text-2xl font-bold">{stats.available}</div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <span className="text-sm text-gray-600">Active Bookings</span>
                </div>
                <div className="text-2xl font-bold">{stats.activeBookings}</div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-600">Total Users</span>
                </div>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Reserved</div>
                <div className="text-xl font-semibold">{stats.reserved}</div>
              </div>
              <div className="border p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Occupied</div>
                <div className="text-xl font-semibold">{stats.occupied}</div>
              </div>
              <div className="border p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Disabled</div>
                <div className="text-xl font-semibold">{stats.disabled}</div>
              </div>
              <div className="border p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Occupancy Rate</div>
                <div className="text-xl font-semibold">
                  {Math.round(((stats.reserved + stats.occupied) / stats.totalSpaces) * 100)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <h3 className="font-semibold text-lg mb-4">All Bookings</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Space</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">End</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings
                    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                    .map(booking => (
                      <tr key={booking.id}>
                        <td className="px-4 py-3 text-sm">{booking.userName}</td>
                        <td className="px-4 py-3 text-sm font-medium">{booking.spaceLabel}</td>
                        <td className="px-4 py-3 text-sm">{format(booking.startDate, 'MMM dd, HH:mm')}</td>
                        <td className="px-4 py-3 text-sm">{format(booking.endDate, 'MMM dd, HH:mm')}</td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'active'
                                ? 'bg-blue-100 text-blue-700'
                                : booking.status === 'cancelled'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'spaces' && (
          <div>
            <h3 className="font-semibold text-lg mb-4">Parking Spaces Management</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Label</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {parkingSpaces.map(space => (
                    <tr key={space.id}>
                      <td className="px-4 py-3 text-sm font-medium">{space.label}</td>
                      <td className="px-4 py-3 text-sm capitalize">{space.type.replace('-', ' ')}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            space.status === 'available'
                              ? 'bg-green-100 text-green-700'
                              : space.status === 'reserved'
                              ? 'bg-blue-100 text-blue-700'
                              : space.status === 'occupied'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {space.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <select
                          value={space.status}
                          onChange={e => updateSpaceStatus(space.id, e.target.value as any)}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="available">Available</option>
                          <option value="occupied">Occupied</option>
                          <option value="disabled">Disabled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h3 className="font-semibold text-lg mb-4">Users Management</h3>
            <div className="space-y-3">
              {users.map(user => (
                <div key={user.id} className="border rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    {user.vehicleNumber && (
                      <div className="text-sm text-gray-500 mt-1">Vehicle: {user.vehicleNumber}</div>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
