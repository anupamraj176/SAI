import React, { useEffect } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { Trash2, User } from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';

const AdminUsers = () => {
  const { users, fetchUsers, deleteUser, isLoading, error } = useAdminStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          Error loading users: {error}
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Users</h2>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center text-gray-500">
          No users found.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Users</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Name</th>
              <th className="p-4 font-semibold text-gray-600">Email</th>
              <th className="p-4 font-semibold text-gray-600">Joined Date</th>
              <th className="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User size={16} className="text-gray-500" />
                  </div>
                  <span className="font-medium text-gray-800">{user.name}</span>
                </td>
                <td className="p-4 text-gray-600">{user.email}</td>
                <td className="p-4 text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => {
                      if(window.confirm('Are you sure you want to delete this user?')) {
                        deleteUser(user._id);
                      }
                    }}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    title="Delete User"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && (
          <div className="p-8 text-center text-gray-500">No users found.</div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
