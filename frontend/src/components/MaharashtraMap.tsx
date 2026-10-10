import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MAHARASHTRA_DAMS, MaharashtraDam } from '../data/dams';
import {
  MAHARASHTRA_BOUNDARY_COORDS,
  MAHARASHTRA_CITIES,
  MAHARASHTRA_RIVERS,
} from '../data/maharashtraGeo';
import { useTranslation } from '../context/LanguageContext';

interface MaharashtraMapProps {
  selectedDam?: MaharashtraDam | null;
  onSelectDam?: (dam: MaharashtraDam) => void;
  floodPolygon?: Array<[number, number]>;
  simulationActive?: boolean;
  activeTimestepHours?: number;
  highlightSettlements?: Array<{
    name: string;
    distanceKm?: number;
    depthM?: number;
    arrivalTimeHours?: number;
    latitude: number;
    longitude: number;
  }>;
  showLayers?: {
    floodExtent?: boolean;
    settlements?: boolean;
    roads?: boolean;
    buildings?: boolean;
    agriculture?: boolean;
  };
  height?: string;
  zoomLevel?: number;
  center?: [number, number];
}

export const MaharashtraMap: React.FC<MaharashtraMapProps> = ({
  selectedDam,
  onSelectDam,
  floodPolygon,
  simulationActive = false,
  highlightSettlements,
  showLayers = { floodExtent: true, settlements: true, roads: true },
  height = '100%',
  zoomLevel,
  center,
}) => {
  const { t } = useTranslation();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const geoLayerRef = useRef<L.LayerGroup | null>(null);
  const floodLayerRef = useRef<L.Polygon | null>(null);
  const settlementsLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeTab, setActiveTab] = useState<'Map' | 'Satellite' | 'Terrain'>('Map');

  // Authoritative Tile layer URLs
  const tileUrls: Record<'Map' | 'Satellite' | 'Terrain', string> = {
    Map: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    Satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    Terrain: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
  };

  const attributions: Record<'Map' | 'Satellite' | 'Terrain', string> = {
    Map: '© OpenStreetMap contributors',
    Satellite: '© Esri, Maxar, Earthstar Geographics',
    Terrain: '© Esri Topo Map',
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialCenter = center || (selectedDam ? [selectedDam.latitude, selectedDam.longitude] : [18.75, 73.68]);
    const initialZoom = zoomLevel || (selectedDam ? 10 : 9);

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: false,
    });

    // Initial tile layer (Map view)
    const tile = L.tileLayer(tileUrls.Map, {
      maxZoom: 18,
      attribution: attributions.Map,
    }).addTo(map);

    tileLayerRef.current = tile;

    // Zoom control at bottom left
    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    // Scale control (metric km) at bottom left
    L.control.scale({ position: 'bottomleft', imperial: false, metric: true }).addTo(map);

    // Layer Groups
    const geoGroup = L.layerGroup().addTo(map);
    geoLayerRef.current = geoGroup;

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    const settlementsGroup = L.layerGroup().addTo(map);
    settlementsLayerRef.current = settlementsGroup;

    // Draw Maharashtra Boundary with subtle line
    L.polygon(MAHARASHTRA_BOUNDARY_COORDS, {
      color: '#0284c7',
      weight: 1.8,
      dashArray: '5, 5',
      fillColor: '#0284c7',
      fillOpacity: 0.02,
      interactive: false,
    }).addTo(geoGroup);

    // Draw Major Rivers
    MAHARASHTRA_RIVERS.forEach((river) => {
      L.polyline(river.coords, {
        color: '#0284c7',
        weight: 1.8,
        opacity: 0.55,
        interactive: false,
      }).addTo(geoGroup);
    });

    // Draw Major Cities
    MAHARASHTRA_CITIES.forEach((city) => {
      const cityIcon = L.divIcon({
        className: 'city-label-marker',
        html: `
          <div style="
            display: flex;
            align-items: center;
            gap: 3px;
            font-size: 10px;
            font-weight: 600;
            color: #334155;
            text-shadow: 1px 1px 2px #ffffff, -1px -1px 2px #ffffff;
            white-space: nowrap;
            pointer-events: none;
          ">
            <span style="
              width: ${city.type === 'capital' ? '5px' : '4px'};
              height: ${city.type === 'capital' ? '5px' : '4px'};
              background: #0f172a;
              border: 1px solid #ffffff;
              border-radius: 50%;
              display: inline-block;
            "></span>
            ${city.name}
          </div>
        `,
        iconSize: [0, 0],
      });
      L.marker([city.latitude, city.longitude], { icon: cityIcon, interactive: false }).addTo(geoGroup);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when tab changes (Map | Satellite | Terrain)
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const newTile = L.tileLayer(tileUrls[activeTab], {
      maxZoom: 18,
      attribution: attributions[activeTab],
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTile;
  }, [activeTab]);

  // Center map when selectedDam changes
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedDam) return;
    mapInstanceRef.current.flyTo([selectedDam.latitude, selectedDam.longitude], zoomLevel || 10, {
      duration: 0.8,
    });
  }, [selectedDam]);

  // Render Clean Dam Markers (No oversize blue circle!)
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    MAHARASHTRA_DAMS.forEach((dam) => {
      const isSelected = selectedDam?.id === dam.id;
      const riskColor =
        dam.riskLevel === 'High' ? '#dc2626' : dam.riskLevel === 'Medium' ? '#d97706' : '#0284c7';

      // Clean SVG pin icon without any unwanted blue circles
      const customIcon = L.divIcon({
        className: 'clean-dam-pin',
        html: `
          <div style="
            position: relative;
            transform: translate(-50%, -100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            pointer-events: auto;
          ">
            ${
              isSelected
                ? `
              <div style="
                background: #0f172a;
                color: #ffffff;
                font-size: 11px;
                font-weight: 700;
                padding: 2px 7px;
                border-radius: 4px;
                white-space: nowrap;
                box-shadow: 0 2px 6px rgba(0,0,0,0.25);
                border: 1px solid rgba(255,255,255,0.2);
                margin-bottom: 3px;
              ">
                ${dam.name}
              </div>
            `
                : ''
            }
            <div style="
              width: ${isSelected ? '24px' : '18px'};
              height: ${isSelected ? '24px' : '18px'};
              background-color: ${isSelected ? '#0284c7' : riskColor};
              border: 2px solid #ffffff;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 2px 5px rgba(0,0,0,0.25);
              display: flex;
              align-items: center;
              justifyContent: center;
            ">
              <div style="
                width: ${isSelected ? '6px' : '5px'};
                height: ${isSelected ? '6px' : '5px'};
                background-color: #ffffff;
                border-radius: 50%;
                transform: rotate(45deg);
              "></div>
            </div>
          </div>
        `,
        iconSize: [0, 0],
      });

      const marker = L.marker([dam.latitude, dam.longitude], { icon: customIcon });

      marker.on('click', () => {
        if (onSelectDam) onSelectDam(dam);
      });

      marker.bindTooltip(
        `<div style="font-family: inherit; font-size: 12px; font-weight: 600; padding: 2px 4px;">
          ${dam.name} <span style="font-size: 10px; color: #64748b;">(${dam.district})</span>
          <br /><span style="font-size: 10px; color: ${riskColor}; font-weight: 700;">Status: ${dam.riskLevel} Risk</span>
        </div>`,
        { direction: 'top', offset: [0, -20] }
      );

      markersLayerRef.current!.addLayer(marker);
    });
  }, [selectedDam, onSelectDam]);

  // Render Flood Extent Polygon
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (floodLayerRef.current) {
      mapInstanceRef.current.removeLayer(floodLayerRef.current);
      floodLayerRef.current = null;
    }

    if (floodPolygon && floodPolygon.length > 2 && showLayers.floodExtent) {
      const polygon = L.polygon(floodPolygon, {
        color: '#0284c7',
        weight: 2,
        fillColor: '#38bdf8',
        fillOpacity: 0.55,
        smoothFactor: 1.0,
      }).addTo(mapInstanceRef.current);

      floodLayerRef.current = polygon;
    }
  }, [floodPolygon, showLayers.floodExtent]);

  // Render Downstream Settlements when available
  useEffect(() => {
    if (!mapInstanceRef.current || !settlementsLayerRef.current) return;

    settlementsLayerRef.current.clearLayers();

    const settlementsToRender =
      highlightSettlements ||
      (selectedDam && showLayers.settlements
        ? selectedDam.downstreamSettlements.map((s) => ({
            name: s.name,
            distanceKm: s.distanceKm,
            depthM: s.riskLevel === 'High' ? 6.2 : s.riskLevel === 'Medium' ? 3.8 : 2.1,
            arrivalTimeHours: s.arrivalTimeHours,
            latitude: s.latitude,
            longitude: s.longitude,
          }))
        : []);

    if (showLayers.settlements) {
      settlementsToRender.forEach((s) => {
        const icon = L.divIcon({
          className: 'settlement-marker',
          html: `
            <div style="
              display: flex;
              align-items: center;
              gap: 4px;
              background: rgba(255, 255, 255, 0.95);
              border: 1px solid #cbd5e1;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: 600;
              color: #0f172a;
              box-shadow: 0 1px 3px rgba(0,0,0,0.15);
              white-space: nowrap;
            ">
              <span style="width: 7px; height: 7px; border-radius: 50%; background-color: ${
                (s.depthM || 0) > 4 ? '#ef4444' : (s.depthM || 0) > 1 ? '#f59e0b' : '#0284c7'
              }; display: inline-block;"></span>
              ${s.name}
            </div>
          `,
          iconSize: [0, 0],
        });

        const marker = L.marker([s.latitude, s.longitude], { icon });
        marker.bindTooltip(
          `<div style="font-size: 11px; padding: 2px;">
            <b>${s.name}</b><br/>
            Est. Arrival: ${s.arrivalTimeHours} hrs<br/>
            Depth: ${s.depthM} m
          </div>`,
          { direction: 'top' }
        );

        settlementsLayerRef.current!.addLayer(marker);
      });
    }
  }, [selectedDam, highlightSettlements, showLayers.settlements]);

  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([18.9, 75.2], 7, { duration: 0.8 });
  };

  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: '10px', overflow: 'hidden' }}>
      {/* MAP CONTROLS: Map | Satellite | Terrain */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          zIndex: 400,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '7px',
          padding: '3px',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid var(--border-color)',
        }}
      >
        {(['Map', 'Satellite', 'Terrain'] as const).map((tab) => {
          const isActive = activeTab === tab;
          const labelKey = tab === 'Map' ? 'map.tab.map' : tab === 'Satellite' ? 'map.tab.satellite' : 'map.tab.terrain';
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                border: 'none',
                background: isActive ? 'var(--primary-blue)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '12px',
                padding: '5px 12px',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {t(labelKey, tab)}
            </button>
          );
        })}
      </div>

      {/* Target / Re-center Maharashtra Button */}
      <button
        onClick={handleResetView}
        style={{
          position: 'absolute',
          bottom: '88px',
          left: '12px',
          zIndex: 400,
          width: '32px',
          height: '32px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-card)',
          color: 'var(--text-main)',
        }}
        title={t('dashboard.reset_view', 'Reset Maharashtra View')}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
          <line x1="12" y1="2" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="22" />
          <line x1="2" y1="12" x2="5" y2="12" />
          <line x1="19" y1="12" x2="22" y2="12" />
        </svg>
      </button>

      {/* Small Map Legend at bottom-right */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          zIndex: 400,
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
          padding: '5px 10px',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '11px',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dc2626' }} />
          <span>{t('map.legend.high_risk', 'High Risk')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d97706' }} />
          <span>{t('map.legend.medium', 'Medium')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0284c7' }} />
          <span>{t('map.legend.normal', 'Normal')}</span>
        </div>
      </div>

      {/* Floating Inundation Depth Legend (When simulation is active) */}
      {simulationActive && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 400,
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '10px 14px',
            boxShadow: 'var(--shadow-card)',
            fontSize: '11px',
            minWidth: '135px',
          }}
        >
          <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px', fontSize: '11px' }}>
            {t('map.legend.inundation_depth', 'Inundation Depth (m)')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '10px', backgroundColor: '#1e3a8a', borderRadius: '2px' }} />
              <span style={{ color: 'var(--text-muted)' }}>&gt; 10 m</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '10px', backgroundColor: '#2563eb', borderRadius: '2px' }} />
              <span style={{ color: 'var(--text-muted)' }}>5 – 10 m</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '10px', backgroundColor: '#0284c7', borderRadius: '2px' }} />
              <span style={{ color: 'var(--text-muted)' }}>1 – 5 m</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '10px', backgroundColor: '#38bdf8', borderRadius: '2px' }} />
              <span style={{ color: 'var(--text-muted)' }}>&lt; 1 m</span>
            </div>
          </div>
        </div>
      )}

      {/* Map DOM Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};
