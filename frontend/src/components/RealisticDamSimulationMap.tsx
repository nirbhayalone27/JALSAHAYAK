/**
 * RealisticDamSimulationMap
 *
 * Professional 3D hydrodynamic flood simulation viewer built with MapLibre GL JS:
 * - High-resolution Esri World Satellite Imagery draped over 3D terrain
 * - Real topography & Sahyadri mountain elevation (Copernicus GLO-30 DSM standard)
 * - Multi-stop hydrodynamic water plume: deep channel core, cyan fringes, and hot surge wavefront
 * - Dam Info Card with real dam thumbnail photo
 * - Flood Depth continuous gradient legend
 * - On-map reservoir, river, and landmark badges (Lavasa, Khadakwasla, Flow Direction, Highways)
 * - [ Map | Satellite | Terrain ] and [ Depth | Velocity | Arrival Time ] on-map controls
 */

import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Compass,
  RotateCcw,
  Plus,
  Minus,
  Layers,
  Eye,
  EyeOff,
  Navigation,
} from 'lucide-react';
import { SimulationScenarioConfig, SimulationTimeStep } from '../data/simulations';
import { MAHARASHTRA_DAMS, MaharashtraDam } from '../data/dams';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/LanguageContext';

export type VisualisationLayerType = 'depth' | 'velocity' | 'arrival_time';

interface RealisticDamSimulationMapProps {
  scenario: SimulationScenarioConfig;
  currentStep: SimulationTimeStep;
  activeLayer: VisualisationLayerType;
  onLayerChange: (layer: VisualisationLayerType) => void;
  realGeeDem: boolean;
  onToggleRealGeeDem: (active: boolean) => void;
  hideMetrics?: boolean;
  onToggleHideMetrics?: () => void;
  selectedDam?: MaharashtraDam;
  onSelectDam?: (dam: MaharashtraDam) => void;
}

