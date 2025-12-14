import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import MapComponent from '../MapComponent';
import { Save, MapPin, Upload, X, Camera, CheckCircle, Phone, Mail, FileText } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const SellerProfile = () => {
    const { user, updateProfile, isLoading } = useAuthStore();
    const [name, setName] = useState(user?.name || "");
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState("");
    const [image, setImage] = useState(user?.profileImage || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setImage(user.profileImage || "");
            setBio(user.bio || "");
            setPhoneNumber(user.phoneNumber || "");
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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("imageFile", file);

        setUploading(true);
        try {
            const res = await axios.post("/api/upload/image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setImage(res.data.imageUrl);
            toast.success("Image uploaded successfully");
        } catch (error) {
            console.error(error);
            toast.error("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile({
                name,
                profileImage: image,
                bio,
                phoneNumber,
                location: location
                    ? { coordinates: [location.lng, location.lat], address }
                    : undefined,
            });

            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile");
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-10">
            
            {/* HERO HEADER */}
            <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden shadow-lg mb-16">
                <div className="absolute inset-0 bg-gradient-to-r from-[#C24C30] to-[#FF8C42]"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex justify-between items-end">
                    <div className="text-white mb-2 md:mb-0 hidden md:block md:ml-44">
                        <h1 className="text-4xl font-bold shadow-black drop-shadow-md">{name || "Farm Name"}</h1>
                        <p className="text-white/90 text-base font-medium flex items-center gap-2">
                            {user?.isSellerVerified ? (
                                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 border border-white/30">
                                    <CheckCircle size={14} className="text-green-300" /> Verified Seller
                                </span>
                            ) : (
                                <span className="bg-yellow-500/40 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 border border-yellow-300/50 text-yellow-100">
                                    Verification Pending
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT CARD */}
            <div className="relative px-4 md:px-8 -mt-24">
                <div className="bg-[#FFF6E9] rounded-3xl shadow-xl border border-[#EAD7BD] overflow-visible">
                    
                    {/* PROFILE IMAGE (Floating) */}
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0">
                        <div className="relative group">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#FFF6E9] shadow-lg bg-[#FAF3E3]">
                                {image ? (
                                    <img src={image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#C24C30] bg-[#FFE3C2]">
                                        <Camera size={48} />
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-2 right-2 bg-[#E66A32] text-white p-2.5 rounded-full cursor-pointer hover:bg-[#C24C30] transition shadow-md border-2 border-[#FFF6E9]">
                                <Upload size={18} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                            </label>
                        </div>
                    </div>

                    <div className="pt-20 md:pt-28 pb-8 px-6 md:px-10">
                        {/* Mobile Name & Verification (Visible only on small screens) */}
                        <div className="md:hidden text-center mb-8">
                            <h1 className="text-2xl font-bold text-[#8C2F2B]">{name || "Farm Name"}</h1>
                            <div className="flex justify-center mt-2">
                                {user?.isSellerVerified ? (
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-1 border border-green-300 text-sm font-bold">
                                        <CheckCircle size={14} /> Verified Seller
                                    </span>
                                ) : (
                                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full flex items-center gap-1 border border-yellow-300 text-sm font-bold">
                                        Verification Pending
                                    </span>
                                )}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            
                            {/* SECTION: BASIC INFO */}
                            <div>
                                <h3 className="text-lg font-bold text-[#8C2F2B] mb-4 flex items-center gap-2 border-b border-[#EAD7BD] pb-2">
                                    <FileText size={20} /> Basic Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-bold text-[#8C2F2B] mb-2">
                                            Farm / Seller Name
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-[#EAD7BD] bg-[#FAF3E3]
                                                    focus:ring-2 focus:ring-[#E66A32] focus:border-transparent outline-none transition text-[#2B2B2B]"
                                        />
                                    </div>

                                    {/* Email (Read Only) */}
                                    <div>
                                        <label className="block text-sm font-bold text-[#8C2F2B] mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-3.5 text-[#C24C30]" size={18} />
                                            <input
                                                type="email"
                                                value={user?.email}
                                                readOnly
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#EAD7BD] bg-[#EAD7BD]/30
                                                        text-[#8C2F2B] cursor-not-allowed font-medium"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label className="block text-sm font-bold text-[#8C2F2B] mb-2">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-3.5 text-[#C24C30]" size={18} />
                                            <input
                                                type="tel"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                placeholder="+91 98765 43210"
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#EAD7BD] bg-[#FAF3E3]
                                                        focus:ring-2 focus:ring-[#E66A32] focus:border-transparent outline-none transition text-[#2B2B2B]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION: BIO */}
                            <div>
                                <label className="block text-sm font-bold text-[#8C2F2B] mb-2">
                                    Farm Description / Bio
                                </label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows="4"
                                    placeholder="Tell us about your farm, your methods, and what makes your produce special..."
                                    className="w-full px-4 py-3 rounded-xl border border-[#EAD7BD] bg-[#FAF3E3]
                                            focus:ring-2 focus:ring-[#E66A32] focus:border-transparent outline-none transition text-[#2B2B2B] resize-none"
                                />
                            </div>

                            {/* SECTION: LOCATION */}
                            <div>
                                <h3 className="text-lg font-bold text-[#8C2F2B] mb-4 flex items-center gap-2 border-b border-[#EAD7BD] pb-2">
                                    <MapPin size={20} /> Location Details
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-[#8C2F2B] mb-2">
                                            Full Address
                                        </label>
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="Street, City, State, Zip Code"
                                            className="w-full px-4 py-3 rounded-xl border border-[#EAD7BD] bg-[#FAF3E3]
                                                    focus:ring-2 focus:ring-[#E66A32] focus:border-transparent outline-none transition text-[#2B2B2B]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-[#8C2F2B] mb-2">
                                            Map Coordinates
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setIsMapOpen(true)}
                                            className={`w-full py-3 px-4 rounded-xl border border-dashed border-[#E66A32] 
                                                flex items-center justify-center gap-2 font-semibold transition
                                                ${location ? "bg-[#E66A32]/10 text-[#E66A32]" : "bg-[#FAF3E3] text-[#8C2F2B] hover:bg-[#E66A32]/5"}`}
                                        >
                                            {location ? (
                                                <>
                                                    <CheckCircle size={18} /> Location Set
                                                </>
                                            ) : (
                                                <>
                                                    <MapPin size={18} /> Set on Map
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* SUBMIT BUTTON */}
                            <div className="pt-6 border-t border-[#EAD7BD] flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isLoading || uploading}
                                    className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-[#C24C30] to-[#E66A32] text-white rounded-xl font-bold 
                                             hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                >
                                    {isLoading ? "Saving..." : <><Save size={20} /> Save Changes</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Map Modal */}
            {isMapOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-4 border-b flex justify-between items-center bg-[#F3E6D3]">
                            <h3 className="font-bold text-lg text-[#8C2F2B]">Select Farm Location</h3>
                            <button onClick={() => setIsMapOpen(false)} className="text-gray-500 hover:text-red-500">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 relative min-h-[400px]">
                            <MapComponent
                                isEditable={true}
                                onLocationSelect={handleLocationSelect}
                                selectedLocation={location}
                                center={
                                    location
                                        ? [location.lat, location.lng]
                                        : undefined
                                }
                            />
                        </div>
                        <div className="p-4 border-t bg-[#FAF3E3] flex justify-end">
                            <button 
                                onClick={() => setIsMapOpen(false)}
                                className="px-6 py-2 bg-[#E66A32] text-white rounded-lg font-bold hover:bg-[#C24C30] transition"
                            >
                                Confirm Location
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerProfile;
