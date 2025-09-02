// File: src/app/missions/new/_components/geoman-controls.tsx (Final Corrected Version)

'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import '@geoman-io/leaflet-geoman-free';
import { useMissionStore } from './store';
import L, { Layer } from 'leaflet'; // Import L and Layer

// Define a type for layers that have the toGeoJSON method
interface GeoJSONLayer extends Layer {
  toGeoJSON: () => any;
}

export default function GeomanControls() {
  const map = useMap();
  const setFlightPath = useMissionStore((state) => state.setFlightPath);

  useEffect(() => {
    // Add Geoman controls to the map
    map.pm.addControls({
      position: 'topleft',
      drawCircle: false,
      drawMarker: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawText: false,
      cutPolygon: false,
      rotateMode: false,
    });

    // Set styling for drawn layers
    map.pm.setGlobalOptions({
      templineStyle: { color: 'blue', radius: 5 },
      hintlineStyle: { color: 'blue', dashArray: [5, 5] },
      pathOptions: { color: 'blue' },
    });

    // A helper function to handle layer data
    const handleLayerData = (layer: Layer) => {
      if ('toGeoJSON' in layer && typeof (layer as GeoJSONLayer).toGeoJSON === 'function') {
        const geoJsonLayer = layer as GeoJSONLayer;
        const geoJson = geoJsonLayer.toGeoJSON();
        setFlightPath(geoJson);
      }
    };

    map.on('pm:create', (e) => {
      // Remove the previous layer if one exists, allowing only one polygon
      map.eachLayer((layer) => {
        // FIX: Use `(layer as any).pm` to bypass the TypeScript error.
        // Geoman dynamically adds the `pm` property, which TypeScript doesn't know about.
        if ((layer as any).pm && !(layer instanceof L.TileLayer)) {
            layer.remove();
        }
      });
      handleLayerData(e.layer);
    });

    map.on('pm:edit', (e) => {
      handleLayerData(e.layer);
    });

    // Cleanup function
    return () => {
      if (map.pm) {
        map.pm.removeControls();
      }
    };
  }, [map, setFlightPath]);

  return null;
}