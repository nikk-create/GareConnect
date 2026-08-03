import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import StatusBadge from '@/components/gare/StatusBadge';
import RouteOptimizer, { computeETA } from '@/components/gare/RouteOptimizer';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const createVehicleIcon = (statut) => {
  const colors = {
    en_route: '#00e5b0',
    embarquement: '#ffc107',
    retard: '#ff7043',
    sans_nouvelles: '#ff4444',
    planifie: '#40c4ff',
    arrive: '#00e5b0',
  };
  const color = colors[statut] || '#40c4ff';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="16" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="2"/>
      <circle cx="18" cy="18" r="8" fill="${color}"/>
      <circle cx="18" cy="18" r="16" fill="none" stroke="${color}" stroke-width="1" opacity="0.5">
        <animate attributeName="r" from="8" to="18" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite"/>
      </circle>
    </svg>`;
  return L.divIcon({ html: svg, className: '', iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -20] });
};

const createStationIcon = () => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <rect x="2" y="2" width="28" height="28" rx="8" fill="#0a1932" stroke="#00e5b0" stroke-width="2"/>
      <rect x="8" y="14" width="16" height="10" rx="2" fill="#00e5b0" fill-opacity="0.8"/>
      <rect x="10" y="10" width="12" height="6" rx="1" fill="#00e5b0" fill-opacity="0.5"/>
      <circle cx="11" cy="26" r="2" fill="#0a1932"/>
      <circle cx="21" cy="26" r="2" fill="#0a1932"/>
    </svg>`;
  return L.divIcon({ html: svg, className: '', iconSize: [32, 32], iconAnchor: [16, 16], popupAnchor: [0, -18] });
};

const STATIONS = [
  { id: 'cotonou', name: 'Gare Dantokpa – Cotonou', coords: [6.3654, 2.4183] },
  { id: 'parakou', name: 'Gare Parakou', coords: [9.3370, 2.6277] },
  { id: 'porto-novo', name: 'Gare Porto-Novo', coords: [6.4967, 2.6288] },
  { id: 'abomey', name: 'Gare Abomey', coords: [7.1851, 1.9894] },
  { id: 'natitingou', name: 'Gare Natitingou', coords: [10.3048, 1.3800] },
  { id: 'lokossa', name: 'Gare Lokossa', coords: [6.6354, 1.7173] },
  { id: 'djougou', name: 'Gare Djougou', coords: [9.7081, 1.6663] },
  { id: 'bohicon', name: 'Gare Bohicon', coords: [7.1872, 2.0666] },
];

function interpolatePosition(origin, destination, pct) {
  const o = origin?.coords || STATIONS[0].coords;
  const d = destination?.coords;
  if (!d) return o;
  const t = pct / 100;
  return [o[0] + (d[0] - o[0]) * t, o[1] + (d[1] - o[1]) * t];
}

function FitBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 1) map.fitBounds(bounds, { padding: [40, 40] });
  }, []);
  return null;
}

const statusColor = {
  en_route: '#00e5b0',
  embarquement: '#ffc107',
  retard: '#ff7043',
  sans_nouvelles: '#ff4444',
  planifie: '#40c4ff',
  arrive: '#888',
};

