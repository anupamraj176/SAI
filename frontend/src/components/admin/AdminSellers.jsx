import React, { useEffect, useState } from "react";
import { useAdminStore } from "../../store/adminStore";
import { Trash2, CheckCircle, XCircle, Store } from "lucide-react";
import LoadingSpinner from "../LoadingSpinner";

const PALETTE = {
  emerald: "#347B66",
  lime: "#CFF56E",
  base: "#E8F5E9",
  forest: "#3B4A38",
  evergreen: "#1F3326",
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
    if (filter === "verified") return seller.isSellerVerified;
    if (filter === "pending") return !seller.isSellerVerified;
    return true;
  });

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-10 bg-[#E8F5E9]">
        <div className="bg-red-100 text-red-700 p-4 rounded-xl border border-red-300 shadow">
          Error loading sellers: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 bg-[#E8F5E9] min-h-screen">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-[#1F3326]">Manage Sellers</h2>

        <div className="flex gap-2 bg-[#E8F5E9] p-1 rounded-xl border border-[#6FA99F] w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap
            ${
              filter === "all"
                ? "bg-[#C8E6C9] text-[#1F3326]"
                : "text-[#1F3326] hover:bg-[#C8E6C9]"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap
            ${
              filter === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "text-[#1F3326] hover:bg-[#C8E6C9]"
            }`}
          >
            Pending
          </button>

          <button
            onClick={() => setFilter("verified")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap
            ${
              filter === "verified"
                ? "bg-green-100 text-green-700"
                : "text-[#1F3326] hover:bg-[#C8E6C9]"
            }`}
          >
            Verified
          </button>
        </div>
      </div>

      {/* NO SELLERS */}
      {!filteredSellers || filteredSellers.length === 0 ? (
        <div className="bg-[#E8F5E9] p-10 rounded-2xl border border-[#6FA99F] shadow text-center text-[#1F3326]">
          No {filter !== "all" ? filter : ""} sellers found.
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block bg-[#E8F5E9] rounded-2xl shadow-xl border border-[#6FA99F] overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#C8E6C9] border-b border-[#6FA99F]">
                <tr>
                  <th className="p-4 font-semibold text-[#1F3326]">
                    Seller Name
                  </th>
                  <th className="p-4 font-semibold text-[#1F3326]">Email</th>
                  <th className="p-4 font-semibold text-[#1F3326]">Status</th>
                  <th className="p-4 font-semibold text-[#1F3326]">
                    Joined Date
                  </th>
                  <th className="p-4 font-semibold text-[#1F3326]">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#6FA99F]">
                {filteredSellers.map((seller) => (
                  <tr
                    key={seller._id}
                    className="hover:bg-[#C8E6C9] transition"
                  >
                    {/* SELLER NAME */}
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#C8E6C9] rounded-full flex items-center justify-center border border-[#6FA99F]">
                        <Store size={16} className="text-[#347B66]" />
                      </div>
                      <span className="font-medium text-[#1F3326]">
                        {seller.name}
                      </span>
                    </td>

                    {/* EMAIL */}
                    <td className="p-4 text-[#3B4A38]">{seller.email}</td>

                    {/* STATUS */}
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border 
                        ${
                          seller.isSellerVerified
                            ? "bg-green-100 text-green-700 border-green-300"
                            : "bg-yellow-100 text-yellow-700 border-yellow-300"
                        }`}
                      >
                        {seller.isSellerVerified ? "Verified" : "Pending"}
                      </span>
                    </td>

                    {/* JOINED DATE */}
                    <td className="p-4 text-[#3B4A38] text-sm">
                      {new Date(seller.createdAt).toLocaleDateString()}
                    </td>

                    {/* ACTION BUTTONS */}
                    <td className="p-4 flex gap-2">
                      {!seller.isSellerVerified ? (
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

          {/* MOBILE CARD VIEW */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {filteredSellers.map((seller) => (
              <div 
                key={seller._id}
                className="bg-[#E8F5E9] p-4 rounded-xl shadow-md border border-[#6FA99F] space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#C8E6C9] rounded-full flex items-center justify-center border border-[#6FA99F]">
                      <Store size={18} className="text-[#347B66]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1F3326]">{seller.name}</h3>
                      <p className="text-xs text-[#3B4A38]">{seller.email}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-bold border 
                    ${
                      seller.isSellerVerified
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "bg-yellow-100 text-yellow-700 border-yellow-300"
                    }`}
                  >
                    {seller.isSellerVerified ? "Verified" : "Pending"}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-[#6FA99F]/50">
                  <span className="text-xs text-[#3B4A38]">
                    Joined: {new Date(seller.createdAt).toLocaleDateString()}
                  </span>
                  
                  <div className="flex gap-2">
                    {!seller.isSellerVerified ? (
                      <button
                        onClick={() => verifySeller(seller._id, true)}
                        className="bg-green-100 text-green-700 p-2 rounded-lg border border-green-200"
                      >
                        <CheckCircle size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => verifySeller(seller._id, false)}
                        className="bg-yellow-100 text-yellow-700 p-2 rounded-lg border border-yellow-200"
                      >
                        <XCircle size={16} />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (window.confirm("Delete this seller?")) {
                          deleteSeller(seller._id);
                        }
                      }}
                      className="bg-red-100 text-red-700 p-2 rounded-lg border border-red-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminSellers;
