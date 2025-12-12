import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationMarker = ({ position, setPosition, isEditable }) => {
    const map = useMapEvents({
        click(e) {
            if (isEditable) {
                setPosition(e.latlng);
                map.flyTo(e.latlng, map.getZoom());
            }
        },
    });

    return position === null ? null : (
        <Marker position={position}>
            <Popup>Selected Location</Popup>
        </Marker>
    );
};

const MapComponent = ({ 
    locations = [], // Array of { lat, lng, title, description }
    center = [20.5937, 78.9629], // Default to India
    zoom = 5,
    isEditable = false,
    onLocationSelect,
    selectedLocation
}) => {
    return (
        <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-300 z-0">
            <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {isEditable && (
                    <LocationMarker 
                        position={selectedLocation} 
                        setPosition={onLocationSelect} 
                        isEditable={isEditable} 
                    />
                )}

                {!isEditable && locations.map((loc, idx) => (
                    <Marker key={idx} position={[loc.lat, loc.lng]}>
                        <Popup>
                            <div className="font-bold">{loc.title}</div>
                            <div>{loc.description}</div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
