import React, { useEffect } from "react";
import { useAdminStore } from "../../store/adminStore";
import { Trash2, User } from "lucide-react";
import LoadingSpinner from "../LoadingSpinner";

const PALETTE = {
  emerald: "#347B66",
  lime: "#CFF56E",
  base: "#E8F5E9",
  forest: "#3B4A38",
  evergreen: "#1F3326",
};

const AdminUsers = () => {
  const { users, fetchUsers, deleteUser, isLoading, error } = useAdminStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-10 bg-[#E8F5E9]">
        <div className="bg-red-100 text-red-700 p-4 rounded-xl border border-red-300 shadow">
          Error loading users: {error}
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="p-10 bg-[#E8F5E9]">
        <h2 className="text-3xl font-bold text-[#1F3326] mb-6">
          Manage Users
        </h2>

        <div className="bg-[#E8F5E9] p-10 rounded-2xl shadow-md border border-[#6FA99F] text-center text-[#1F3326]">
          No users found.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 bg-[#E8F5E9] min-h-screen">
      <h2 className="text-3xl font-bold text-[#1F3326] mb-8">
        Manage Users
      </h2>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block bg-[#E8F5E9] rounded-2xl shadow-xl border border-[#6FA99F] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#C8E6C9] border-b border-[#6FA99F]">
            <tr>
              <th className="p-4 font-semibold text-[#1F3326]">Name</th>
              <th className="p-4 font-semibold text-[#1F3326]">Email</th>
              <th className="p-4 font-semibold text-[#1F3326]">
                Joined Date
              </th>
              <th className="p-4 font-semibold text-[#1F3326]">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#6FA99F]">
            {users.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-[#C8E6C9] transition"
              >
                {/* USER AVATAR + NAME */}
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#C8E6C9] border border-[#6FA99F] rounded-full flex items-center justify-center">
                    <User size={18} className="text-[#347B66]" />
                  </div>
                  <span className="font-medium text-[#1F3326]">
                    {user.name}
                  </span>
                </td>

                {/* EMAIL */}
                <td className="p-4 text-[#3B4A38]">{user.email}</td>

                {/* JOINED DATE */}
                <td className="p-4 text-[#3B4A38] text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

                {/* DELETE BUTTON */}
                <td className="p-4">
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this user?"
                        )
                      ) {
                        deleteUser(user._id);
                      }
                    }}
                    className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition"
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
          <div className="p-8 text-center text-[#1F3326]">
            No users found.
          </div>
        )}
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {users.map((user) => (
          <div 
            key={user._id}
            className="bg-[#E8F5E9] p-4 rounded-xl shadow-md border border-[#6FA99F] space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#C8E6C9] border border-[#6FA99F] rounded-full flex items-center justify-center shrink-0">
                <User size={20} className="text-[#347B66]" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-[#1F3326] truncate">{user.name}</h3>
                <p className="text-sm text-[#3B4A38] truncate">{user.email}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#6FA99F]/50">
              <span className="text-xs font-medium text-[#1F3326] bg-[#C8E6C9] px-2 py-1 rounded border border-[#6FA99F]">
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </span>
              
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this user?")) {
                    deleteUser(user._id);
                  }
                }}
                className="bg-red-100 text-red-700 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-xs font-bold"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="p-8 text-center text-[#1F3326] bg-[#E8F5E9] rounded-xl border border-[#6FA99F]">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
