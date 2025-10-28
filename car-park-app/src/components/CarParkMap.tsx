import React, { useState, useMemo } from 'react';
import { ParkingSpace } from './ParkingSpace';
import { BookingModal } from './BookingModal';
import { useApp } from '../context/AppContext';
import type { ParkingSpace as ParkingSpaceType, SpaceType, SpaceStatus } from '../types';
import { Search, Filter, X } from 'lucide-react';

export const CarParkMap: React.FC = () => {
  const { parkingSpaces, carParkConfig } = useApp();
  const [selectedSpace, setSelectedSpace] = useState<ParkingSpaceType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<SpaceType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<SpaceStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const handleSpaceSelect = (space: ParkingSpaceType) => {
    setSelectedSpace(space);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSpace(null);
  };

  // Filter and search spaces
  const filteredSpaces = useMemo(() => {
    return parkingSpaces.filter(space => {
      // Search filter
      if (searchQuery && !space.label.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Type filter
      if (filterType !== 'all' && space.type !== filterType) {
        return false;
      }

      // Status filter
      if (filterStatus !== 'all' && space.status !== filterStatus) {
        return false;
      }

      return true;
    });
  }, [parkingSpaces, searchQuery, filterType, filterStatus]);

  // Group filtered spaces by row
  const spacesByRow = filteredSpaces.reduce((acc, space) => {
    if (!acc[space.row]) {
      acc[space.row] = [];
    }
    acc[space.row].push(space);
    return acc;
  }, {} as Record<number, ParkingSpaceType[]>);

  // Count statistics
  const stats = {
    total: filteredSpaces.length,
    available: filteredSpaces.filter(s => s.status === 'available').length,
    reserved: filteredSpaces.filter(s => s.status === 'reserved').length,
    occupied: filteredSpaces.filter(s => s.status === 'occupied').length,
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setFilterStatus('all');
  };

  const hasActiveFilters = searchQuery || filterType !== 'all' || filterStatus !== 'all';

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">{carParkConfig.name}</h2>

        {/* Search and Filter */}
        <div className="mb-4 space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by space number (e.g., A1, B5)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-colors ${
                showFilters || hasActiveFilters
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter
              {hasActiveFilters && <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">Active</span>}
            </button>
          </div>

          {showFilters && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Space Type</label>
                  <select
                    value={filterType}
                    onChange={e => setFilterType(e.target.value as SpaceType | 'all')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="standard">Standard</option>
                    <option value="disabled">Disabled</option>
                    <option value="ev-charging">EV Charging</option>
                    <option value="compact">Compact</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value as SpaceStatus | 'all')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="occupied">Occupied</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <X className="w-4 h-4" />
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Statistics */}
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
          {filterType !== 'all' || filterStatus !== 'all' || searchQuery ? (
            <span className="text-gray-500">({stats.total} of {parkingSpaces.length} shown)</span>
          ) : null}
        </div>
      </div>

      {filteredSpaces.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No spaces match your search criteria</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-700"
          >
            Clear filters
          </button>
        </div>
      ) : (
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
      )}

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
