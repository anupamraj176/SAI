import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import MapComponent from '../MapComponent';
import { Save, MapPin } from 'lucide-react';

const SellerProfile = () => {
    const { user, updateProfile, isLoading } = useAuthStore();
    const [name, setName] = useState(user?.name || "");
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState("");

    useEffect(() => {
        if (user) {
            setName(user.name);
            if (user.location && user.location.coordinates && user.location.coordinates.length === 2) {
                // Check if coordinates are not [0,0] or handle it gracefully
                const [lng, lat] = user.location.coordinates;
                if (lat !== 0 || lng !== 0) {
                    setLocation({ lat, lng });
                }
                setAddress(user.location.address || "");
            }
        }
    }, [user]);

    const handleLocationSelect = (latlng) => {
        setLocation(latlng);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile({
                name,
                location: location ? {
                    coordinates: [location.lng, location.lat],
                    address
                } : undefined
            });
            alert("Profile updated successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to update profile");
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-[#FFD9A0] p-6">
            <h2 className="text-2xl font-bold text-[#2B2B2B] mb-6 flex items-center gap-2">
                <MapPin className="text-[#FF8C42]" /> Farm Profile
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Farm Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Farm Address</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                        placeholder="Enter your farm address"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Farm Location (Click on map to set)</label>
                    <MapComponent 
                        isEditable={true} 
                        onLocationSelect={handleLocationSelect}
                        selectedLocation={location}
                        center={location ? [location.lat, location.lng] : [20.5937, 78.9629]}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                        {location ? `Selected: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "No location selected"}
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-[#FF8C42] text-white px-6 py-2 rounded-lg hover:bg-[#e67e3a] transition-colors disabled:opacity-50"
                >
                    <Save size={20} />
                    {isLoading ? "Saving..." : "Save Profile"}
                </button>
            </form>
        </div>
    );
};

export default SellerProfile;
