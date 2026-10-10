/**
 * JalSahayak Central Translation Dictionary (English and Hindi)
 * Compliant with Government of India terminology guidelines.
 * Proper names (Khadakwasla Dam, Panshet Dam, NTRO, JalSahayak, Maharashtra, rivers) are preserved.
 */

export type LanguageCode = 'en' | 'hi';

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.dams': 'Dams',
    'nav.monitoring': 'Live Monitoring',
    'nav.satellite': 'Satellite',
    'nav.simulation': 'Simulation',
    'nav.impact': 'Impact Analysis',
    'nav.reports': 'Reports',
    'nav.alerts': 'Alerts',
    'nav.settings': 'Settings',

    // Header & Brand
    'brand.ministry': 'Government of India',
    'brand.org': 'National Technical Research Organisation',
    'brand.subtitle': 'Autonomous Dam-Break Intelligence & Early Warning',
    'header.search_placeholder': 'Search dam, river, district or location...',
    'header.alerts_title': 'Active Alerts',
    'header.theme_light': 'Light Mode',
    'header.theme_dark': 'Dark Mode',
    'header.lang_en': 'EN',
    'header.lang_hi': 'हिन्दी',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Maharashtra Flood Risk Intelligence & Dam-Break Simulation',
    'dashboard.live': 'Live',
    'dashboard.kpi.monitored': 'Dams Monitored',
    'dashboard.kpi.high_risk': 'High Risk Dams',
    'dashboard.kpi.population_risk': 'People at Risk',
    'dashboard.kpi.potential_inundation': 'Potential Inundation',
    'dashboard.selected_dam': 'Selected Dam',
    'dashboard.dam_select_label': 'Select Maharashtra Dam',
    'dashboard.high_risk': 'High Risk',
    'dashboard.medium_risk': 'Medium Risk',
    'dashboard.normal_risk': 'Normal',
    'dashboard.reset_view': 'Reset Maharashtra View',

    // Map controls & Tabs
    'map.tab.map': 'Map',
    'map.tab.satellite': 'Satellite',
    'map.tab.terrain': 'Terrain',
    'map.legend.high_risk': 'High Risk',
    'map.legend.medium': 'Medium',
    'map.legend.normal': 'Normal',
    'map.legend.inundation_depth': 'Inundation Depth (m)',

    // Simulation Page
    'sim.header_title': 'DAM BREAK INUNDATION & HADR DECISION SUPPORT',
    'sim.header_subtitle': 'Hydrodynamic Flood Intelligence',
    'sim.status_prefix': 'Status',
    'sim.status_ready': 'Ready for Simulation',
    'sim.status_preparing': 'Preparing Parameters...',
    'sim.status_running': 'Running Hydrodynamic Solver...',
    'sim.status_completed': 'Simulation Output Ready',
    'sim.demo_badge': 'DEMO • SIMULATED EXAMPLE',
    'sim.live_badge': 'FASTAPI HYDRO KERNEL (LIVE)',

    // Simulation Parameters
    'sim.param_title': 'Simulation Parameters',
    'sim.param_dam_height': 'DAM HEIGHT (M)',
    'sim.param_res_vol': 'RESERVOIR VOL (MM³)',
    'sim.param_breach_width': 'BREACH WIDTH (M)',
    'sim.param_formation_time': 'FORMATION TIME (MIN)',
    'sim.param_mode': 'SCENARIO MODE',
    'sim.mode_overtopping': 'Overtopping Failure (High Inflow Surge)',
    'sim.mode_piping': 'Piping Foundation Breach',
    'sim.mode_gate': 'Sudden Multi-Spillway Gate Failure',
    'sim.btn_run': 'Run Flood Simulation',
    'sim.btn_running': 'Simulating...',

    // Simulation Pipeline
    'sim.pipeline_title': 'SIMULATION PIPELINE',
    'sim.pipe_01': '01 DATA INGESTION',
    'sim.pipe_01_sub': 'DEM • River • Hydrology • Infrastructure',
    'sim.pipe_01_done': '✔ INGESTED',
    'sim.pipe_02': '02 SPH BREACH MODEL',
    'sim.pipe_02_sub': 'Froehlich empirical hydrograph',
    'sim.pipe_02_done': '✔ GENERATED',
    'sim.pipe_03': '03 DELFT3D BASIN ROUTING',
    'sim.pipe_03_sub': 'Kinematic wave propagation',
    'sim.pipe_03_done': '✔ PROPAGATED',
    'sim.pipe_04': '04 IMPACT & POST-PROCESSING',
    'sim.pipe_04_sub': 'Depth & velocity exposure mapping',
    'sim.pipe_04_done': '✔ COMPLETED',
    'sim.pipe_05': '05 HADR DECISION SUPPORT',
    'sim.pipe_05_sub': 'Evacuation routing and alerts',
    'sim.pipe_05_done': '✔ READY',

    // Key Results
    'sim.results_title': 'KEY RESULTS',
    'sim.res_peak_q': 'PEAK DISCHARGE',
    'sim.res_max_depth': 'MAX DEPTH',
    'sim.res_max_vel': 'MAX VELOCITY',
    'sim.res_earliest_arr': 'EARLIEST ARRIVAL',
    'sim.res_inundated_area': 'INUNDATED AREA',
    'sim.res_pop_at_risk': 'POPULATION AT RISK',

    // HADR Priorities
    'sim.hadr_title': 'HADR PRIORITIES',
    'sim.hadr_arrival': 'Flood arrival',
    'sim.btn_geojson': 'Export GeoJSON',
    'sim.btn_report': 'HADR Report',
    'sim.btn_view_impact': 'View Full Impact Analysis',

    // Map HUD Controls
    'hud.layer_depth': 'DEPTH',
    'hud.layer_velocity': 'VELOCITY',
    'hud.layer_arrival': 'ARRIVAL TIME',
    'hud.real_gee_dem': 'REAL GEE DEM',
    'hud.hide_metrics': 'HIDE METRICS',
    'hud.show_metrics': 'SHOW METRICS',
    'hud.timeline_title': 'INUNDATION TIMELINE',
    'hud.speed': 'Speed',
    'hud.copernicus': 'Copernicus GLO-30 DSM',
    'hud.safe_zone': 'DESIGNATED SAFE ZONE',
    'hud.shelter_capacity': 'Shelter Capacity',
    'hud.elevation_msl': 'Elevation MSL',

    // Depth Scale Legend
    'legend.depth_scale': 'DEPTH SCALE',
    'legend.deep_surge': 'Deep Surge (> 10m)',
    'legend.high_depth': 'High Depth (5 - 10m)',
    'legend.moderate': 'Moderate (2 - 5m)',
    'legend.low_fringe': 'Low / Fringe (< 2m)',
    'legend.river_channel': 'River Channel',
    'legend.evac_corridor': 'Evacuation Corridor',
  },
  hi: {
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.dams': 'बांध सूची',
    'nav.monitoring': 'लाइव निगरानी',
    'nav.satellite': 'उपग्रह निगरानी',
    'nav.simulation': 'सिमुलेशन',
    'nav.impact': 'प्रभाव विश्लेषण',
    'nav.reports': 'रिपोर्ट्स',
    'nav.alerts': 'अलर्ट्स',
    'nav.settings': 'सेटिंग्स',

    // Header & Brand
    'brand.ministry': 'भारत सरकार',
    'brand.org': 'राष्ट्रीय तकनीकी अनुसंधान संगठन (NTRO)',
    'brand.subtitle': 'स्वायत्त बांध विफलता विश्लेषण एवं पूर्व चेतावनी प्रणाली',
    'header.search_placeholder': 'बांध, नदी, जिला या स्थान खोजें...',
    'header.alerts_title': 'सक्रिय अलर्ट',
    'header.theme_light': 'लाइट मोड',
    'header.theme_dark': 'डार्क मोड',
    'header.lang_en': 'EN',
    'header.lang_hi': 'हिन्दी',

    // Dashboard
    'dashboard.title': 'डैशबोर्ड',
    'dashboard.subtitle': 'महाराष्ट्र बाढ़ जोखिम सतर्कता एवं बांध-विफलता सिमुलेशन',
    'dashboard.live': 'लाइव',
    'dashboard.kpi.monitored': 'निगरानी अधीन बांध',
    'dashboard.kpi.high_risk': 'उच्च जोखिम बांध',
    'dashboard.kpi.population_risk': 'जोखिम में नागरिक',
    'dashboard.kpi.potential_inundation': 'संभावित जलमग्न क्षेत्र',
    'dashboard.selected_dam': 'चयनित बांध',
    'dashboard.dam_select_label': 'महाराष्ट्र का बांध चुनें',
    'dashboard.high_risk': 'उच्च जोखिम',
    'dashboard.medium_risk': 'मध्यम जोखिम',
    'dashboard.normal_risk': 'सामान्य',
    'dashboard.reset_view': 'महाराष्ट्र दृश्य रीसेट करें',

    // Map controls & Tabs
    'map.tab.map': 'मानचित्र',
    'map.tab.satellite': 'उपग्रह',
    'map.tab.terrain': 'भूभाग (टेरेन)',
    'map.legend.high_risk': 'उच्च जोखिम',
    'map.legend.medium': 'मध्यम जोखिम',
    'map.legend.normal': 'सामान्य',
    'map.legend.inundation_depth': 'जलमग्न गहराई (मीटर)',

    // Simulation Page
    'sim.header_title': 'बांध विफलता जलप्लावन एवं एचएडीआर निर्णय सहायता',
    'sim.header_subtitle': 'हाइड्रोडायनामिक बाढ़ सतर्कता प्रणाली',
    'sim.status_prefix': 'स्थिति',
    'sim.status_ready': 'सिमुलेशन हेतु तैयार',
    'sim.status_preparing': 'पैरामीटर तैयारी जारी...',
    'sim.status_running': 'हाइड्रोडायनामिक सॉल्वर कार्यरत...',
    'sim.status_completed': 'सिमुलेशन आउटपुट उपलब्ध',
    'sim.demo_badge': 'प्रदर्शनात्मक • सिमुलेटेड उदाहरण',
    'sim.live_badge': 'फास्टएपीआई हाइड्रो सॉल्वर (लाइव)',

    // Simulation Parameters
    'sim.param_title': 'सिमुलेशन पैरामीटर',
    'sim.param_dam_height': 'बांध की ऊंचाई (मी)',
    'sim.param_res_vol': 'जलाशय क्षमता (MM³)',
    'sim.param_breach_width': 'दरार की चौड़ाई (मी)',
    'sim.param_formation_time': 'विफलता समय (मिनट)',
    'sim.param_mode': 'विफलता परिदृश्य',
    'sim.mode_overtopping': 'अतिप्रवाह विफलता (उच्च जलप्रवाह)',
    'sim.mode_piping': 'पाइपिंग नींव विफलता',
    'sim.mode_gate': 'स्पिलवे गेट आकस्मिक विफलता',
    'sim.btn_run': 'बाढ़ सिमुलेशन चलाएं',
    'sim.btn_running': 'गणना जारी...',

    // Simulation Pipeline
    'sim.pipeline_title': 'सिमुलेशन पाइपलाइन',
    'sim.pipe_01': '01 डेटा समावेशन',
    'sim.pipe_01_sub': 'डीईएम • नदी • जलविज्ञान • अवसंरचना',
    'sim.pipe_01_done': '✔ समाविष्ट',
    'sim.pipe_02': '02 एसपीएच दरार मॉडल',
    'sim.pipe_02_sub': 'फ्रोलिच अनुभवजन्य हाइड्रोग्राफ',
    'sim.pipe_02_done': '✔ निर्मित',
    'sim.pipe_03': '03 डेल्फ्ट3डी बेसिन रूटिंग',
    'sim.pipe_03_sub': 'किनेमैटिक तरंग संचरण',
    'sim.pipe_03_done': '✔ संचरित',
    'sim.pipe_04': '04 प्रभाव एवं पोस्ट-प्रोसेसिंग',
    'sim.pipe_04_sub': 'गहराई एवं प्रवाह वेग मानचित्रण',
    'sim.pipe_04_done': '✔ पूर्ण',
    'sim.pipe_05': '05 एचएडीआर निर्णय सहायता',
    'sim.pipe_05_sub': 'निकासी मार्ग एवं चेतावनी',
    'sim.pipe_05_done': '✔ तैयार',

    // Key Results
    'sim.results_title': 'प्रमुख परिणाम',
    'sim.res_peak_q': 'शीर्ष निर्वहन',
    'sim.res_max_depth': 'अधिकतम जल गहराई',
    'sim.res_max_vel': 'अधिकतम प्रवाह वेग',
    'sim.res_earliest_arr': 'न्यूनतम आगमन समय',
    'sim.res_inundated_area': 'जलमग्न क्षेत्र',
    'sim.res_pop_at_risk': 'जोखिम में नागरिक',

    // HADR Priorities
    'sim.hadr_title': 'एचएडीआर प्राथमिकताएं',
    'sim.hadr_arrival': 'बाढ़ आगमन',
    'sim.btn_geojson': 'जियोजेसन निर्यात',
    'sim.btn_report': 'एचएडीआर रिपोर्ट',
    'sim.btn_view_impact': 'पूर्ण प्रभाव विश्लेषण देखें',

    // Map HUD Controls
    'hud.layer_depth': 'गहराई',
    'hud.layer_velocity': 'प्रवाह वेग',
    'hud.layer_arrival': 'आगमन समय',
    'hud.real_gee_dem': 'वास्तविक जीईई डीईएम',
    'hud.hide_metrics': 'मेट्रिक्स छिपाएं',
    'hud.show_metrics': 'मेट्रिक्स दिखाएं',
    'hud.timeline_title': 'जलप्लावन समय-सारणी',
    'hud.speed': 'गति',
    'hud.copernicus': 'कॉपरनिकस GLO-30 DSM',
    'hud.safe_zone': 'निर्धारित सुरक्षित क्षेत्र',
    'hud.shelter_capacity': 'आश्रय क्षमता',
    'hud.elevation_msl': 'ऊंचाई समुद्र तल से',

    // Depth Scale Legend
    'legend.depth_scale': 'गहराई पैमाना',
    'legend.deep_surge': 'गंभीर सैलाब (> 10मी)',
    'legend.high_depth': 'उच्च गहराई (5 - 10मी)',
    'legend.moderate': 'मध्यम गहराई (2 - 5मी)',
    'legend.low_fringe': 'कम / सीमावर्ती (< 2मी)',
    'legend.river_channel': 'नदी का तल',
    'legend.evac_corridor': 'निकासी गलियारा',
  },
};
