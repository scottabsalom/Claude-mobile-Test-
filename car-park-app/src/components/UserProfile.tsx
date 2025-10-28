import React from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, Car, Shield, LogOut } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { currentUser, users, login, logout } = useApp();

  if (!currentUser) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <div className="space-y-2">
          {users.map(user => (
            <button
              key={user.id}
              onClick={() => login(user.email)}
              className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
              {user.role === 'admin' && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                  Admin
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Profile</h2>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Logout</span>
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="font-semibold text-lg">{currentUser.name}</div>
            {currentUser.role === 'admin' && (
              <div className="flex items-center gap-1 text-purple-600 text-sm">
                <Shield className="w-4 h-4" />
                <span>Administrator</span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t space-y-3">
          <div className="flex items-center gap-3 text-gray-700">
            <Mail className="w-5 h-5" />
            <div>
              <div className="text-xs text-gray-500">Email</div>
              <div className="text-sm">{currentUser.email}</div>
            </div>
          </div>

          {currentUser.vehicleNumber && (
            <div className="flex items-center gap-3 text-gray-700">
              <Car className="w-5 h-5" />
              <div>
                <div className="text-xs text-gray-500">Vehicle Number</div>
                <div className="text-sm">{currentUser.vehicleNumber}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
