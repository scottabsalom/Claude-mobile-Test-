import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, Car, MapPin, X } from 'lucide-react';
import { format } from 'date-fns';

export const BookingHistory: React.FC = () => {
  const { currentUser, bookings, cancelBooking } = useApp();

  const userBookings = bookings
    .filter(b => b.userId === currentUser?.id)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const activeBookings = userBookings.filter(b => b.status === 'active');
  const pastBookings = userBookings.filter(b => b.status !== 'active');

  const handleCancel = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(bookingId);
    }
  };

  const BookingCard: React.FC<{ booking: typeof userBookings[0] }> = ({ booking }) => (
    <div
      className={`border rounded-lg p-4 ${
        booking.status === 'active'
          ? 'border-blue-300 bg-blue-50'
          : booking.status === 'cancelled'
          ? 'border-gray-300 bg-gray-50'
          : 'border-green-300 bg-green-50'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-lg">Space {booking.spaceLabel}</h3>
        </div>
        {booking.status === 'active' && (
          <button
            onClick={() => handleCancel(booking.id)}
            className="p-1 hover:bg-red-100 rounded-full transition-colors"
            title="Cancel booking"
          >
            <X className="w-5 h-5 text-red-500" />
          </button>
        )}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar className="w-4 h-4" />
          <span>
            {format(booking.startDate, 'MMM dd, yyyy')} - {format(booking.endDate, 'MMM dd, yyyy')}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="w-4 h-4" />
          <span>
            {format(booking.startDate, 'HH:mm')} - {format(booking.endDate, 'HH:mm')}
          </span>
        </div>

        {booking.vehicleNumber && (
          <div className="flex items-center gap-2 text-gray-700">
            <Car className="w-4 h-4" />
            <span>{booking.vehicleNumber}</span>
          </div>
        )}

        <div className="flex items-center gap-2 mt-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              booking.status === 'active'
                ? 'bg-blue-100 text-blue-700'
                : booking.status === 'cancelled'
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {booking.status.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {activeBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Active Bookings</h2>
          <div className="space-y-3">
            {activeBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      )}

      {pastBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Past Bookings</h2>
          <div className="space-y-3">
            {pastBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      )}

      {userBookings.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No bookings yet</p>
          <p className="text-sm mt-2">Select a space from the map to make your first booking</p>
        </div>
      )}
    </div>
  );
};
