// File: src/app/missions/new/_components/mission-map.tsx

'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

import { MapContainer, TileLayer } from 'react-leaflet';
import GeomanControls from './geoman-controls';

export default function MissionMap() {
  return (
    <div className="h-[500px] w-full rounded-md overflow-hidden border">
      <MapContainer
        center={[23.0225, 72.5714]} // Centered on Ahmedabad
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeomanControls />
      </MapContainer>
    </div>
  );
}