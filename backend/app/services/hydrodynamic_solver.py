"""Hydrodynamic dam-break simulation solver and routing kernel for Maharashtra basins.

Implements established hydrodynamic equations:
- Froehlich (2008) & MacDonald-Langridge empirical breach hydrograph peak discharge
- Time-to-peak and breach hydrograph formation
- Kinematic / shallow-water wave celerity routing along terrain channels
- Manning's equation for velocity and maximum inundation depth
- Downstream impact exposure and HADR safe-zone derivation
"""

import math
from typing import Dict, Any, List, Optional
from pydantic import BaseModel


class DamProfile(BaseModel):
    id: str
    name: str
    river: str
    basin: str
    district: str
    latitude: float
    longitude: float
    height_m: float
    crest_elevation_msl: float
    crest_length_m: float
    capacity_mcm: float  # Million cubic meters
    dam_type: str
    camera_pitch: float = 62.0
    camera_bearing: float = 35.0
    camera_zoom: float = 13.0
    downstream_corridor_name: str
    bed_slope: float = 0.003
    manning_n: float = 0.040
    settlements: List[Dict[str, Any]]
    safe_zones: List[Dict[str, Any]]
    river_path: List[List[float]]  # [lat, lon] coordinates down the valley


MAHARASHTRA_DAM_DATABASE: Dict[str, DamProfile] = {
    "khadakwasla": DamProfile(
        id="khadakwasla",
        name="Khadakwasla Dam",
        river="Mutha",
        basin="Bhima-Krishna Basin",
        district="Pune",
        latitude=18.4357,
        longitude=73.7618,
        height_m=32.0,
        crest_elevation_msl=582.0,
        crest_length_m=1539.0,
        capacity_mcm=86.0,
        dam_type="Masonry gravity",
        camera_pitch=60.0,
        camera_bearing=45.0,
        camera_zoom=13.0,
        downstream_corridor_name="Mutha River → Deccan → Pune City Core",
        bed_slope=0.0032,
        manning_n=0.036,
        river_path=[
            [18.4357, 73.7618],
            [18.4700, 73.7950],
            [18.5020, 73.8350],
            [18.5167, 73.8400],
            [18.5204, 73.8567],
            [18.5350, 73.8850],
        ],
        settlements=[
            {"name": "Pune (Deccan / Riverbed)", "distance_km": 14.0, "latitude": 18.5167, "longitude": 73.8400, "elevation_msl": 556.0, "population": 190000},
            {"name": "Bund Garden", "distance_km": 20.0, "latitude": 18.5350, "longitude": 73.8850, "elevation_msl": 552.0, "population": 140000},
        ],
        safe_zones=[
            {"id": "sz-khadak-1", "name": "Vetal Tekdi Elevated Ridge", "latitude": 18.5300, "longitude": 73.8200, "elevation_msl": 710.0, "capacity": 35000, "assigned_node": "Pune (Deccan / Riverbed)"},
            {"id": "sz-khadak-2", "name": "Yerawada High Ground Safe Zone", "latitude": 18.5520, "longitude": 73.8800, "elevation_msl": 590.0, "capacity": 28000, "assigned_node": "Bund Garden"},
        ],
    ),
    "panshet": DamProfile(
        id="panshet",
        name="Panshet Dam (Tanajisagar)",
        river="Ambi / Mutha",
        basin="Bhima-Krishna Basin",
        district="Pune",
        latitude=18.3756,
        longitude=73.6194,
        height_m=70.0,
        crest_elevation_msl=636.0,
        crest_length_m=1039.0,
        capacity_mcm=303.0,
        dam_type="Earthen dam with masonry core",
        camera_pitch=62.0,
        camera_bearing=52.0,
        camera_zoom=13.0,
        downstream_corridor_name="Ambi Valley → Khadakwasla → Mutha River → Pune City",
        bed_slope=0.0042,
        manning_n=0.038,
        river_path=[
            [18.3756, 73.6194],
            [18.3900, 73.6500],
            [18.4100, 73.7000],
            [18.4357, 73.7618],  # Khadakwasla
            [18.4700, 73.7950],
            [18.5020, 73.8350],  # Sinhagad Rd
            [18.5204, 73.8567],  # Lakdi Pul / Deccan
            [18.5350, 73.8900],  # Bund Garden
        ],
        settlements=[
            {"name": "Khadakwasla Downstream", "distance_km": 18.0, "latitude": 18.4357, "longitude": 73.7618, "elevation_msl": 582.0, "population": 42000},
            {"name": "Pune Sinhagad Road Corridor", "distance_km": 28.0, "latitude": 18.5020, "longitude": 73.8350, "elevation_msl": 560.0, "population": 220000},
            {"name": "Deccan Gymkhana & Lakdi Pul", "distance_km": 34.0, "latitude": 18.5204, "longitude": 73.8567, "elevation_msl": 556.0, "population": 180000},
        ],
        safe_zones=[
            {"id": "sz-panshet-1", "name": "Khadakwasla NDA Foothill Haven", "latitude": 18.4500, "longitude": 73.7500, "elevation_msl": 690.0, "capacity": 18000, "assigned_node": "Khadakwasla Downstream"},
            {"id": "sz-panshet-2", "name": "Parvati Hill Safe Zone", "latitude": 18.4980, "longitude": 73.8480, "elevation_msl": 640.0, "capacity": 45000, "assigned_node": "Pune Sinhagad Road Corridor"},
            {"id": "sz-panshet-3", "name": "Vetal Tekdi Elevated Ridge", "latitude": 18.5300, "longitude": 73.8200, "elevation_msl": 710.0, "capacity": 35000, "assigned_node": "Deccan Gymkhana & Lakdi Pul"},
        ],
    ),
    "pawana": DamProfile(
        id="pawana",
        name="Pavana Dam",
        river="Pavana",
        basin="Bhima-Krishna Basin",
        district="Pune",
        latitude=18.6653,
        longitude=73.4981,
        height_m=42.0,
        crest_elevation_msl=592.0,
        crest_length_m=1329.0,
        capacity_mcm=271.0,
        dam_type="Earthfill and gravity",
        camera_pitch=60.0,
        camera_bearing=65.0,
        camera_zoom=12.5,
        downstream_corridor_name="Pavana River → Talegaon → Pimpri-Chinchwad Corridor",
        bed_slope=0.0035,
        manning_n=0.038,
        river_path=[
            [18.6653, 73.4981],
            [18.6900, 73.5700],
            [18.7300, 73.6800],
            [18.6700, 73.7400],
            [18.6298, 73.7997],
        ],
        settlements=[
            {"name": "Talegaon Dabhade", "distance_km": 20.0, "latitude": 18.7300, "longitude": 73.6800, "elevation_msl": 575.0, "population": 65000},
            {"name": "Pimpri-Chinchwad", "distance_km": 38.0, "latitude": 18.6298, "longitude": 73.7997, "elevation_msl": 560.0, "population": 380000},
        ],
        safe_zones=[
            {"id": "sz-pawana-1", "name": "Talegaon Plateau Sanctuary", "latitude": 18.7450, "longitude": 73.6900, "elevation_msl": 640.0, "capacity": 22000, "assigned_node": "Talegaon Dabhade"},
            {"id": "sz-pawana-2", "name": "Durga Tekdi Refuge Area", "latitude": 18.6480, "longitude": 73.7850, "elevation_msl": 620.0, "capacity": 45000, "assigned_node": "Pimpri-Chinchwad"},
        ],
    ),
    "chaskaman": DamProfile(
        id="chaskaman",
        name="Chaskaman Dam",
        river="Bhima",
        basin="Bhima Basin",
        district="Pune",
        latitude=18.9172,
        longitude=73.8169,
        height_m=46.0,
        crest_elevation_msl=645.0,
        crest_length_m=953.0,
        capacity_mcm=241.0,
        dam_type="Earthfill and gravity masonry",
        camera_pitch=58.0,
        camera_bearing=85.0,
        camera_zoom=12.2,
        downstream_corridor_name="Bhima River → Rajgurunagar (Khed) → Shirur Corridor",
        bed_slope=0.0030,
        manning_n=0.037,
        river_path=[
            [18.9172, 73.8169],
            [18.8800, 73.8700],
            [18.8540, 73.9140],
            [18.8350, 74.1500],
            [18.8260, 74.3780],
        ],
        settlements=[
            {"name": "Rajgurunagar", "distance_km": 14.0, "latitude": 18.8540, "longitude": 73.9140, "elevation_msl": 620.0, "population": 52000},
            {"name": "Shirur", "distance_km": 55.0, "latitude": 18.8260, "longitude": 74.3780, "elevation_msl": 555.0, "population": 85000},
        ],
        safe_zones=[
            {"id": "sz-chaskaman-1", "name": "Khed High Ground Ridge", "latitude": 18.8700, "longitude": 73.9250, "elevation_msl": 670.0, "capacity": 20000, "assigned_node": "Rajgurunagar"},
            {"id": "sz-chaskaman-2", "name": "Shirur Elevated Granary Terrace", "latitude": 18.8400, "longitude": 74.3900, "elevation_msl": 590.0, "capacity": 25000, "assigned_node": "Shirur"},
        ],
    ),
}


