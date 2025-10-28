import React from 'react';
import type { ParkingSpace as ParkingSpaceType } from '../types';
import { Car, Zap, Users, Minimize, Ban, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ParkingSpaceProps {
  space: ParkingSpaceType;
  onSelect: (space: ParkingSpaceType) => void;
  isSelected: boolean;
}

export const ParkingSpace: React.FC<ParkingSpaceProps> = ({ space, onSelect, isSelected }) => {
  const { currentUser, toggleFavoriteSpace } = useApp();
  const isFavorite = currentUser?.favoriteSpaces?.includes(space.id) || false;

  const getStatusColor = () => {
    switch (space.status) {
      case 'available':
        return 'bg-green-100 hover:bg-green-200 border-green-300';
      case 'reserved':
        return 'bg-blue-100 border-blue-300 cursor-not-allowed';
      case 'occupied':
        return 'bg-red-100 border-red-300 cursor-not-allowed';
      case 'disabled':
        return 'bg-gray-200 border-gray-400 cursor-not-allowed';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const getTypeIcon = () => {
    switch (space.type) {
      case 'disabled':
        return <Users className="w-3 h-3" />;
      case 'ev-charging':
        return <Zap className="w-3 h-3 text-yellow-600" />;
      case 'compact':
        return <Minimize className="w-3 h-3" />;
      case 'vip':
        return <span className="text-xs font-bold">VIP</span>;
      default:
        return <Car className="w-3 h-3" />;
    }
  };

  const handleClick = () => {
    if (space.status === 'available') {
      onSelect(space);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteSpace(space.id);
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative border-2 rounded-lg p-2 transition-all duration-200
        ${getStatusColor()}
        ${isSelected ? 'ring-2 ring-blue-500 scale-105' : ''}
        ${space.status === 'available' ? 'cursor-pointer' : ''}
        w-20 h-20 flex flex-col items-center justify-center
      `}
    >
      {space.status === 'disabled' && (
        <Ban className="absolute top-1 right-1 w-4 h-4 text-red-500" />
      )}

      {/* Favorite Star */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-1 left-1 p-0.5 hover:scale-110 transition-transform"
        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Star
          className={`w-3 h-3 ${
            isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
          }`}
        />
      </button>

      <div className="text-xs font-semibold mb-1">{space.label}</div>

      <div className="flex items-center justify-center">
        {getTypeIcon()}
      </div>

      {space.currentBooking && (
        <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs px-1 rounded">
          {space.currentBooking.vehicleNumber?.substring(0, 6)}
        </div>
      )}
    </div>
  );
};
