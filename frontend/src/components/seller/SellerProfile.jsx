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
            if (user.location?.coordinates?.length === 2) {
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
                location: location
                    ? { coordinates: [location.lng, location.lat], address }
                    : undefined,
            });

            alert("Profile updated successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to update profile");
        }
    };

    return (
        <div className="bg-[#FFF6E9] rounded-xl shadow-sm border border-[#FFD9A0] p-8">

            {/* Heading */}
            <h2 className="text-3xl font-bold text-[#8C2F2B] mb-6 flex items-center gap-2">
                <MapPin className="text-[#FF8C42]" /> Farm Profile
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-[#8C2F2B] mb-1">
                        Farm Name
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-[#EAD7BD] bg-[#FFF6E9]
                                   focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent outline-none"
                    />
                </div>

                {/* Address */}
                <div>
                    <label className="block text-sm font-medium text-[#8C2F2B] mb-1">
                        Farm Address
                    </label>

                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your farm address"
                        className="w-full px-4 py-2 rounded-lg border border-[#EAD7BD] bg-[#FFF6E9]
                                   focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent outline-none"
                    />
                </div>

                {/* Map */}
                <div>
                    <label className="block text-sm font-medium text-[#8C2F2B] mb-2">
                        Farm Location (Click on map to set)
                    </label>

                    <div className="rounded-lg overflow-hidden border border-[#FFD9A0] shadow-sm">
                        <MapComponent
                            isEditable={true}
                            onLocationSelect={handleLocationSelect}
                            selectedLocation={location}
                            center={
                                location
                                    ? [location.lat, location.lng]
                                    : [20.5937, 78.9629]
                            }
                        />
                    </div>

                    <p className="text-sm text-[#C24C30] mt-2">
                        {location
                            ? `Selected: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                            : "No location selected"}
                    </p>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-[#FF8C42] text-white px-6 py-2 rounded-lg 
                               hover:bg-[#E66A32] transition-colors disabled:opacity-50 shadow-md"
                >
                    <Save size={20} />
                    {isLoading ? "Saving..." : "Save Profile"}
                </button>
            </form>
        </div>
    );
};

export default SellerProfile;
