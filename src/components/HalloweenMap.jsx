import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { getPumpkinMarkerHtml, getOrangeCircleMarkerHtml } from './PumpkinIcon';

const DOCTOR_MORA_COORDS = [21.1407, -100.3241];
const OSM_TILES_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const OSM_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';

export default function HalloweenMap({
  points = [],
  selectedPoint = null,
  onSelectPoint = () => {},
  isGenerator = false,
  pendingCoords = null,
  onMapClick = null,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const pendingMarkerRef = useRef(null);
  const markersMapRef = useRef(new Map());

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialCenter = selectedPoint 
      ? [selectedPoint.lat, selectedPoint.lng] 
      : DOCTOR_MORA_COORDS;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 16,
      minZoom: 13,
      maxZoom: 19,
      zoomControl: true,
      attributionControl: true,
    });

    // OpenStreetMap tile layer (dark mode styled via CSS filter)
    L.tileLayer(OSM_TILES_URL, {
      attribution: OSM_ATTR,
      maxZoom: 19,
    }).addTo(map);

    // Layer group for points
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    // Resize observer to ensure full rendering
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Map Click in Generator mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (isGenerator && onMapClick) {
      const handleMapClick = (e) => {
        const { lat, lng } = e.latlng;
        onMapClick({ lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) });
      };

      map.on('click', handleMapClick);
      return () => {
        map.off('click', handleMapClick);
      };
    }
  }, [isGenerator, onMapClick]);

  // Update Pending Marker in Generator Mode (Orange Circle)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (pendingMarkerRef.current) {
      pendingMarkerRef.current.remove();
      pendingMarkerRef.current = null;
    }

    if (isGenerator && pendingCoords) {
      const orangeCircleIcon = L.divIcon({
        className: 'custom-orange-circle-icon',
        html: getOrangeCircleMarkerHtml(),
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([pendingCoords.lat, pendingCoords.lng], {
        icon: orangeCircleIcon,
        zIndexOffset: 2000,
      }).addTo(map);

      pendingMarkerRef.current = marker;
      map.panTo([pendingCoords.lat, pendingCoords.lng], { animate: true, duration: 0.5 });
    }
  }, [isGenerator, pendingCoords]);

  // Keep latest onSelectPoint in a ref to avoid recreating markers on callback changes
  const onSelectPointRef = useRef(onSelectPoint);
  useEffect(() => {
    onSelectPointRef.current = onSelectPoint;
  }, [onSelectPoint]);

  // Render Halloween Points / Pumpkin Markers (Only re-runs when points list changes!)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    markersMapRef.current.clear();

    points.forEach((point) => {
      if (!point.lat || !point.lng) return;

      const isSelected = selectedPoint && selectedPoint.id === point.id;
      
      const pumpkinIcon = L.divIcon({
        className: 'custom-pumpkin-icon',
        html: getPumpkinMarkerHtml(isSelected),
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = L.marker([point.lat, point.lng], {
        icon: pumpkinIcon,
        zIndexOffset: isSelected ? 1000 : 0,
      });

      marker.on('click', () => {
        onSelectPointRef.current?.(point);
      });

      marker.addTo(layer);
      markersMapRef.current.set(point.id, marker);
    });
  }, [points]);

  // Fast active state toggle on markers (0 DOM destruction, instant 60 FPS update)
  useEffect(() => {
    markersMapRef.current.forEach((marker, id) => {
      const el = marker.getElement();
      if (!el) return;
      const markerDiv = el.querySelector('.pumpkin-marker');
      if (!markerDiv) return;

      if (selectedPoint && selectedPoint.id === id) {
        markerDiv.classList.add('is-active');
        marker.setZIndexOffset(1000);
      } else {
        markerDiv.classList.remove('is-active');
        marker.setZIndexOffset(0);
      }
    });
  }, [selectedPoint]);

  // Center/Fly to Selected Point (No popups)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedPoint || !selectedPoint.lat) return;

    map.flyTo([selectedPoint.lat, selectedPoint.lng], 17, {
      duration: 0.6,
      easeLinearity: 0.25,
    });
  }, [selectedPoint]);

  return (
    <div className="relative w-full h-full min-h-0 overflow-hidden bg-[#07080b]">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Floating Center Doctor Mora Button */}
      <button
        onClick={() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo(DOCTOR_MORA_COORDS, 16, { duration: 0.8 });
          }
        }}
        title="Centrar en Doctor Mora"
        className="absolute top-4 right-4 z-[400] bg-[#11141d]/90 hover:bg-[#1a202c] text-orange-400 border border-orange-500/30 hover:border-orange-500/70 p-2.5 rounded-xl shadow-lg backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-semibold"
      >
        <span>🎃</span>
        <span className="hidden sm:inline">Doctor Mora Centro</span>
      </button>

      {/* Generator Prompt Helper Banner on Map */}
      {isGenerator && (
        <div className="absolute top-4 left-14 z-[400] pointer-events-none bg-black/80 border border-orange-500/40 text-orange-200 px-3 py-1.5 rounded-lg text-xs backdrop-blur-md shadow-xl flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
          <span>Haz clic en el mapa para colocar el marcador naranja</span>
        </div>
      )}
    </div>
  );
}
