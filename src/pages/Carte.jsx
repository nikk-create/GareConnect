import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { AppLayout } from '@/components/gare/AppLayout';
import { Header } from '@/components/gare/Header';
import { Voyage } from '@/api/entities';

// Cotonou comme centre par défaut
const CENTER = [6.3703, 2.3912];

export default function Carte() {
  const [voyages, setVoyages] = useState([]);

  useEffect(() => {
    (async () => {
      const v = await Voyage.filter({});
      setVoyages(v.filter((x) => x.statut === 'en_route' || x.statut === 'retard'));
    })();
  }, []);

  return (
    <AppLayout>
      <Header title="Carte des voyages" subtitle={`${voyages.length} véhicule(s) en route`} />
      <div className="px-5 -mt-4 pt-2">
        <div className="rounded-2xl overflow-hidden border border-encre/10" style={{ height: '65vh' }}>
          <MapContainer center={CENTER} zoom={7} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {voyages.map((v) => (
              <Marker key={v.id} position={CENTER}>
                <Popup>
                  <strong>{v.destination}</strong><br />
                  {v.chauffeur} · {v.statut}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        <p className="text-xs text-encre/40 mt-3 text-center">
          Positions approximatives — la géolocalisation temps réel nécessite le partage GPS du chauffeur.
        </p>
      </div>
    </AppLayout>
  );
}