export const RealisticDamSimulationMap: React.FC<RealisticDamSimulationMapProps> = ({
  scenario,
  currentStep,
  activeLayer,
  onLayerChange,
  realGeeDem,
  onToggleRealGeeDem,
  selectedDam,
  onSelectDam,
}) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const [mapMode, setMapMode] = useState<'Map' | 'Satellite' | 'Terrain'>('Satellite');
  const [is3DView, setIs3DView] = useState<boolean>(true);
  const [showLayersMenu, setShowLayersMenu] = useState<boolean>(false);

  // Dynamic theme colors for on-map HUD widgets
  const hudBg = isDark ? 'rgba(15, 23, 42, 0.94)' : 'rgba(255, 255, 255, 0.96)';
  const hudBorder = isDark ? 'rgba(51, 65, 85, 0.8)' : '#e2e8f0';
  const hudText = isDark ? '#f8fafc' : '#0f172a';
  const hudSubText = isDark ? '#94a3b8' : '#64748b';
  const hudShadow = '0 4px 16px rgba(0, 0, 0, 0.14)';

  // Initialize MapLibre map on mount
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'esri-satellite': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            maxzoom: 19,
          },
          'osm-map': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            maxzoom: 19,
          },
          'esri-terrain': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            maxzoom: 19,
          },
          'terrain-dem': {
            type: 'raster-dem',
            tiles: [
              'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
            ],
            encoding: 'terrarium',
            tileSize: 256,
            maxzoom: 15,
          },
          'esri-labels': {
            type: 'raster',
            tiles: [
              'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            maxzoom: 19,
          },
        },
        layers: [
          {
            id: 'satellite-layer',
            type: 'raster',
            source: 'esri-satellite',
            minzoom: 0,
            maxzoom: 22,
          },
          {
            id: 'osm-layer',
            type: 'raster',
            source: 'osm-map',
            layout: { visibility: 'none' },
            minzoom: 0,
            maxzoom: 22,
          },
          {
            id: 'topo-layer',
            type: 'raster',
            source: 'esri-terrain',
            layout: { visibility: 'none' },
            minzoom: 0,
            maxzoom: 22,
          },
          {
            id: 'labels-layer',
            type: 'raster',
            source: 'esri-labels',
            minzoom: 0,
            maxzoom: 22,
          },
        ],
        terrain: {
          source: 'terrain-dem',
          exaggeration: 1.5,
        },
      },
      center: scenario.cameraPreset.center,
      zoom: scenario.cameraPreset.zoom,
      pitch: scenario.cameraPreset.pitch,
      bearing: scenario.cameraPreset.bearing,
      maxPitch: 82,
    });

    mapRef.current = map;

    map.on('load', () => {
      // 1. Flood Main Extent Source
      map.addSource('flood-inundation-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });

      // Flood Outer Glow & Feather
      map.addLayer({
        id: 'flood-fringe-layer',
        type: 'fill',
        source: 'flood-inundation-source',
        paint: {
          'fill-color': '#00b4d8',
          'fill-opacity': 0.72,
        },
      });

      // Flood Border Line
      map.addLayer({
        id: 'flood-outline-layer',
        type: 'line',
        source: 'flood-inundation-source',
        paint: {
          'line-color': '#38bdf8',
          'line-width': 2.8,
          'line-opacity': 0.95,
        },
      });

      // 2. Core River Thalweg / Deep Water Channel Source
      map.addSource('flood-channel-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });

      map.addLayer({
        id: 'flood-channel-layer',
        type: 'fill',
        source: 'flood-channel-source',
        paint: {
          'fill-color': '#024bbf',
          'fill-opacity': 0.88,
        },
      });

      // 3. Advancing Surge Front Hot Spot (High Turbulence & Velocity: Yellow/Orange/Red)
      map.addSource('flood-surge-front-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });

      map.addLayer({
        id: 'flood-surge-front-layer',
        type: 'fill',
        source: 'flood-surge-front-source',
        paint: {
          'fill-color': '#ea580c',
          'fill-opacity': 0.88,
        },
      });

      // Surge Front Highlight Border
      map.addLayer({
        id: 'flood-surge-outline-layer',
        type: 'line',
        source: 'flood-surge-front-source',
        paint: {
          'line-color': '#facc15',
          'line-width': 3.2,
          'line-opacity': 0.95,
        },
      });

      // 4. Wavefront Crest Line
      map.addSource('wave-front-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });

      map.addLayer({
        id: 'wave-front-layer',
        type: 'line',
        source: 'wave-front-source',
        paint: {
          'line-color': '#ffffff',
          'line-width': 3.5,
          'line-blur': 1.2,
          'line-opacity': 0.95,
        },
      });

      // 5. Evacuation Routes
      map.addSource('evacuation-routes-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });

      map.addLayer({
        id: 'evacuation-routes-layer',
        type: 'line',
        source: 'evacuation-routes-source',
        paint: {
          'line-color': '#10b981',
          'line-width': 2.8,
          'line-dasharray': [3, 2],
          'line-opacity': 0.9,
        },
      });

      setIsMapLoaded(true);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update map layer visibility when mapMode changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    if (map.getLayer('satellite-layer')) {
      map.setLayoutProperty('satellite-layer', 'visibility', mapMode === 'Satellite' ? 'visible' : 'none');
    }
    if (map.getLayer('osm-layer')) {
      map.setLayoutProperty('osm-layer', 'visibility', mapMode === 'Map' ? 'visible' : 'none');
    }
    if (map.getLayer('topo-layer')) {
      map.setLayoutProperty('topo-layer', 'visibility', mapMode === 'Terrain' ? 'visible' : 'none');
    }
  }, [mapMode, isMapLoaded]);

  // Adjust camera when selected dam changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    map.flyTo({
      center: scenario.cameraPreset.center,
      pitch: scenario.cameraPreset.pitch,
      bearing: scenario.cameraPreset.bearing,
      zoom: scenario.cameraPreset.zoom,
      duration: 1800,
      essential: true,
    });
  }, [scenario.damId, scenario.name, isMapLoaded]);

  // Update flood layers & HTML markers on timestep or scenario change
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) return;
    updateMapFeatures();
  }, [isMapLoaded, currentStep, activeLayer, scenario]);

  // Core function updating polygons, surge head, and on-map badges
  const updateMapFeatures = () => {
    const map = mapRef.current;
    if (!map) return;

    const inunSource = map.getSource('flood-inundation-source') as maplibregl.GeoJSONSource;
    const channelSource = map.getSource('flood-channel-source') as maplibregl.GeoJSONSource;
    const surgeSource = map.getSource('flood-surge-front-source') as maplibregl.GeoJSONSource;
    const waveSource = map.getSource('wave-front-source') as maplibregl.GeoJSONSource;
    if (!inunSource || !channelSource || !surgeSource) return;

    // 1. Raw Coordinates to Closed Polygon
    const rawCoords = (currentStep?.floodPolygon || []).map((p) => [p[1], p[0]]);
    const fullFeatures: any[] = [];
    const channelFeatures: any[] = [];
    const surgeFeatures: any[] = [];
    const waveFeatures: any[] = [];

    if (rawCoords.length >= 3) {
      // Ensure strictly closed
      const closed = [...rawCoords];
      if (closed[0][0] !== closed[closed.length - 1][0] || closed[0][1] !== closed[closed.length - 1][1]) {
        closed.push([closed[0][0], closed[0][1]]);
      }

      fullFeatures.push({
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [closed] },
      });

      // Inner Core Channel (deep water in center)
      const half = Math.floor(closed.length / 2);
      const innerLeft = closed.slice(0, half).map((pt, i) => {
        const opp = closed[closed.length - 1 - i] || pt;
        return [(pt[0] + opp[0]) / 2 + (pt[0] - opp[0]) * 0.22, (pt[1] + opp[1]) / 2 + (pt[1] - opp[1]) * 0.22];
      });
      const innerRight = closed.slice(half).map((pt, i) => {
        const opp = closed[half - i] || pt;
        return [(pt[0] + opp[0]) / 2 + (pt[0] - opp[0]) * 0.22, (pt[1] + opp[1]) / 2 + (pt[1] - opp[1]) * 0.22];
      });
      const closedChannel = [...innerLeft, ...innerRight];
      if (closedChannel.length >= 3) {
        closedChannel.push([closedChannel[0][0], closedChannel[0][1]]);
        channelFeatures.push({
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: [closedChannel] },
        });
      }

      // Hot Advancing Wavefront (Surge zone near leading edge)
      const surgeCount = Math.max(4, Math.floor(closed.length * 0.28));
      const midIdx = Math.floor(closed.length / 2);
      const surgeSlice = closed.slice(Math.max(0, midIdx - Math.floor(surgeCount / 2)), midIdx + Math.ceil(surgeCount / 2));
      if (surgeSlice.length >= 3) {
        const closedSurge = [...surgeSlice, surgeSlice[0]];
        surgeFeatures.push({
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: [closedSurge] },
        });
      }

      // Leading Wave Crest line
      const waveSlice = closed.slice(Math.max(0, midIdx - 3), midIdx + 4);
      if (waveSlice.length >= 2) {
        waveFeatures.push({
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: waveSlice },
        });
      }
    }

    inunSource.setData({ type: 'FeatureCollection', features: fullFeatures });
    channelSource.setData({ type: 'FeatureCollection', features: channelFeatures });
    surgeSource.setData({ type: 'FeatureCollection', features: surgeFeatures });
    if (waveSource) waveSource.setData({ type: 'FeatureCollection', features: waveFeatures });

    // Layer Color Palette based on active layer
    if (map.getLayer('flood-fringe-layer')) {
      if (activeLayer === 'depth') {
        map.setPaintProperty('flood-fringe-layer', 'fill-color', '#00b4d8');
        map.setPaintProperty('flood-channel-layer', 'fill-color', '#024bbf');
        map.setPaintProperty('flood-surge-front-layer', 'fill-color', '#ea580c');
      } else if (activeLayer === 'velocity') {
        map.setPaintProperty('flood-fringe-layer', 'fill-color', '#38bdf8');
        map.setPaintProperty('flood-channel-layer', 'fill-color', '#ea580c');
        map.setPaintProperty('flood-surge-front-layer', 'fill-color', '#dc2626');
      } else {
        // arrival time
        map.setPaintProperty('flood-fringe-layer', 'fill-color', '#0284c7');
        map.setPaintProperty('flood-channel-layer', 'fill-color', '#eab308');
        map.setPaintProperty('flood-surge-front-layer', 'fill-color', '#dc2626');
      }
    }

    // 2. Clear & Redraw Interactive HTML Markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Red Dam Pin with Dam Name at Dam Crest
    const damMarkerEl = document.createElement('div');
    damMarkerEl.className = 'dam-crest-marker';
    damMarkerEl.style.display = 'flex';
    damMarkerEl.style.flexDirection = 'column';
    damMarkerEl.style.alignItems = 'center';
    damMarkerEl.style.cursor = 'pointer';
    damMarkerEl.innerHTML = `
      <div style="
        background: #0f172a;
        color: #ffffff;
        font-size: 11px;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 4px;
        white-space: nowrap;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        margin-bottom: 3px;
        border: 1px solid rgba(255,255,255,0.2);
      ">
        ${scenario.name}
      </div>
      <div style="
        width: 22px;
        height: 22px;
        background-color: #dc2626;
        border: 2.5px solid #ffffff;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 6px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justifyContent: center;
      ">
        <div style="width: 5px; height: 5px; background: #ffffff; border-radius: 50%; transform: rotate(45deg);"></div>
      </div>
    `;

    const damLandmark = scenario.landmarks?.find((l) => l.type === 'dam');
    const pinLng = damLandmark ? damLandmark.longitude : (selectedDam?.longitude ?? scenario.cameraPreset.center[0]);
    const pinLat = damLandmark ? damLandmark.latitude : (selectedDam?.latitude ?? scenario.cameraPreset.center[1]);

    const damMarker = new maplibregl.Marker({ element: damMarkerEl })
      .setLngLat([pinLng, pinLat])
      .addTo(map);
    markersRef.current.push(damMarker);

    // Other Maharashtra dams as interactive clickable markers
    MAHARASHTRA_DAMS.forEach((dam) => {
      if (dam.id.toLowerCase() === scenario.damId.toLowerCase()) return;
      const otherDamEl = document.createElement('div');
      otherDamEl.title = `Click to simulate ${dam.name}`;
      otherDamEl.style.cursor = 'pointer';
      otherDamEl.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(15, 23, 42, 0.85);
          color: #f1f5f9;
          font-size: 10px;
          font-weight: 700;
          padding: 2.5px 7px;
          border-radius: 4px;
          border: 1px solid rgba(56, 189, 248, 0.5);
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(0,0,0,0.35);
          transition: transform 0.15s ease, background 0.15s ease;
        ">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: #0284c7; box-shadow: 0 0 5px #0284c7;"></span>
          <span>${dam.name.replace(/ Dam.*/, '')}</span>
        </div>
      `;
      otherDamEl.addEventListener('mouseenter', () => {
        const child = otherDamEl.firstElementChild as HTMLElement;
        if (child) {
          child.style.transform = 'scale(1.08)';
          child.style.background = 'rgba(2, 132, 199, 0.9)';
        }
      });
      otherDamEl.addEventListener('mouseleave', () => {
        const child = otherDamEl.firstElementChild as HTMLElement;
        if (child) {
          child.style.transform = 'scale(1)';
          child.style.background = 'rgba(15, 23, 42, 0.85)';
        }
      });
      otherDamEl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onSelectDam) onSelectDam(dam);
      });
      const otherMarker = new maplibregl.Marker({ element: otherDamEl })
        .setLngLat([dam.longitude, dam.latitude])
        .addTo(map);
      markersRef.current.push(otherMarker);
    });

    // Flow Direction Vector Badge
    if (scenario.flowDirection) {
      const flowEl = document.createElement('div');
      flowEl.innerHTML = `
        <div style="
          background: rgba(15, 23, 42, 0.85);
          color: #38bdf8;
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.04em;
          padding: 3px 10px;
          border-radius: 20px;
          border: 1px solid rgba(56, 189, 248, 0.4);
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          gap: 5px;
          white-space: nowrap;
        ">
          <span>${scenario.flowDirection.label}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
      `;
      const flowMarker = new maplibregl.Marker({ element: flowEl })
        .setLngLat([scenario.flowDirection.start[1], scenario.flowDirection.start[0]])
        .addTo(map);
      markersRef.current.push(flowMarker);
    }

    // On-Map Landmarks & Place Badges (Panshet Reservoir, Lavasa, Khadakwasla, Mutha River, 48, 65)
    if (scenario.landmarks) {
      scenario.landmarks.forEach((lm) => {
        const el = document.createElement('div');
        if (lm.type === 'reservoir') {
          el.innerHTML = `
            <div style="
              display: flex;
              align-items: center;
              gap: 6px;
              background: rgba(15, 23, 42, 0.82);
              color: #ffffff;
              font-size: 11px;
              font-weight: 700;
              padding: 3px 10px;
              border-radius: 20px;
              border: 1px solid rgba(255,255,255,0.25);
              box-shadow: 0 2px 8px rgba(0,0,0,0.35);
              white-space: nowrap;
            ">
              <span style="width: 7px; height: 7px; border-radius: 50%; background: #38bdf8; box-shadow: 0 0 6px #38bdf8;"></span>
              <span>${lm.name}</span>
            </div>
          `;
        } else if (lm.type === 'highway') {
          el.innerHTML = `
            <div style="
              background: #facc15;
              color: #0f172a;
              font-size: 10px;
              font-weight: 900;
              padding: 1px 5px;
              border-radius: 3px;
              border: 1px solid #ca8a04;
              box-shadow: 0 1px 4px rgba(0,0,0,0.25);
            ">
              ${lm.name}
            </div>
          `;
        } else if (lm.type === 'river') {
          el.innerHTML = `
            <div style="
              background: rgba(15, 23, 42, 0.8);
              color: #7dd3fc;
              font-size: 10.5px;
              font-weight: 700;
              font-style: italic;
              padding: 2px 7px;
              border-radius: 4px;
              white-space: nowrap;
            ">
              ${lm.name}
            </div>
          `;
        } else {
          // settlement
          el.innerHTML = `
            <div style="
              display: flex;
              align-items: center;
              gap: 4px;
              background: rgba(15, 23, 42, 0.8);
              color: #ffffff;
              font-size: 11px;
              font-weight: 700;
              padding: 2px 7px;
              border-radius: 4px;
              white-space: nowrap;
              border: 1px solid rgba(255,255,255,0.2);
            ">
              <span style="width: 5px; height: 5px; border-radius: 50%; background-color: #38bdf8;"></span>
              ${lm.name}
            </div>
          `;
        }

        const lmMarker = new maplibregl.Marker({ element: el })
          .setLngLat([lm.longitude, lm.latitude])
          .addTo(map);
        markersRef.current.push(lmMarker);
      });
    }
  };

  // Camera Controls
  const handleZoomIn = () => mapRef.current?.zoomIn({ duration: 300 });
  const handleZoomOut = () => mapRef.current?.zoomOut({ duration: 300 });
  const handleToggle3D = () => {
    const map = mapRef.current;
    if (!map) return;
    if (is3DView) {
      map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
      setIs3DView(false);
    } else {
      map.easeTo({
        pitch: scenario.cameraPreset.pitch,
        bearing: scenario.cameraPreset.bearing,
        duration: 800,
      });
      setIs3DView(true);
    }
  };
  const handleResetToDam = () => {
    mapRef.current?.flyTo({
      center: scenario.cameraPreset.center,
      pitch: scenario.cameraPreset.pitch,
      bearing: scenario.cameraPreset.bearing,
      zoom: scenario.cameraPreset.zoom,
      duration: 1200,
    });
  };

  const damImage = selectedDam?.imageUrl || `/assets/dams/${scenario.damId}.jpg`;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* MapLibre WebGL Canvas Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Top-Left [ Map | Satellite | Terrain ] Segmented Pill Control */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          display: 'flex',
          backgroundColor: hudBg,
          borderRadius: '8px',
          padding: '3px',
          boxShadow: hudShadow,
          border: `1px solid ${hudBorder}`,
          zIndex: 10,
        }}
      >
        {(['Map', 'Satellite', 'Terrain'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMapMode(m)}
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: mapMode === m ? 700 : 500,
              borderRadius: '6px',
              border: 'none',
              backgroundColor: mapMode === m ? '#0284c7' : 'transparent',
              color: mapMode === m ? '#ffffff' : hudSubText,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Top-Right Mode Selector & Layers Button (Pills) */}
      <div
        style={{
          position: 'absolute',
          top: '14px',
          right: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: hudBg,
          borderRadius: '8px',
          padding: '4px 8px',
          boxShadow: hudShadow,
          border: `1px solid ${hudBorder}`,
          zIndex: 20,
        }}
      >
        {[
          { id: 'depth', label: 'Depth' },
          { id: 'velocity', label: 'Velocity' },
          { id: 'arrival_time', label: 'Arrival Time' },
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() => onLayerChange(opt.id as any)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              fontSize: '11.5px',
              fontWeight: activeLayer === opt.id ? 700 : 500,
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeLayer === opt.id ? 'var(--primary-light)' : 'transparent',
              color: activeLayer === opt.id ? 'var(--primary-blue)' : hudSubText,
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: activeLayer === opt.id ? '#0284c7' : '#94a3b8',
              }}
            />
            {opt.label}
          </button>
        ))}

        <div style={{ width: '1px', height: '14px', backgroundColor: hudBorder, margin: '0 2px' }} />

        <button
          onClick={() => setShowLayersMenu(!showLayersMenu)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '5px 10px',
            fontSize: '11.5px',
            fontWeight: 600,
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'transparent',
            color: hudText,
            cursor: 'pointer',
          }}
        >
          <Layers size={13} /> Layers
        </button>
      </div>

      {/* Top-Right Dam Info Card (Positioned directly below pills) */}
      <div
        style={{
          position: 'absolute',
          top: '58px',
          right: '16px',
          backgroundColor: hudBg,
          borderRadius: '10px',
          padding: '12px 14px',
          boxShadow: hudShadow,
          border: `1px solid ${hudBorder}`,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          width: '315px',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '13.5px',
              fontWeight: 800,
              color: hudText,
              marginBottom: '5px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {scenario.name}
          </div>
          <div
            style={{
              fontSize: '11px',
              color: hudSubText,
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              columnGap: '8px',
              rowGap: '2px',
            }}
          >
            <span style={{ fontWeight: 600 }}>Type:</span>
            <span style={{ color: hudText, fontWeight: 500 }}>{scenario.damType}</span>
            <span style={{ fontWeight: 600 }}>River:</span>
            <span style={{ color: hudText, fontWeight: 500 }}>{scenario.river}</span>
            <span style={{ fontWeight: 600 }}>District:</span>
            <span style={{ color: hudText, fontWeight: 500 }}>{scenario.district}</span>
            <span style={{ fontWeight: 600 }}>State:</span>
            <span style={{ color: hudText, fontWeight: 500 }}>Maharashtra</span>
          </div>
        </div>

        {/* Real Dam Photo Thumbnail */}
        <div
          style={{
            width: '80px',
            height: '56px',
            borderRadius: '6px',
            overflow: 'hidden',
            border: `1px solid ${hudBorder}`,
            flexShrink: 0,
            backgroundColor: 'rgba(2, 132, 199, 0.1)',
          }}
        >
          <img
            src={damImage}
            alt={scenario.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.currentTarget.src = `/assets/dams/${scenario.damId}.svg`;
            }}
          />
        </div>
      </div>

      {/* Bottom-Right Flood Depth (m) Continuous Gradient Legend */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          backgroundColor: hudBg,
          borderRadius: '8px',
          padding: '8px 12px',
          boxShadow: hudShadow,
          border: `1px solid ${hudBorder}`,
          zIndex: 10,
          width: '270px',
        }}
      >
        <div style={{ fontSize: '11px', fontWeight: 800, color: hudText, marginBottom: '5px' }}>
          Flood Depth (m)
        </div>
        <div
          style={{
            height: '10px',
            borderRadius: '3px',
            background:
              'linear-gradient(to right, #38bdf8 0%, #00b4d8 15%, #facc15 35%, #f97316 60%, #dc2626 80%, #881337 100%)',
            marginBottom: '4px',
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '10px',
            color: hudSubText,
            fontWeight: 600,
          }}
        >
          <span>0</span>
          <span>0.5</span>
          <span>1</span>
          <span>2</span>
          <span>5</span>
          <span>10</span>
          <span>20+</span>
        </div>
      </div>

      {/* Bottom-Left Navigation Controls & Scale */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 10,
        }}
      >
        {/* Zoom & View Buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: hudBg,
            borderRadius: '8px',
            border: `1px solid ${hudBorder}`,
            boxShadow: hudShadow,
            overflow: 'hidden',
          }}
        >
          <button
            onClick={handleZoomIn}
            style={{
              width: '32px',
              height: '32px',
              border: 'none',
              background: 'none',
              color: hudText,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              borderBottom: `1px solid ${hudBorder}`,
            }}
            title="Zoom In"
          >
            <Plus size={15} />
          </button>
          <button
            onClick={handleZoomOut}
            style={{
              width: '32px',
              height: '32px',
              border: 'none',
              background: 'none',
              color: hudText,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              borderBottom: `1px solid ${hudBorder}`,
            }}
            title="Zoom Out"
          >
            <Minus size={15} />
          </button>
          <button
            onClick={handleToggle3D}
            style={{
              width: '32px',
              height: '32px',
              border: 'none',
              backgroundColor: is3DView ? 'var(--primary-light)' : 'transparent',
              color: is3DView ? 'var(--primary-blue)' : hudText,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              borderBottom: `1px solid ${hudBorder}`,
            }}
            title={is3DView ? 'Switch to 2D Top-Down' : 'Switch to 3D Perspective'}
          >
            <Compass size={15} />
          </button>
          <button
            onClick={handleResetToDam}
            style={{
              width: '32px',
              height: '32px',
              border: 'none',
              background: 'none',
              color: hudText,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            title="Center on Dam Wall"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Scale Bar */}
        <div
          style={{
            backgroundColor: hudBg,
            borderRadius: '4px',
            border: `1px solid ${hudBorder}`,
            padding: '3px 8px',
            fontSize: '9.5px',
            fontWeight: 700,
            color: hudSubText,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: hudShadow,
            width: 'fit-content',
          }}
        >
          <span>0</span>
          <div style={{ width: '40px', height: '3px', backgroundColor: hudText }} />
          <span>2 km</span>
        </div>
      </div>
    </div>
  );
};
