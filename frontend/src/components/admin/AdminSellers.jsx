import React, { useEffect, useState } from "react";
import { useAdminStore } from "../../store/adminStore";
import { Trash2, CheckCircle, XCircle, Store } from "lucide-react";
import LoadingSpinner from "../LoadingSpinner";

const PALETTE = {
  paprika: "#E66A32",
  nougat: "#FFF6E9",
  beige: "#FAF3E3",
  rust: "#C24C30",
  maroon: "#8C2F2B",
};

const AdminSellers = () => {
  const {
    sellers,
    fetchSellers,
    verifySeller,
    deleteSeller,
    isLoading,
    error,
  } = useAdminStore();

  const [filter, setFilter] = useState("all"); // all, verified, pending

  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  const filteredSellers = sellers?.filter((seller) => {
    if (filter === "verified") return seller.isVerified;
    if (filter === "pending") return !seller.isVerified;
    return true;
  });

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-10 bg-[#FAF3E3]">
        <div className="bg-red-100 text-red-700 p-4 rounded-xl border border-red-300 shadow">
          Error loading sellers: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 bg-[#FAF3E3] min-h-screen">
      {/* HEADER & FILTERS */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-[#2B2B2B]">Manage Sellers</h2>

        <div className="flex gap-2 bg-[#FFF6E9] p-1 rounded-xl border border-[#EAD7BD]">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition 
            ${
              filter === "all"
                ? "bg-[#F3E6D3] text-[#8C2F2B]"
                : "text-[#8C2F2B] hover:bg-[#F7EDE1]"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition 
            ${
              filter === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "text-[#8C2F2B] hover:bg-[#F7EDE1]"
            }`}
          >
            Pending
          </button>

          <button
            onClick={() => setFilter("verified")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition 
            ${
              filter === "verified"
                ? "bg-green-100 text-green-700"
                : "text-[#8C2F2B] hover:bg-[#F7EDE1]"
            }`}
          >
            Verified
          </button>
        </div>
      </div>

      {/* NO SELLERS */}
      {!filteredSellers || filteredSellers.length === 0 ? (
        <div className="bg-[#FFF6E9] p-10 rounded-2xl border border-[#EAD7BD] shadow text-center text-[#8C2F2B]">
          No {filter !== "all" ? filter : ""} sellers found.
        </div>
      ) : (
        <div className="bg-[#FFF6E9] rounded-2xl shadow-xl border border-[#EAD7BD] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#F3E6D3] border-b border-[#EAD7BD]">
              <tr>
                <th className="p-4 font-semibold text-[#8C2F2B]">
                  Seller Name
                </th>
                <th className="p-4 font-semibold text-[#8C2F2B]">Email</th>
                <th className="p-4 font-semibold text-[#8C2F2B]">Status</th>
                <th className="p-4 font-semibold text-[#8C2F2B]">
                  Joined Date
                </th>
                <th className="p-4 font-semibold text-[#8C2F2B]">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EAD7BD]">
              {filteredSellers.map((seller) => (
                <tr
                  key={seller._id}
                  className="hover:bg-[#F7EDE1] transition"
                >
                  {/* SELLER NAME */}
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#FFE3C2] rounded-full flex items-center justify-center border border-[#EAD7BD]">
                      <Store size={16} className="text-[#E66A32]" />
                    </div>
                    <span className="font-medium text-[#2B2B2B]">
                      {seller.name}
                    </span>
                  </td>

                  {/* EMAIL */}
                  <td className="p-4 text-[#8C2F2B]">{seller.email}</td>

                  {/* STATUS */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border 
                      ${
                        seller.isVerified
                          ? "bg-green-100 text-green-700 border-green-300"
                          : "bg-yellow-100 text-yellow-700 border-yellow-300"
                      }`}
                    >
                      {seller.isVerified ? "Verified" : "Pending"}
                    </span>
                  </td>

                  {/* JOINED DATE */}
                  <td className="p-4 text-[#8C2F2B] text-sm">
                    {new Date(seller.createdAt).toLocaleDateString()}
                  </td>

                  {/* ACTION BUTTONS */}
                  <td className="p-4 flex gap-2">
                    {!seller.isVerified ? (
                      <button
                        onClick={() => verifySeller(seller._id, true)}
                        className="text-green-600 hover:bg-green-100 p-2 rounded-lg transition"
                        title="Approve Seller"
                      >
                        <CheckCircle size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() => verifySeller(seller._id, false)}
                        className="text-yellow-600 hover:bg-yellow-100 p-2 rounded-lg transition"
                        title="Revoke Verification"
                      >
                        <XCircle size={18} />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Delete this seller and all their products?"
                          )
                        ) {
                          deleteSeller(seller._id);
                        }
                      }}
                      className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition"
                      title="Delete Seller"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminSellers;
