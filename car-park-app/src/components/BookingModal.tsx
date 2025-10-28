import React, { useState } from 'react';
import { X, Calendar, Clock, Car } from 'lucide-react';
import type { ParkingSpace } from '../types';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  space: ParkingSpace;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, space }) => {
  const { currentUser, createBooking } = useApp();
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [endDate, setEndDate] = useState(
    format(new Date(Date.now() + 8 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm")
  );
  const [vehicleNumber, setVehicleNumber] = useState(currentUser?.vehicleNumber || '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      setError('End date must be after start date');
      return;
    }

    const success = createBooking(space.id, start, end, vehicleNumber);

    if (success) {
      onClose();
    } else {
      setError('Failed to create booking. Space may already be reserved.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Book Parking Space {space.label}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <Car className="w-4 h-4" />
                  <span className="font-medium">Space Type:</span>
                  <span className="capitalize">{space.type.replace('-', ' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">User:</span>
                  <span>{currentUser?.name}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="w-4 h-4 inline mr-1" />
                End Date & Time
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Car className="w-4 h-4 inline mr-1" />
                Vehicle Number (Optional)
              </label>
              <input
                type="text"
                value={vehicleNumber}
                onChange={e => setVehicleNumber(e.target.value)}
                placeholder="ABC-123"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Book Space
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