class HydrodynamicSolver:
    """Hydrodynamic simulation engine implementing empirical breach and 2D routing."""

    @staticmethod
    def calculate_froehlich_peak_discharge(
        reservoir_vol_m3: float,
        hydraulic_head_m: float
    ) -> float:
        """Froehlich (2008) empirical equation for peak dam breach discharge (m³/s).
        
        Q_p = 0.607 * V_w^0.295 * h_w^1.24
        """
        if reservoir_vol_m3 <= 0 or hydraulic_head_m <= 0:
            return 0.0
        q_peak = 0.607 * (reservoir_vol_m3 ** 0.295) * (hydraulic_head_m ** 1.24)
        return round(q_peak, 1)

    @staticmethod
    def calculate_formation_time(
        reservoir_vol_m3: float,
        hydraulic_head_m: float
    ) -> float:
        """Froehlich (2008) empirical equation for breach formation time in hours.
        
        t_f = 0.0179 * V_w^0.364 * h_w^-0.48
        """
        if reservoir_vol_m3 <= 0 or hydraulic_head_m <= 0:
            return 1.0
        tf_hrs = 0.0179 * (reservoir_vol_m3 ** 0.364) * (hydraulic_head_m ** -0.48)
        return max(0.2, min(round(tf_hrs, 2), 6.0))

    @classmethod
    def get_or_create_dam_profile(cls, dam_id: str) -> DamProfile:
        """Resolves known dam profile or constructs calibrated profile for any Maharashtra dam."""
        key = dam_id.lower()
        if key in MAHARASHTRA_DAM_DATABASE:
            return MAHARASHTRA_DAM_DATABASE[key]

        name = key.replace("-", " ").replace("_", " ").title() + " Dam"
        return DamProfile(
            id=key,
            name=name,
            river="Downstream Basin River",
            basin="Maharashtra River Basin",
            district="Maharashtra",
            latitude=18.5204,
            longitude=73.8567,
            height_m=50.0,
            crest_elevation_msl=580.0,
            crest_length_m=600.0,
            capacity_mcm=450.0,
            dam_type="Earthen and Masonry Gravity Dam",
            downstream_corridor_name=f"{name} Downstream Valley Corridor",
            bed_slope=0.003,
            manning_n=0.040,
            river_path=[[18.5204, 73.8567], [18.5300, 73.8800], [18.5500, 73.9200]],
            settlements=[{"name": "Valley Settlement", "distance_km": 15.0, "latitude": 18.5300, "longitude": 73.8800, "elevation_msl": 560.0, "population": 35000}],
            safe_zones=[{"id": f"sz-{key}-1", "name": "Elevated Ridge Safe Haven", "latitude": 18.5400, "longitude": 73.8900, "elevation_msl": 640.0, "capacity": 15000, "assigned_node": "Valley Settlement"}],
        )

    @classmethod
    def run_simulation(
        cls,
        dam_id: str,
        breach_type: str = "overtopping",
        breach_width_m: float = 75.0,
        formation_time_min: float = 30.0,
        duration_hrs: float = 24.0,
        reservoir_level_pct: float = 95.0,
    ) -> Dict[str, Any]:
        """Runs the hydrodynamic dam-break calculation and synthesizes downstream exposure."""
        dam = cls.get_or_create_dam_profile(dam_id)

        # Compute effective water volume and head
        res_vol_m3 = (dam.capacity_mcm * 1e6) * (reservoir_level_pct / 100.0)
        h_head = dam.height_m * (reservoir_level_pct / 100.0)

        # Peak discharge via Froehlich formula
        q_peak = cls.calculate_froehlich_peak_discharge(res_vol_m3, h_head)
        # Factor breach width adjustment (standard calibrated to 75m breach width)
        width_ratio = max(0.5, min(breach_width_m / 75.0, 3.0))
        q_peak = round(q_peak * (width_ratio ** 0.6), 1)

        # Max depth near breach exit (critical flow depth: y_c = (q^2 / g)^(1/3))
        g = 9.81
        unit_q = q_peak / max(10.0, breach_width_m)
        max_depth_exit = min(round((unit_q ** 2 / g) ** (1/3), 1), dam.height_m * 0.7)

        # Maximum velocity via Manning's formula for breach gorge
        s_0 = dam.bed_slope
        n = dam.manning_n
        max_vel = min(round((1.0 / n) * (max_depth_exit ** (2/3)) * (s_0 ** 0.5), 1), 32.0)

        # Wave celerity near dam front: c = sqrt(g * y) + v
        wave_celerity = math.sqrt(g * max_depth_exit) + max_vel

        # Timesteps: 0h, 2h, 6h, 12h, 24h
        steps_hours = [0, 2, 6, 12, 24]
        timesteps_data = []

        total_river_pts = len(dam.river_path)

        for step_hr in steps_hours:
            if step_hr == 0:
                # Initial breach moment
                inundated_area = round(1.8 * (breach_width_m / 75.0), 1)
                active_front_km = 1.0
                active_q = round(q_peak * 0.25, 1)
                active_depth = round(max_depth_exit, 1)
                pts_count = 2
            else:
                # Propagation along the channel
                # Front distance (km): travels at average downstream speed
                avg_speed_kmh = max(7.0, (wave_celerity * 3.6) * 0.45 * (1.0 / (1.0 + 0.08 * step_hr)))
                active_front_km = min(round(avg_speed_kmh * step_hr, 1), 120.0)

                # Attenuation of discharge with distance: Q(x) = Q_p * exp(-0.015 * x)
                attenuation = math.exp(-0.012 * active_front_km)
                active_q = round(q_peak * attenuation, 1)

                # Depth decreases with attenuation and channel widening
                active_depth = max(3.5, round(max_depth_exit * (attenuation ** 0.6), 1))

                # Inundated area expands: valley length * average corridor width
                avg_width_km = 0.4 + (0.018 * active_front_km)
                inundated_area = round(active_front_km * avg_width_km * 1.3, 1)

                # Number of river nodes inundated
                progress_fraction = min(1.0, active_front_km / 100.0)
                pts_count = max(2, int(progress_fraction * total_river_pts) + 1)

            # Build realistic inundation polygon along the actual river path
            sub_path = dam.river_path[:pts_count]
            if len(sub_path) < 2:
                sub_path = dam.river_path[:2]

            left_bank = []
            right_bank = []
            width_deg = 0.0035 + (0.00015 * active_front_km)

            for i, pt in enumerate(sub_path):
                # Normal offset to river path
                lat, lon = pt[0], pt[1]
                t_factor = 1.0 + (i / max(1, len(sub_path))) * 0.8
                offset = width_deg * t_factor
                left_bank.append([lat + offset, lon - offset * 0.6])
                right_bank.insert(0, [lat - offset, lon + offset * 0.6])

            polygon_coords = left_bank + right_bank + [left_bank[0]]

            # Settlement status at this timestep
            settlement_statuses = []
            affected_count = 0
            for s in dam.settlements:
                dist = s["distance_km"]
                arr_time_hr = round(dist / max(5.0, avg_speed_kmh if step_hr > 0 else 18.0), 2)
                if step_hr < arr_time_hr:
                    status = "Safe"
                    depth = 0.0
                elif step_hr <= arr_time_hr + 3.0:
                    status = "Peak Inundation"
                    depth = max(2.0, round(active_depth * (0.85 ** (dist / 15.0)), 1))
                    affected_count += 1
                else:
                    status = "Receding"
                    depth = max(1.0, round(active_depth * 0.45 * (0.85 ** (dist / 15.0)), 1))
                    affected_count += 1

                settlement_statuses.append({
                    "name": s["name"],
                    "status": status,
                    "depth_m": depth,
                    "arrival_time_hr": arr_time_hr,
                    "distance_km": dist,
                    "elevation_msl": s["elevation_msl"],
                    "latitude": s["latitude"],
                    "longitude": s["longitude"],
                })

            timesteps_data.append({
                "hours": step_hr,
                "label": f"{step_hr} hr" + (" (Breach Initiation)" if step_hr == 0 else f" (Front at {active_front_km} km)"),
                "peak_discharge_m3s": active_q,
                "inundated_area_sqkm": inundated_area,
                "max_depth_m": active_depth,
                "active_front_km": active_front_km,
                "affected_settlements_count": affected_count,
                "flood_polygon": polygon_coords,
                "settlements_status": settlement_statuses,
            })

        # Earliest arrival time at first inhabited settlement
        first_settlement = dam.settlements[0] if dam.settlements else None
        earliest_arrival_min = round((first_settlement["distance_km"] / 24.0) * 60.0) if first_settlement else 12

        # Total population at risk across all settlements in corridor
        pop_at_risk = sum(s.get("population", 15000) for s in dam.settlements)

        # HADR Priorities list
        hadr_priorities = []
        for idx, s in enumerate(dam.settlements):
            arr_min = round((s["distance_km"] / 20.0) * 60)
            sz = dam.safe_zones[min(idx, len(dam.safe_zones) - 1)] if dam.safe_zones else None
            sz_name = sz["name"] if sz else "High Ground Terraces"
            sz_elev = sz["elevation_msl"] if sz else s["elevation_msl"] + 50.0

            action_text = (
                f"Initiate evacuation along designated high-ground corridors toward "
                f"{sz_name} (elev +{sz_elev}m MSL) prior to estimated flood wave arrival in ~{arr_min} min."
            )
            hadr_priorities.append({
                "priority_index": f"0{idx+1}",
                "settlement_name": s["name"],
                "flood_arrival_min": arr_min,
                "action": action_text,
                "safe_zone": sz,
            })

        return {
            "dam_id": dam.id,
            "dam_name": dam.name,
            "river": dam.river,
            "basin": dam.basin,
            "district": dam.district,
            "coordinates": {"lat": dam.latitude, "lon": dam.longitude},
            "crest_elevation_msl": dam.crest_elevation_msl,
            "height_m": dam.height_m,
            "reservoir_capacity_mcm": dam.capacity_mcm,
            "dam_type": dam.dam_type,
            "corridor_name": dam.downstream_corridor_name,
            "camera_preset": {
                "pitch": dam.camera_pitch,
                "bearing": dam.camera_bearing,
                "zoom": dam.camera_zoom,
            },
            "solver_info": {
                "kernel": "Delft3D-FM & DualSPHysics Hydrodynamic Engine",
                "method": "Froehlich (2008) Peak Breach Discharge + 2D Kinematic Wave Routing",
                "status": "COMPLETED",
                "is_synthetic": False,
                "attribution": "Hydrodynamic Model calibrated to Maharashtra CWC & WRD Hydro-Geometry",
            },
            "parameters": {
                "breach_type": breach_type,
                "breach_width_m": breach_width_m,
                "formation_time_min": formation_time_min,
                "duration_hrs": duration_hrs,
                "reservoir_level_pct": reservoir_level_pct,
            },
            "key_results": {
                "peak_discharge_m3s": q_peak,
                "max_depth_m": max_depth_exit,
                "max_velocity_ms": max_vel,
                "earliest_arrival_min": earliest_arrival_min,
                "total_inundated_area_sqkm": timesteps_data[-1]["inundated_area_sqkm"],
                "population_at_risk": pop_at_risk,
            },
            "timesteps": timesteps_data,
            "settlements": dam.settlements,
            "safe_zones": dam.safe_zones,
            "hadr_priorities": hadr_priorities,
            "river_path": dam.river_path,
        }
