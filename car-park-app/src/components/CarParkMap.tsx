import React, { useState } from 'react';
import { ParkingSpace } from './ParkingSpace';
import { BookingModal } from './BookingModal';
import { useApp } from '../context/AppContext';
import type { ParkingSpace as ParkingSpaceType } from '../types';

export const CarParkMap: React.FC = () => {
  const { parkingSpaces, carParkConfig } = useApp();
  const [selectedSpace, setSelectedSpace] = useState<ParkingSpaceType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSpaceSelect = (space: ParkingSpaceType) => {
    setSelectedSpace(space);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSpace(null);
  };

  // Group spaces by row
  const spacesByRow = parkingSpaces.reduce((acc, space) => {
    if (!acc[space.row]) {
      acc[space.row] = [];
    }
    acc[space.row].push(space);
    return acc;
  }, {} as Record<number, ParkingSpaceType[]>);

  // Count statistics
  const stats = {
    total: parkingSpaces.length,
    available: parkingSpaces.filter(s => s.status === 'available').length,
    reserved: parkingSpaces.filter(s => s.status === 'reserved').length,
    occupied: parkingSpaces.filter(s => s.status === 'occupied').length,
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{carParkConfig.name}</h2>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
            <span>Available ({stats.available})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
            <span>Reserved ({stats.reserved})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
            <span>Occupied ({stats.occupied})</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="inline-block min-w-full">
          {Object.keys(spacesByRow)
            .sort((a, b) => Number(a) - Number(b))
            .map(row => (
              <div key={row} className="flex gap-2 mb-2">
                <div className="flex items-center justify-center w-8 text-sm font-semibold">
                  {String.fromCharCode(65 + Number(row))}
                </div>
                {spacesByRow[Number(row)]
                  .sort((a, b) => a.column - b.column)
                  .map(space => (
                    <ParkingSpace
                      key={space.id}
                      space={space}
                      onSelect={handleSpaceSelect}
                      isSelected={selectedSpace?.id === space.id}
                    />
                  ))}
              </div>
            ))}
        </div>
      </div>

      {selectedSpace && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          space={selectedSpace}
        />
      )}
    </div>
  );
};
