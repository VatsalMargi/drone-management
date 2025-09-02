'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Custom drone icon
const droneIcon = new L.Icon({
    iconUrl: 'https://img.icons8.com/ios-filled/50/000000/drone.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LiveMissionMap({ flightPath, currentPosition }: { flightPath: any; currentPosition: any }) {
  const waypoints = flightPath?.geometry?.coordinates[0].map((coord: number[]) => [coord[1], coord[0]]) || [];

  return (
    <div className="h-[500px] w-full rounded-md overflow-hidden border">
      <MapContainer
        center={waypoints[0] || [23.0225, 72.5714]}
        zoom={16}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline positions={waypoints} color="blue" />
        {currentPosition && <Marker position={[currentPosition.lat, currentPosition.lon]} icon={droneIcon} />}
      </MapContainer>
    </div>
  );
}