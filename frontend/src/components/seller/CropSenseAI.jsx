import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Bot,
    Sparkles,
    Sprout,
    AlertCircle,
    Thermometer,
    Droplets,
    CloudRain,
    Mountain,
    Layers,
    MapPin
} from "lucide-react";
import { useAiStore } from "../../store/aiStore";
import MapComponent from "../MapComponent";

const CropSenseAI = () => {
    const { askAI, response, isLoading, error } = useAiStore();

    const [formData, setFormData] = useState({
        soil: "",
        altitude: "",
        temperature: "",
        humidity: "",
        rainfall: ""
    });
    
    const [location, setLocation] = useState(null);

    const soilTypes = [
        "Alluvial Soil",
        "Black Soil",
        "Red Soil",
        "Laterite Soil",
        "Desert Soil",
        "Mountain Soil",
        "Saline Soil",
        "Peaty Soil",
        "Loamy Soil"
    ];

    const handleLocationSelect = (latlng) => {
        setLocation(latlng);
    };

    const handlePredict = async (e) => {
        e.preventDefault();

        if (!location && (!formData.soil || !formData.altitude || !formData.temperature || !formData.humidity || !formData.rainfall)) {
            alert("Please either select a location on the map or fill in the manual details.");
            return;
        }

        let query = "I need crop recommendations for a farm.";

        if (location) {
            query += `\n- Location Coordinates: Latitude ${location.lat}, Longitude ${location.lng}.`;
        }

        if (formData.soil) query += `\n- Soil Type: ${formData.soil}`;
        if (formData.altitude) query += `\n- Altitude: ${formData.altitude} km`;
        if (formData.temperature) query += `\n- Temperature: ${formData.temperature}°C`;
        if (formData.humidity) query += `\n- Humidity: ${formData.humidity}%`;
        if (formData.rainfall) query += `\n- Rainfall: ${formData.rainfall} mm`;

        await askAI(query);
    };

    return (
        <div className="max-w-5xl mx-auto h-full flex flex-col">
            
            {/* Heading */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#8C2F2B] flex items-center gap-3">
                    <Bot className="text-[#FF8C42]" size={32} />
                    CropSense AI Predictor
                </h1>
                <p className="text-[#C24C30] mt-2">
                    Enter your farm's environmental details to get AI-powered crop recommendations.
                </p>
            </div>

            {/* MAIN CARD */}
            <div className="bg-[#FFF6E9] rounded-2xl shadow-lg border border-[#EAD7BD] p-4 md:p-8">
                <form onSubmit={handlePredict} className="space-y-6">
                    
                    {/* Map Selection */}
                    <div>
                        <label className="text-sm font-bold text-[#8C2F2B] mb-2 flex items-center gap-2">
                            <MapPin size={16} /> Select Farm Location (optional)
                        </label>

                        <MapComponent 
                            isEditable={true} 
                            onLocationSelect={handleLocationSelect}
                            selectedLocation={location}
                            center={location ? [location.lat, location.lng] : [20.5937, 78.9629]}
                        />

                        <p className="text-xs text-[#8C2F2B]/60 mt-1">
                            {location
                                ? `Selected: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                                : "Click on map to select location"}
                        </p>
                    </div>

                    {/* Soil Type */}
                    <div>
                        <label className="text-sm font-bold text-[#8C2F2B] mb-2 flex items-center gap-2">
                            <Layers size={16} /> Soil Type (optional)
                        </label>

                        <select
                            value={formData.soil}
                            onChange={(e) => setFormData({ ...formData, soil: e.target.value })}
                            className="w-full px-4 py-3 bg-[#FDF6E9] border border-[#EAD7BD] rounded-lg focus:ring-2 focus:ring-[#FF8C42]"
                        >
                            <option value="">Select Soil</option>
                            {soilTypes.map((soil) => (
                                <option key={soil} value={soil}>{soil}</option>
                            ))}
                        </select>
                    </div>

                    {/* Altitude */}
                    <div>
                        <label className="text-sm font-bold text-[#8C2F2B] mb-2 flex items-center gap-2">
                            <Mountain size={16} /> Altitude (km)
                        </label>

                        <input
                            type="number"
                            step="0.1"
                            value={formData.altitude}
                            onChange={(e) => setFormData({ ...formData, altitude: e.target.value })}
                            className="w-full px-4 py-3 bg-[#FDF6E9] border border-[#EAD7BD] rounded-lg focus:ring-2 focus:ring-[#FF8C42]"
                        />
                    </div>

                    {/* Temperature, Humidity, Rainfall */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        <div>
                            <label className="text-sm font-bold text-[#8C2F2B] mb-2 flex items-center gap-2">
                                <Thermometer size={16} /> Temperature (°C)
                            </label>
                            <input
                                type="number"
                                value={formData.temperature}
                                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                                className="w-full px-4 py-3 bg-[#FDF6E9] border border-[#EAD7BD] rounded-lg focus:ring-2 focus:ring-[#FF8C42]"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold text-[#8C2F2B] mb-2 flex items-center gap-2">
                                <Droplets size={16} /> Humidity (%)
                            </label>
                            <input
                                type="number"
                                value={formData.humidity}
                                onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
                                className="w-full px-4 py-3 bg-[#FDF6E9] border border-[#EAD7BD] rounded-lg focus:ring-2 focus:ring-[#FF8C42]"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold text-[#8C2F2B] mb-2 flex items-center gap-2">
                                <CloudRain size={16} /> Rainfall (mm)
                            </label>
                            <input
                                type="number"
                                value={formData.rainfall}
                                onChange={(e) => setFormData({ ...formData, rainfall: e.target.value })}
                                className="w-full px-4 py-3 bg-[#FDF6E9] border border-[#EAD7BD] rounded-lg focus:ring-2 focus:ring-[#FF8C42]"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-[#C24C30] hover:bg-[#A03B23] text-white px-8 py-3 rounded-lg font-bold shadow-md flex items-center gap-2 transition disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Sparkles size={20} />
                                    </motion.div>
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Sprout size={20} />
                                    Predict Crops
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Error Display */}
                {error && (
                    <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2">
                        <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-red-800 text-sm">AI Service Error</h4>
                            <p className="text-sm text-red-700 mt-1">
                                {error.includes("429") || error.includes("Quota") 
                                    ? "The AI service is currently busy or has reached its daily limit. Please try again later."
                                    : "Something went wrong while fetching the prediction."}
                            </p>
                            <p className="text-xs text-red-600/80 mt-2 font-mono bg-red-100/50 p-2 rounded">
                                Error Details: {error}
                            </p>
                        </div>
                    </div>
                )}

                {/* AI Output */}
                <div className="mt-6">
                    <label className="text-sm font-bold text-[#8C2F2B] mb-2 block">
                        AI Prediction
                    </label>

                    <textarea
                        readOnly
                        value={
                            response ||
                            "AI Prediction will appear here.\nNote: Consult a farming expert for accurate advice.\nPowered by Gemini AI."
                        }
                        className="w-full min-h-[200px] rounded-lg p-4 bg-[#FDF6E9] border border-[#EAD7BD] shadow-inner focus:ring-2 focus:ring-[#FF8C42]"
                    />
                </div>
            </div>
        </div>
    );
};

export default CropSenseAI;
