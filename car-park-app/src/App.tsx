import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { CarParkMap } from './components/CarParkMap';
import { BookingHistory } from './components/BookingHistory';
import { UserProfile } from './components/UserProfile';
import { AdminPanel } from './components/AdminPanel';
import { ParkingSquare, Calendar, User, Settings } from 'lucide-react';

type Tab = 'map' | 'bookings' | 'profile' | 'admin';

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('map');

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <ParkingSquare className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Car Park Manager</h1>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b sticky top-[73px] z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors whitespace-nowrap border-b-2 ${
                activeTab === 'map'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              <ParkingSquare className="w-5 h-5" />
              <span>Map</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors whitespace-nowrap border-b-2 ${
                activeTab === 'bookings'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>My Bookings</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors whitespace-nowrap border-b-2 ${
                activeTab === 'profile'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors whitespace-nowrap border-b-2 ${
                activeTab === 'admin'
                  ? 'text-purple-600 border-purple-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'map' && (
          <div className="bg-white rounded-lg shadow p-6">
            <CarParkMap />
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-lg shadow p-6">
            <BookingHistory />
          </div>
        )}

        {activeTab === 'profile' && <UserProfile />}

        {activeTab === 'admin' && <AdminPanel />}
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>Car Park Management System - Built with React & TypeScript</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
