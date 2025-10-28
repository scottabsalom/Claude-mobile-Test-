import React, { useState, useRef } from 'react';
import type { ParkingSpace as ParkingSpaceType } from '../types';
import { useApp } from '../context/AppContext';
import { Navigation, Map as MapIcon, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface MapViewProps {
  spaces: ParkingSpaceType[];
  onSpaceSelect: (space: ParkingSpaceType) => void;
  selectedSpaceId?: string;
  isAdminMode?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
  spaces,
  onSpaceSelect,
  selectedSpaceId,
  isAdminMode = false
}) => {
  const { carParkConfig, currentUser, updateSpacePosition } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [draggedSpaceId, setDraggedSpaceId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const backgroundImage = carParkConfig.backgroundImage;
  const entranceMarkers = carParkConfig.entranceMarkers || [];

  const getSpaceStyle = (space: ParkingSpaceType) => {
    // Use stored coordinates or calculate from grid position
    const x = space.x !== undefined ? space.x : (space.column * 12 + 5);
    const y = space.y !== undefined ? space.y : (space.row * 15 + 10);

    return {
      left: `${x}%`,
      top: `${y}%`,
      position: 'absolute' as const,
    };
  };

  const getStatusColor = (space: ParkingSpaceType) => {
    switch (space.status) {
      case 'available':
        return 'bg-green-500 hover:bg-green-600 border-green-600';
      case 'reserved':
        return 'bg-blue-500 border-blue-600';
      case 'occupied':
        return 'bg-red-500 border-red-600';
      case 'disabled':
        return 'bg-gray-400 border-gray-500';
      default:
        return 'bg-gray-300 border-gray-400';
    }
  };

  const handleSpaceClick = (space: ParkingSpaceType) => {
    if (space.status === 'available' && !isDragging && !isPanning) {
      onSpaceSelect(space);
    }
  };

  // Drag and drop for admin repositioning
  const handleDragStart = (e: React.DragEvent, spaceId: string) => {
    if (isAdminMode) {
      setIsDragging(true);
      setDraggedSpaceId(spaceId);
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (isAdminMode && draggedSpaceId && containerRef.current) {
      e.preventDefault();
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      updateSpacePosition(draggedSpaceId, x, y);
      setIsDragging(false);
      setDraggedSpaceId(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (isAdminMode) {
      e.preventDefault();
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedSpaceId(null);
  };

  // Zoom controls
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Pan controls
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !isAdminMode) { // Left click only, not in admin mode
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const isFavorite = (spaceId: string) => {
    return currentUser?.favoriteSpaces?.includes(spaceId) || false;
  };

  return (
    <div className="relative w-full overflow-hidden rounded-lg" style={{ minHeight: '600px', paddingBottom: '75%' }}>
      {/* Zoom Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg">
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5 dark:text-white" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5 dark:text-white" />
        </button>
        <button
          onClick={handleResetView}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Reset View"
        >
          <Maximize2 className="w-5 h-5 dark:text-white" />
        </button>
        <div className="text-xs text-center text-gray-600 dark:text-gray-400 mt-1">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Zoomable and Pannable Container */}
      <div
        ref={containerRef}
        className={`absolute inset-0 ${isPanning ? 'cursor-grabbing' : isAdminMode ? 'cursor-default' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
          transformOrigin: 'center center',
          transition: isPanning ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        {/* Background Image */}
        {backgroundImage && (
          <div
            className="absolute inset-0 bg-center bg-cover rounded-lg opacity-30"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}

      {/* Grid overlay for positioning reference */}
      {isAdminMode && (
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5" opacity="0.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      )}

      {/* Entrance Markers */}
      {entranceMarkers.map(marker => (
        <div
          key={marker.id}
          className={`absolute flex items-center justify-center ${
            marker.type === 'entrance' ? 'text-green-600' : 'text-orange-600'
          }`}
          style={{
            left: `${marker.x}%`,
            top: `${marker.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="relative">
            <Navigation className="w-8 h-8 drop-shadow-lg" />
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium bg-white dark:bg-gray-800 px-2 py-1 rounded shadow">
              {marker.label}
            </div>
          </div>
        </div>
      ))}

      {/* Parking Spaces */}
      {spaces.map(space => {
        const isSelected = space.id === selectedSpaceId;
        const favorite = isFavorite(space.id);
        const statusColor = getStatusColor(space);

        return (
          <div
            key={space.id}
            draggable={isAdminMode}
            onDragStart={e => handleDragStart(e, space.id)}
            onDragEnd={handleDragEnd}
            onClick={() => handleSpaceClick(space)}
            style={getSpaceStyle(space)}
            className={`
              ${statusColor}
              ${space.status === 'available' ? 'cursor-pointer' : 'cursor-not-allowed'}
              ${isSelected ? 'ring-4 ring-blue-400 scale-110 z-10' : ''}
              ${isDragging && draggedSpaceId === space.id ? 'opacity-50' : ''}
              w-16 h-12 sm:w-20 sm:h-14 border-2 rounded-lg shadow-lg
              flex flex-col items-center justify-center
              transition-all duration-200 hover:scale-105
            `}
          >
            {/* Favorite Star */}
            {favorite && (
              <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            )}

            {/* Space Label */}
            <div className="text-white font-bold text-xs sm:text-sm">
              {space.label}
            </div>

            {/* Distance Badge */}
            {space.distanceFromEntrance !== undefined && (
              <div className="text-white text-xs opacity-90">
                {space.distanceFromEntrance}m
              </div>
            )}

            {/* Type Indicator */}
            {space.type !== 'standard' && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-white text-xs px-1.5 py-0.5 rounded shadow text-gray-700">
                {space.type === 'ev-charging' && '⚡'}
                {space.type === 'disabled' && '♿'}
                {space.type === 'vip' && '⭐'}
                {space.type === 'compact' && 'C'}
              </div>
            )}

            {/* Vehicle Number */}
            {space.currentBooking?.vehicleNumber && (
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded shadow whitespace-nowrap">
                {space.currentBooking.vehicleNumber}
              </div>
            )}
          </div>
        );
      })}
    </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg text-xs">
        <div className="font-semibold mb-2 dark:text-white">Legend</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="dark:text-gray-300">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="dark:text-gray-300">Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="dark:text-gray-300">Occupied</span>
          </div>
          {entranceMarkers.length > 0 && (
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-green-600" />
              <span className="dark:text-gray-300">Entrance</span>
            </div>
          )}
        </div>
      </div>

      {/* No background image placeholder */}
      {!backgroundImage && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600 pointer-events-none">
          <div className="text-center">
            <MapIcon className="w-16 h-16 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No floor plan uploaded</p>
            {isAdminMode && (
              <p className="text-xs mt-1">Add a background image from admin settings</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
