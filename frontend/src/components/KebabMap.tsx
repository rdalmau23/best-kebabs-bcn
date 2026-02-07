'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Kebab } from '@/types';

interface KebabMapProps {
  kebabs: Kebab[];
  selectedKebab: Kebab | null;
  onSelectKebab: (kebab: Kebab) => void;
}

export default function KebabMap({ kebabs, selectedKebab, onSelectKebab }: KebabMapProps) {
  const t = useTranslations();
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    // Initialize map only on client side
    if (typeof window === 'undefined') return;

    // Barcelona center coordinates
    const barcelonaCenter: [number, number] = [41.3851, 2.1734];

    // Create map if not exists
    if (!mapRef.current) {
      mapRef.current = L.map('kebab-map').setView(barcelonaCenter, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Custom icons
    const defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const selectedIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // Add markers for each kebab
    kebabs.forEach((kebab) => {
      const isSelected = selectedKebab?._id === kebab._id;
      const icon = isSelected ? selectedIcon : defaultIcon;

      const marker = L.marker([kebab.lat, kebab.lng], { icon })
        .addTo(mapRef.current!)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-lg">${kebab.name}</h3>
            <p class="text-sm text-gray-600">${kebab.address}</p>
            <div class="mt-2 flex items-center">
              <span class="text-yellow-500">⭐</span>
              <span class="ml-1 font-semibold">${kebab.avgRating > 0 ? kebab.avgRating.toFixed(1) : '-'}</span>
              <span class="ml-1 text-gray-500 text-sm">(${kebab.ratingsCount})</span>
            </div>
          </div>
        `);

      marker.on('click', () => {
        onSelectKebab(kebab);
      });

      markersRef.current.push(marker);
    });

    // Center on selected kebab
    if (selectedKebab) {
      mapRef.current?.setView([selectedKebab.lat, selectedKebab.lng], 15);
    }

    return () => {
      // Cleanup on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [kebabs, selectedKebab, onSelectKebab]);

  return (
    <div className="relative w-full h-full">
      <div id="kebab-map" className="w-full h-full rounded-lg" />
    </div>
  );
}
