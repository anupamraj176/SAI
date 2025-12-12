import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { Trash2, CheckCircle, XCircle, Store, Filter } from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';

const AdminSellers = () => {
  const { sellers, fetchSellers, verifySeller, deleteSeller, isLoading, error } = useAdminStore();
  const [filter, setFilter] = useState('all'); // 'all', 'verified', 'pending'

  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  const filteredSellers = sellers?.filter(seller => {
    if (filter === 'verified') return seller.isVerified;
    if (filter === 'pending') return !seller.isVerified;
    return true;
  });

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          Error loading sellers: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Sellers</h2>
        
        <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-200">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'pending' ? 'bg-yellow-50 text-yellow-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilter('verified')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'verified' ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Verified
          </button>
        </div>
      </div>
      
      {!filteredSellers || filteredSellers.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center text-gray-500">
          No {filter !== 'all' ? filter : ''} sellers found.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Seller Name</th>
                <th className="p-4 font-semibold text-gray-600">Email</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Joined Date</th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSellers.map((seller) => (
                <tr key={seller._id} className="hover:bg-gray-50">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Store size={16} className="text-orange-500" />
                    </div>
                    <span className="font-medium text-gray-800">{seller.name}</span>
                  </td>
                  <td className="p-4 text-gray-600">{seller.email}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      seller.isVerified 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {seller.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">
                    {new Date(seller.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 flex gap-2">
                    {!seller.isVerified ? (
                      <button 
                        onClick={() => verifySeller(seller._id, true)}
                        className="text-green-600 hover:bg-green-50 p-2 rounded-lg"
                        title="Approve Seller"
                      >
                        <CheckCircle size={18} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => verifySeller(seller._id, false)}
                        className="text-yellow-600 hover:bg-yellow-50 p-2 rounded-lg"
                        title="Revoke Verification"
                      >
                        <XCircle size={18} />
                      </button>
                    )}
                    
                    <button 
                      onClick={() => {
                        if(window.confirm('Delete this seller and all their products?')) {
                          deleteSeller(seller._id);
                        }
                      }}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
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
