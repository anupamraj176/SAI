import { useState } from "react";
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

        // Allow prediction if either form data is filled OR location is selected
        if (!location && (!formData.soil || !formData.altitude || !formData.temperature || !formData.humidity || !formData.rainfall)) {
            alert("Please either select a location on the map or fill in the manual details.");
            return;
        }

        let query = "I need crop recommendations for a farm.";
        
        if (location) {
            query += `\n- Location Coordinates: Latitude ${location.lat}, Longitude ${location.lng}. (Please infer typical climate/soil for this region if specific data is missing).`;
        }

        if (formData.soil) query += `\n- Soil Type: ${formData.soil}`;
        if (formData.altitude) query += `\n- Altitude: ${formData.altitude} km`;
        if (formData.temperature) query += `\n- Average Temperature: ${formData.temperature}°C`;
        if (formData.humidity) query += `\n- Humidity: ${formData.humidity}%`;
        if (formData.rainfall) query += `\n- Rainfall: ${formData.rainfall} mm`;

        await askAI(query);
    };

    return (
        <div className="max-w-5xl mx-auto h-full flex flex-col">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#8C2F2B] flex items-center gap-3">
                    <Bot className="text-[#FF8C42]" size={32} />
                    CropSense AI Predictor
                </h1>
                <p className="text-[#C24C30] mt-2">
                    Enter your farm's environmental details to get AI-powered crop recommendations.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-[#FFD9A0] p-8">
                <form onSubmit={handlePredict} className="space-y-6">
                    
                    {/* Map Selection */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="text-sm font-bold text-[#8C2F2B] mb-2 flex items-center gap-2">
                            <MapPin size={16} /> Select Farm Location (Optional - AI will infer climate)
                        </label>
                        <MapComponent 
                            isEditable={true} 
                            onLocationSelect={handleLocationSelect}
                            selectedLocation={location}
                            center={location ? [location.lat, location.lng] : [20.5937, 78.9629]}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {location ? `Selected: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "Click on map to select location"}
                        </p>
                    </div>

                    {/* Soil Type */}
                    <div>
                        <label className="text-sm font-bold text-[#8C2F2B] mb-2 flex items-center gap-2">
                            <Layers size={16} /> Soil Type (Optional)
                        </label>
                        <select
                            value={formData.soil}
                            onChange={(e) => setFormData({ ...formData, soil: e.target.value })}
                            className="w-full px-4 py-3 bg-[#FDF6E9] border border-[#FFD9A0] rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF8C42] text-[#2B2B2B]"
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
                            <Mountain size={16} /> Altitude (km) (Optional)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={formData.altitude}
                            onChange={(e) => setFormData({ ...formData, altitude: e.target.value })}
                            placeholder="0 - 10"
                            className="w-full px-4 py-3 bg-[#FDF6E9] border border-[#FFD9A0] rounded-lg placeholder-[#8C2F2B]/40 focus:outline-none focus:ring-2 focus:ring-[#FF8C42] text-[#2B2B2B]"
                        />
                    </div>

                    {/* Temp, Humidity, Rainfall */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Temperature */}
                        <div>
                            <label className="text-sm font-bold text-[#8C2F2B] mb-2 flex items-center gap-2">
                                <Thermometer size={16} /> Temp (°C) (Optional)
                            </label>
                            <input
                                type="number"
                                value={formData.temperature}
                                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                                placeholder="-50 to 50"
                                className="w-full px-4 py-3 bg-[#FDF6E9] border border-[#FFD9A0] rounded-lg placeholder-[#8C2F2B]/40 focus:outline-none focus:ring-2 focus:ring-[#FF8C42] text-[#2B2B2B]"
                            />
                        </div>

                        {/* Humidity */}
                        <div>
                            <label className="text-sm font-bold text-[#8C2F2B] mb-2 flex items-center gap-2">
                                <Droplets size={16} /> Humidity (%) (Optional)
                            </label>
                            <input
                                type="number"
                                value={formData.humidity}
                                onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
                                placeholder="0 to 100"
                                className="w-full px-4 py-3 bg-[#FDF6E9] border border-[#FFD9A0] rounded-lg placeholder-[#8C2F2B]/40 focus:outline-none focus:ring-2 focus:ring-[#FF8C42] text-[#2B2B2B]"
                            />
                        </div>

                        {/* Rainfall */}
                        <div>
                            <label className="text-sm font-bold text-[#8C2F2B] mb-2 flex items-center gap-2">
                                <CloudRain size={16} /> Rainfall (mm) (Optional)
                            </label>
                            <input
                                type="number"
                                value={formData.rainfall}
                                onChange={(e) => setFormData({ ...formData, rainfall: e.target.value })}
                                placeholder="0 to 1000"
                                className="w-full px-4 py-3 bg-[#FDF6E9] border border-[#FFD9A0] rounded-lg placeholder-[#8C2F2B]/40 focus:outline-none focus:ring-2 focus:ring-[#FF8C42] text-[#2B2B2B]"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-[#C24C30] hover:bg-[#A03B23] text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    <Sprout size={20} /> Predict Crops
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Error Display */}
                {error && (
                    <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 text-red-700">
                        <AlertCircle size={20} className="mt-0.5" />
                        <p>{error}</p>
                    </div>
                )}

                {/* AI Output */}
                <div className="mt-5">
                    <label className="block text-sm font-bold text-[#8C2F2B] mb-2">
                        AI Prediction
                    </label>

                    <textarea
                        readOnly
                        value={
                            response
                                ? response
                                : "AI Prediction will appear here.\nNote: Consult a farming expert for accurate advice.\nPowered by Gemini AI."
                        }
                        className="w-full min-h-[200px] rounded-lg p-4 bg-[#FDF6E9] border border-[#FFD9A0] shadow-inner
                        text-[#2B2B2B] whitespace-pre-wrap resize-y focus:outline-none focus:ring-2 focus:ring-[#FF8C42]"
                    />
                </div>
            </div>
        </div>
    );
};

export default CropSenseAI;
