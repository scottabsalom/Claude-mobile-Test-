import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, Car, MapPin, X, LogIn, LogOut, Plus } from 'lucide-react';
import { format, addHours } from 'date-fns';

export const BookingHistory: React.FC = () => {
  const { currentUser, bookings, cancelBooking, checkIn, checkOut, extendBooking } = useApp();
  const [extendingBookingId, setExtendingBookingId] = useState<string | null>(null);
  const [extendHours, setExtendHours] = useState<number>(2);

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

  const handleCheckIn = (bookingId: string) => {
    if (window.confirm('Check in to this parking space?')) {
      checkIn(bookingId);
    }
  };

  const handleCheckOut = (bookingId: string) => {
    if (window.confirm('Check out from this parking space? This will mark your booking as completed.')) {
      checkOut(bookingId);
      setExtendingBookingId(null);
    }
  };

  const handleExtend = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const newEndDate = addHours(booking.endDate, extendHours);
    const success = extendBooking(bookingId, newEndDate);

    if (success) {
      alert(`Booking extended by ${extendHours} hours!`);
      setExtendingBookingId(null);
      setExtendHours(2);
    } else {
      alert('Could not extend booking. There may be a conflict with another booking.');
    }
  };

  const BookingCard: React.FC<{ booking: typeof userBookings[0] }> = ({ booking }) => {
    const isExtending = extendingBookingId === booking.id;
    const canCheckIn = booking.status === 'active' && !booking.checkedIn;
    const canCheckOut = booking.status === 'active' && booking.checkedIn && !booking.checkedOut;
    const canExtend = booking.status === 'active' && !booking.checkedOut;

    return (
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
          {booking.status === 'active' && !booking.checkedOut && (
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

          <div className="flex flex-wrap items-center gap-2 mt-2">
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

            {booking.checkedIn && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                CHECKED IN
              </span>
            )}

            {booking.checkedOut && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                CHECKED OUT
              </span>
            )}
          </div>

          {booking.checkedInAt && (
            <div className="text-xs text-gray-600 mt-2">
              Checked in: {format(booking.checkedInAt, 'MMM dd, HH:mm')}
            </div>
          )}

          {booking.checkedOutAt && (
            <div className="text-xs text-gray-600">
              Checked out: {format(booking.checkedOutAt, 'MMM dd, HH:mm')}
            </div>
          )}

          {/* Action Buttons */}
          {booking.status === 'active' && (
            <div className="mt-4 flex flex-wrap gap-2">
              {canCheckIn && (
                <button
                  onClick={() => handleCheckIn(booking.id)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Check In
                </button>
              )}

              {canCheckOut && (
                <button
                  onClick={() => handleCheckOut(booking.id)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Check Out
                </button>
              )}

              {canExtend && (
                <button
                  onClick={() => setExtendingBookingId(isExtending ? null : booking.id)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Extend
                </button>
              )}
            </div>
          )}

          {/* Extend Booking Form */}
          {isExtending && (
            <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
              <div className="text-sm font-medium mb-2">Extend booking by:</div>
              <div className="flex items-center gap-2">
                <select
                  value={extendHours}
                  onChange={e => setExtendHours(Number(e.target.value))}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                >
                  <option value={1}>1 hour</option>
                  <option value={2}>2 hours</option>
                  <option value={4}>4 hours</option>
                  <option value={8}>8 hours</option>
                </select>
                <button
                  onClick={() => handleExtend(booking.id)}
                  className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setExtendingBookingId(null)}
                  className="px-3 py-1.5 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
              <div className="text-xs text-gray-600 mt-2">
                New end time: {format(addHours(booking.endDate, extendHours), 'MMM dd, yyyy HH:mm')}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

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
