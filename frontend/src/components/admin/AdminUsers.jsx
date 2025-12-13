import React, { useEffect } from "react";
import { useAdminStore } from "../../store/adminStore";
import { Trash2, User } from "lucide-react";
import LoadingSpinner from "../LoadingSpinner";

const PALETTE = {
  paprika: "#E66A32",
  nougat: "#FFF6E9",
  beige: "#FAF3E3",
  rust: "#C24C30",
  maroon: "#8C2F2B",
};

const AdminUsers = () => {
  const { users, fetchUsers, deleteUser, isLoading, error } = useAdminStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-10 bg-[#FAF3E3]">
        <div className="bg-red-100 text-red-700 p-4 rounded-xl border border-red-300 shadow">
          Error loading users: {error}
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="p-10 bg-[#FAF3E3]">
        <h2 className="text-3xl font-bold text-[#2B2B2B] mb-6">
          Manage Users
        </h2>

        <div className="bg-[#FFF6E9] p-10 rounded-2xl shadow-md border border-[#EAD7BD] text-center text-[#8C2F2B]">
          No users found.
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 bg-[#FAF3E3] min-h-screen">
      <h2 className="text-3xl font-bold text-[#2B2B2B] mb-8">
        Manage Users
      </h2>

      <div className="bg-[#FFF6E9] rounded-2xl shadow-xl border border-[#EAD7BD] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#F3E6D3] border-b border-[#EAD7BD]">
            <tr>
              <th className="p-4 font-semibold text-[#8C2F2B]">Name</th>
              <th className="p-4 font-semibold text-[#8C2F2B]">Email</th>
              <th className="p-4 font-semibold text-[#8C2F2B]">
                Joined Date
              </th>
              <th className="p-4 font-semibold text-[#8C2F2B]">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EAD7BD]">
            {users.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-[#F7EDE1] transition"
              >
                {/* USER AVATAR + NAME */}
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FFE3C2] border border-[#EAD7BD] rounded-full flex items-center justify-center">
                    <User size={18} className="text-[#E66A32]" />
                  </div>
                  <span className="font-medium text-[#2B2B2B]">
                    {user.name}
                  </span>
                </td>

                {/* EMAIL */}
                <td className="p-4 text-[#8C2F2B]">{user.email}</td>

                {/* JOINED DATE */}
                <td className="p-4 text-[#8C2F2B] text-sm">
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
          <div className="p-8 text-center text-[#8C2F2B]">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
