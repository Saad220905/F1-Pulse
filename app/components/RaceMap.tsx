'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';


// Create red circle marker function
function createRedCircleMarker(size: number = 12, isSelected: boolean = false): L.DivIcon {
  const radius = isSelected ? size * 1.5 : size;
  const borderWidth = isSelected ? 4 : 3;
  return L.divIcon({
    className: 'custom-red-marker',
    html: `<div style="
      width: ${radius * 2}px;
      height: ${radius * 2}px;
      border-radius: 50%;
      background-color: #DC2626;
      border: ${borderWidth}px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      cursor: pointer;
      transition: all 0.2s ease;
    "></div>`,
    iconSize: [radius * 2, radius * 2],
    iconAnchor: [radius, radius],
  });
}

interface RaceInfo {
  raceId: number;
  label: string;
  name: string;
  circuit: string;
  location: string;
  country: string;
  round: number;
  date: string;
  year: number;
}

interface RaceMapProps {
  races: RaceInfo[];
  selectedRaceId: number | null;
  onRaceSelect: (raceId: number) => void;
}

// F1 Circuit coordinates mapping (approximate locations)
const CIRCUIT_COORDINATES: Record<string, [number, number]> = {
  'Bahrain': [26.0325, 50.5106],
  'Saudi Arabia': [21.6319, 39.1044],
  'Australia': [-37.8497, 144.9680],
  'China': [31.3389, 121.2200],
  'Japan': [34.8431, 136.5412],
  'Miami': [25.9581, -80.2389],
  'Italy': [44.3439, 11.7167],
  'Monaco': [43.7347, 7.4206],
  'Spain': [41.5700, 2.2611],
  'Canada': [45.5017, -73.5228],
  'Austria': [47.2197, 14.7647],
  'United Kingdom': [52.0786, -1.0169],
  'Hungary': [47.5789, 19.2486],
  'Belgium': [50.4372, 5.9714],
  'Netherlands': [52.3788, 4.5402],
  'Italy (Monza)': [45.6156, 9.2811],
  'Azerbaijan': [40.3725, 49.8533],
  'Singapore': [1.2914, 103.8640],
  'United States': [30.1327, -97.6351],
  'Mexico': [19.4042, -99.0907],
  'Brazil': [-23.7036, -46.6997],
  'Qatar': [25.4901, 51.4542],
  'Abu Dhabi': [24.4672, 54.6031],
};

// Fallback coordinates by country
const COUNTRY_COORDINATES: Record<string, [number, number]> = {
  'Bahrain': [26.0325, 50.5106],
  'Saudi Arabia': [21.6319, 39.1044],
  'Australia': [-37.8497, 144.9680],
  'China': [31.3389, 121.2200],
  'Japan': [34.8431, 136.5412],
  'United States': [39.8283, -98.5795],
  'Italy': [44.3439, 11.7167],
  'Monaco': [43.7347, 7.4206],
  'Spain': [41.5700, 2.2611],
  'Canada': [45.5017, -73.5228],
  'Austria': [47.2197, 14.7647],
  'United Kingdom': [52.0786, -1.0169],
  'Hungary': [47.5789, 19.2486],
  'Belgium': [50.4372, 5.9714],
  'Netherlands': [52.3788, 4.5402],
  'Azerbaijan': [40.3725, 49.8533],
  'Singapore': [1.2914, 103.8640],
  'Mexico': [19.4042, -99.0907],
  'Brazil': [-23.7036, -46.6997],
  'Qatar': [25.4901, 51.4542],
  'United Arab Emirates': [24.4672, 54.6031],
};

function getRaceCoordinates(race: RaceInfo): [number, number] {
  // Try circuit name first
  if (CIRCUIT_COORDINATES[race.circuit]) {
    return CIRCUIT_COORDINATES[race.circuit];
  }
  
  // Try location
  if (CIRCUIT_COORDINATES[race.location]) {
    return CIRCUIT_COORDINATES[race.location];
  }
  
  // Try country
  if (COUNTRY_COORDINATES[race.country]) {
    return COUNTRY_COORDINATES[race.country];
  }
  
  // Default fallback (center of world)
  return [20, 0];
}

function MapController({ selectedRaceId, races, onRaceSelect }: { selectedRaceId: number | null; races: RaceInfo[]; onRaceSelect: (raceId: number) => void }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedRaceId) {
      const race = races.find(r => r.raceId === selectedRaceId);
      if (race) {
        const [lat, lng] = getRaceCoordinates(race);
        map.setView([lat, lng], 6, { animate: true });
      }
    } else if (races.length > 0) {
      // Center on first race or average of all races
      const coords = races.map(r => getRaceCoordinates(r));
      const avgLat = coords.reduce((sum, [lat]) => sum + lat, 0) / coords.length;
      const avgLng = coords.reduce((sum, [, lng]) => sum + lng, 0) / coords.length;
      map.setView([avgLat, avgLng], 2, { animate: true });
    }
  }, [selectedRaceId, races, map]);
  
  return null;
}

export default function RaceMap({ races, selectedRaceId, onRaceSelect }: RaceMapProps) {
  if (typeof window === 'undefined') {
    return (
      <div className="w-full h-[500px] bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading map...</div>
      </div>
    );
  }


  // Calculate initial center
  const initialCoords = races.length > 0 
    ? getRaceCoordinates(races[0])
    : [20, 0] as [number, number];

  return (
    <div className="w-full h-[500px] rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <MapContainer
        center={initialCoords}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <MapController selectedRaceId={selectedRaceId} races={races} onRaceSelect={onRaceSelect} />
        {races.map((race) => {
          const [lat, lng] = getRaceCoordinates(race);
          const isSelected = race.raceId === selectedRaceId;
          
          return (
            <Marker
              key={race.raceId}
              position={[lat, lng]}
              icon={createRedCircleMarker(12, isSelected)}
              eventHandlers={{
                click: () => onRaceSelect(race.raceId),
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-gray-900 mb-1">{race.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{race.circuit}</p>
                  <p className="text-xs text-gray-500">{race.location}, {race.country}</p>
                  <p className="text-xs text-gray-500 mt-1">Round {race.round} • {new Date(race.date).toLocaleDateString()}</p>
                  <button
                    onClick={() => onRaceSelect(race.raceId)}
                    className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md transition-colors"
                  >
                    Select Race
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