export default function Carte() {
  const [selectedVoyage, setSelectedVoyage] = useState(null);

  const { data: voyages = [] } = useQuery({
    queryKey: ['voyages'],
    queryFn: () => base44.entities.Voyage.list('-created_date', 50),
    refetchInterval: 15000,
  });

  const { data: incidents = [] } = useQuery({
    queryKey: ['incidents'],
    queryFn: () => base44.entities.Incident.list('-created_date', 100),
  });

  function formatETA(minutes) {
    if (minutes <= 0) return 'Arrivée imminente';
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }

  const activeVoyages = voyages.filter(v => v.statut !== 'arrive');
  const stationIcon = createStationIcon();
  const allBounds = [...STATIONS.map(s => s.coords)];

  const getStation = (name) => STATIONS.find(s =>
    s.id === name?.toLowerCase() || s.name.toLowerCase().includes(name?.toLowerCase() || '')
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold font-outfit">Carte en direct</h2>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-bold text-primary">{activeVoyages.length} actifs</span>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
        {Object.entries(statusColor).filter(([k]) => k !== 'arrive').map(([key, color]) => (
          <div key={key} className="flex-shrink-0 flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[10px] text-muted-foreground font-medium capitalize">
              {key === 'en_route' ? 'En route' : key === 'embarquement' ? 'Attente' : key === 'retard' ? 'Retard' : key === 'sans_nouvelles' ? 'Alerte' : 'Planifié'}
            </span>
          </div>
        ))}
        <div className="flex-shrink-0 flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-primary/60" />
          <span className="text-[10px] text-muted-foreground font-medium">Gare</span>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden border border-border/50 shadow-xl" style={{ height: '58vh' }}>
        <MapContainer center={[7.5, 2.2]} zoom={7} style={{ height: '100%', width: '100%', background: '#0a1932' }} zoomControl={false}>
          <TileLayer attribution='&copy; <a href="https://carto.com/">CARTO</a>' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          <FitBounds bounds={allBounds} />

          {STATIONS.map(station => (
            <Marker key={station.id} position={station.coords} icon={stationIcon}>
              <Popup className="dark-popup">
                <div style={{ background: '#0d1f3c', color: '#e8fffc', padding: '8px', borderRadius: '10px', minWidth: '140px' }}>
                  <p style={{ fontWeight: 800, fontSize: '12px', color: '#00e5b0' }}>🚉 {station.name}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {activeVoyages.map(voyage => {
            const originStation = getStation(voyage.origine || 'Cotonou');
            const destStation = getStation(voyage.destination);
            const vehiclePos = interpolatePosition(originStation, destStation, voyage.progression || 0);
            const vehicleIcon = createVehicleIcon(voyage.statut);
            const lineColor = statusColor[voyage.statut] || '#40c4ff';

            return (
              <React.Fragment key={voyage.id}>
                {originStation && destStation && (
                  <Polyline positions={[originStation.coords, destStation.coords]} pathOptions={{ color: lineColor, weight: 2, opacity: 0.25, dashArray: '6, 8' }} />
                )}
                {originStation && destStation && voyage.progression > 0 && (
                  <Polyline positions={[originStation.coords, vehiclePos]} pathOptions={{ color: lineColor, weight: 3, opacity: 0.7 }} />
                )}
                <Marker position={vehiclePos} icon={vehicleIcon} eventHandlers={{ click: () => setSelectedVoyage(voyage.id === selectedVoyage ? null : voyage.id) }}>
                  <Popup>
                    <div style={{ background: '#0d1f3c', color: '#e8fffc', padding: '10px', borderRadius: '12px', minWidth: '180px', border: `1px solid ${lineColor}40` }}>
                      <p style={{ fontWeight: 800, fontSize: '13px', color: lineColor, marginBottom: '6px' }}>
                        🚌 {voyage.origine || 'Cotonou'} → {voyage.destination}
                      </p>
                      <p style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>
                        {voyage.code_voyage} · {voyage.heure_depart}
                      </p>
                      <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>👨‍✈️ {voyage.chauffeur}</p>
                      <p style={{ fontSize: '11px', color: '#94a3b8' }}>🛣️ Progression : {voyage.progression || 0}%</p>
                      <p style={{ fontSize: '11px', color: '#94a3b8' }}>👥 {voyage.places_occupees || 0}/{voyage.places_total} passagers</p>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>

      <div>
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Véhicules actifs</h3>
        <div className="space-y-2">
          {activeVoyages.map(voyage => {
            const color = statusColor[voyage.statut] || '#40c4ff';
            const etaMin = computeETA(voyage);
            const hasIncident = incidents.some(i => i.voyage_id === voyage.id && i.statut_resolution !== 'resolu');
            return (
              <div key={voyage.id} className="flex items-center gap-3 p-3 rounded-xl bg-card/60 border border-border/50 cursor-pointer hover:border-primary/30 transition-colors active:scale-[0.99]">
                <div className="w-3 h-3 rounded-full flex-shrink-0 animate-pulse" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold truncate">{voyage.origine || 'Cotonou'} → {voyage.destination}</p>
                    {hasIncident && <span className="text-[9px] font-bold text-destructive bg-destructive/10 px-1 py-0.5 rounded flex-shrink-0">Incident</span>}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono">{voyage.chauffeur} · {voyage.code_voyage}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <div className="w-12 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${voyage.progression || 0}%`, backgroundColor: color }} />
                    </div>
                    <span className="text-[10px] font-mono font-bold" style={{ color }}>{voyage.progression || 0}%</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">ETA : {formatETA(etaMin)}</span>
                </div>
              </div>
            );
          })}
          {activeVoyages.length === 0 && <p className="text-center text-muted-foreground text-sm py-6">Aucun véhicule en circulation</p>}
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card/60 p-4">
        <RouteOptimizer voyages={voyages} incidents={incidents} />
      </div>
    </div>
  );
}
