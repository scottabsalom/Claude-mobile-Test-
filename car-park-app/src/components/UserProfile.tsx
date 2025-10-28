import React from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, Car, Shield, LogOut, Moon, Sun, Star } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { currentUser, users, login, logout, toggleDarkMode, parkingSpaces } = useApp();

  if (!currentUser) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Login</h2>
        <div className="space-y-2">
          {users.map(user => (
            <button
              key={user.id}
              onClick={() => login(user.email)}
              className="w-full text-left p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="font-medium dark:text-white">{user.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
              {user.role === 'admin' && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs rounded">
                  Admin
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const favoriteSpaces = parkingSpaces.filter(s =>
    currentUser.favoriteSpaces?.includes(s.id)
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold dark:text-white">Profile</h2>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Logout</span>
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <div className="font-semibold text-lg dark:text-white">{currentUser.name}</div>
            {currentUser.role === 'admin' && (
              <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400 text-sm">
                <Shield className="w-4 h-4" />
                <span>Administrator</span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t dark:border-gray-700 space-y-3">
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <Mail className="w-5 h-5" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Email</div>
              <div className="text-sm">{currentUser.email}</div>
            </div>
          </div>

          {currentUser.vehicleNumber && (
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <Car className="w-5 h-5" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Vehicle Number</div>
                <div className="text-sm">{currentUser.vehicleNumber}</div>
              </div>
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <div className="pt-4 border-t dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {currentUser.darkMode ? (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
              <span className="text-sm font-medium dark:text-white">Dark Mode</span>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                currentUser.darkMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  currentUser.darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Favorite Spaces */}
        {favoriteSpaces.length > 0 && (
          <div className="pt-4 border-t dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium dark:text-white">Favorite Spaces</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {favoriteSpaces.map(space => (
                <span
                  key={space.id}
                  className="px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-sm rounded-full border border-yellow-200 dark:border-yellow-800"
                >
                  {space.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
