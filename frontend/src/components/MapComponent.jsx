import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon
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

    return position ? (
        <Marker position={position}>
            <Popup className="font-semibold text-[#1F3326]">Selected Location</Popup>
        </Marker>
    ) : null;
};

const MapComponent = ({
    locations = [], // { lat, lng, title, description }
    center = [20.5937, 78.9629],
    zoom = 5,
    isEditable = false,
    onLocationSelect,
    selectedLocation
}) => {
    return (
        <div
            className="
                h-[400px] w-full 
                rounded-xl 
                overflow-hidden 
                shadow-md 
                border border-[#6FA99F] 
                bg-[#E8F5E9]
            "
        >
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {isEditable && (
                    <LocationMarker
                        position={selectedLocation}
                        setPosition={onLocationSelect}
                        isEditable={isEditable}
                    />
                )}

                {!isEditable &&
                    locations.map((loc, idx) => (
                        <Marker key={idx} position={[loc.lat, loc.lng]}>
                            <Popup>
                                <div className="font-bold text-[#1F3326]">{loc.title}</div>
                                <div className="text-sm text-[#347B66]">{loc.description}</div>
                            </Popup>
                        </Marker>
                    ))}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
