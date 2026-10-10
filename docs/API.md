# JalSahayak — REST API Contracts

> Version: 1.0 | Status: MVP Definition | Last updated: 2026-10-08

---

## Base URL

```
/api/v1
```

## Common Response Envelope

### Success
```json
{
  "data": { ... },
  "meta": {
    "timestamp": "2026-10-08T12:00:00Z",
    "request_id": "uuid"
  }
}
```

### Error
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Dam with ID xyz not found.",
    "details": {}
  },
  "meta": {
    "timestamp": "2026-10-08T12:00:00Z",
    "request_id": "uuid"
  }
}
```

### Pagination
```json
{
  "data": [ ... ],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 45,
    "total_pages": 3
  }
}
```

---

## Authentication

### `POST /auth/login`

**Purpose:** Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "string"
}
```

**Response (200):**
```json
{
  "data": {
    "access_token": "jwt-string",
    "refresh_token": "jwt-string",
    "token_type": "bearer",
    "expires_in": 3600
  }
}
```

**Errors:**
| Code | Status | Description |
|---|---|---|
| `INVALID_CREDENTIALS` | 401 | Email or password incorrect |

---

### `POST /auth/refresh`

**Purpose:** Refresh an expired access token.

**Request:**
```json
{
  "refresh_token": "jwt-string"
}
```

**Response (200):**
```json
{
  "data": {
    "access_token": "new-jwt-string",
    "expires_in": 3600
  }
}
```

---

## Dams

### `GET /dams`

**Purpose:** List all monitored dams.

**Query Parameters:**
| Param | Type | Description |
|---|---|---|
| `page` | int | Page number (default: 1) |
| `page_size` | int | Items per page (default: 20, max: 100) |
| `status` | string | Filter by current status (NORMAL, WATCH, ALERT, CRITICAL) |
| `river` | string | Filter by river name |

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Koyna Dam",
      "river": "Koyna",
      "state": "Maharashtra",
      "district": "Satara",
      "location": { "lat": 17.3965, "lng": 73.7537 },
      "current_status": "NORMAL",
      "latest_observation_date": "2026-10-05",
      "alert_count": 0,
      "created_at": "2026-09-01T00:00:00Z"
    }
  ],
  "meta": { "page": 1, "page_size": 20, "total": 5 }
}
```

---

### `POST /dams`

**Purpose:** Add a new dam to monitoring.

**Auth:** `admin`, `engineer`

**Request:**
```json
{
  "name": "Koyna Dam",
  "river": "Koyna",
  "state": "Maharashtra",
  "district": "Satara",
  "location": { "lat": 17.3965, "lng": 73.7537 },
  "reservoir_area": { "type": "Polygon", "coordinates": [[[...]]] },
  "monitoring_area": { "type": "Polygon", "coordinates": [[[...]]] },
  "downstream_region": { "type": "Polygon", "coordinates": [[[...]]] },
  "metadata": {}
}
```

**Response (201):**
```json
{
  "data": {
    "id": "uuid",
    "name": "Koyna Dam",
    "river": "Koyna",
    "current_status": "NORMAL",
    "created_at": "2026-10-08T12:00:00Z"
  }
}
```

**Errors:**
| Code | Status | Description |
|---|---|---|
| `VALIDATION_ERROR` | 422 | Invalid geometry or missing required fields |
| `DAM_ALREADY_EXISTS` | 409 | Dam with same name and coordinates exists |

---

### `GET /dams/{dam_id}`

**Purpose:** Get full details of a specific dam.

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "name": "Koyna Dam",
    "river": "Koyna",
    "state": "Maharashtra",
    "district": "Satara",
    "location": { "lat": 17.3965, "lng": 73.7537 },
    "reservoir_area": { "type": "Polygon", "coordinates": [[[...]]] },
    "monitoring_area": { "type": "Polygon", "coordinates": [[[...]]] },
    "downstream_region": { "type": "Polygon", "coordinates": [[[...]]] },
    "current_status": {
      "status": "NORMAL",
      "reasons": [],
      "computed_at": "2026-10-08T06:00:00Z"
    },
    "latest_observation": {
      "id": "uuid",
      "date": "2026-10-05",
      "source": "sentinel-2"
    },
    "metadata": {},
    "created_at": "2026-09-01T00:00:00Z",
    "updated_at": "2026-10-08T06:00:00Z"
  }
}
```

**Errors:**
| Code | Status | Description |
|---|---|---|
| `RESOURCE_NOT_FOUND` | 404 | Dam not found |

---

### `PUT /dams/{dam_id}`

**Purpose:** Update dam details.

**Auth:** `admin`, `engineer`

**Request:** Same structure as POST (partial update supported).

**Response (200):** Updated dam object.

---

### `DELETE /dams/{dam_id}`

**Purpose:** Remove dam from monitoring.

**Auth:** `admin`

**Response (204):** No content.

---

## Observations

### `GET /dams/{dam_id}/observations`

**Purpose:** List satellite/environmental observations for a dam.

**Query Parameters:**
| Param | Type | Description |
|---|---|---|
| `page` | int | Page number |
| `page_size` | int | Items per page |
| `date_from` | date | Start date filter |
| `date_to` | date | End date filter |
| `source` | string | Filter by source (sentinel-2, synthetic, etc.) |

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "dam_id": "uuid",
      "observation_date": "2026-10-05",
      "source": "sentinel-2",
      "data_type": "optical",
      "coverage_pct": 95.2,
      "quality": "good",
      "thumbnail_url": "/storage/...",
      "ingested_at": "2026-10-05T14:00:00Z"
    }
  ],
  "meta": { "page": 1, "total": 12 }
}
```

---

### `GET /dams/{dam_id}/observations/{observation_id}`

**Purpose:** Get details of a specific observation.

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "dam_id": "uuid",
    "observation_date": "2026-10-05",
    "source": "sentinel-2",
    "data_type": "optical",
    "coverage_pct": 95.2,
    "quality": "good",
    "storage_path": "...",
    "metadata": {},
    "ingested_at": "2026-10-05T14:00:00Z"
  }
}
```

---

### `POST /dams/{dam_id}/observations/fetch`

**Purpose:** Manually trigger observation fetch for a dam.

**Auth:** `admin`, `engineer`

**Response (202):**
```json
{
  "data": {
    "task_id": "uuid",
    "status": "queued",
    "message": "Observation fetch queued for Koyna Dam."
  }
}
```

---

## Changes

### `GET /dams/{dam_id}/changes`

**Purpose:** List change detection results for a dam.

**Query Parameters:**
| Param | Type | Description |
|---|---|---|
| `page` | int | Page number |
| `date_from` | date | Start date filter |
| `date_to` | date | End date filter |
| `change_type` | string | Filter by type (water_spread, boundary, surface, etc.) |

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "dam_id": "uuid",
      "observation_a": { "id": "uuid", "date": "2026-10-01" },
      "observation_b": { "id": "uuid", "date": "2026-10-05" },
      "change_type": "water_spread",
      "severity": "moderate",
      "description": "Reservoir water spread increased by 12% between Oct 1 and Oct 5.",
      "metrics": {
        "area_change_pct": 12.3,
        "area_change_km2": 1.8
      },
      "detected_at": "2026-10-05T14:30:00Z"
    }
  ]
}
```

---

### `POST /dams/{dam_id}/changes/compare`

**Purpose:** Request change detection between two specific observations.

**Auth:** `admin`, `engineer`

**Request:**
```json
{
  "observation_a_id": "uuid",
  "observation_b_id": "uuid"
}
```

**Response (202):**
```json
{
  "data": {
    "task_id": "uuid",
    "status": "queued",
    "message": "Change detection queued."
  }
}
```

---

## Status

### `GET /dams/{dam_id}/status`

**Purpose:** Get current and historical dam health status.

**Query Parameters:**
| Param | Type | Description |
|---|---|---|
| `history` | boolean | Include status history (default: false) |
| `limit` | int | Number of historical records (default: 10) |

**Response (200):**
```json
{
  "data": {
    "current": {
      "status": "WATCH",
      "reasons": [
        {
          "type": "water_spread_change",
          "description": "Reservoir water spread increased by 12% in last 5 days.",
          "evidence_id": "change-uuid"
        }
      ],
      "computed_at": "2026-10-05T14:30:00Z"
    },
    "history": [
      {
        "status": "NORMAL",
        "computed_at": "2026-10-01T06:00:00Z"
      }
    ]
  }
}
```

---

## Scenarios

### `POST /dams/{dam_id}/scenarios`

**Purpose:** Create a new flood / dam-break scenario.

**Auth:** `admin`, `engineer`

**Request:**
```json
{
  "name": "Worst-case breach scenario",
  "parameters": {
    "reservoir_level_m": 145.0,
    "breach_width_m": 50.0,
    "breach_depth_m": 30.0,
    "breach_formation_time_hr": 1.0,
    "release_condition": "sudden",
    "simulation_duration_hr": 24.0
  }
}
```

**Response (201):**
```json
{
  "data": {
    "id": "uuid",
    "dam_id": "uuid",
    "name": "Worst-case breach scenario",
    "status": "draft",
    "parameters": { ... },
    "created_at": "2026-10-08T12:00:00Z"
  }
}
```

---

### `GET /dams/{dam_id}/scenarios`

**Purpose:** List scenarios for a dam.

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Worst-case breach scenario",
      "status": "completed",
      "created_at": "2026-10-08T12:00:00Z",
      "completed_at": "2026-10-08T12:01:30Z"
    }
  ]
}
```

---

### `GET /scenarios/{scenario_id}`

**Purpose:** Get scenario details and results.

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "dam_id": "uuid",
    "name": "Worst-case breach scenario",
    "status": "completed",
    "parameters": { ... },
    "result": {
      "flood_extent_geojson": { "type": "MultiPolygon", "coordinates": [[[...]]] },
      "max_depth_m": 8.5,
      "flow_direction": "SE",
      "arrival_times": [
        { "distance_km": 5, "arrival_hr": 1.2 },
        { "distance_km": 10, "arrival_hr": 2.8 },
        { "distance_km": 20, "arrival_hr": 5.1 }
      ],
      "affected_area_km2": 42.5,
      "is_synthetic": true
    },
    "created_at": "2026-10-08T12:00:00Z",
    "completed_at": "2026-10-08T12:01:30Z"
  }
}
```

---

### `POST /scenarios/{scenario_id}/run`

**Purpose:** Execute a scenario simulation.

**Auth:** `admin`, `engineer`

**Response (202):**
```json
{
  "data": {
    "task_id": "uuid",
    "status": "running",
    "message": "Simulation started for scenario."
  }
}
```

**Errors:**
| Code | Status | Description |
|---|---|---|
| `SCENARIO_ALREADY_RUNNING` | 409 | Scenario is already being simulated |
| `SCENARIO_NOT_FOUND` | 404 | Scenario not found |

---

### `GET /scenarios/{scenario_id}/impact`

**Purpose:** Get impact analysis results for a completed scenario.

**Response (200):**
```json
{
  "data": {
    "scenario_id": "uuid",
    "summary": {
      "total_affected_area_km2": 42.5,
      "settlements_affected": 8,
      "roads_affected_km": 15.3,
      "bridges_affected": 2,
      "agriculture_affected_km2": 28.1
    },
    "features": [
      {
        "impact_type": "settlement",
        "feature_name": "Navaja Village",
        "geometry": { "type": "Point", "coordinates": [73.8, 17.3] },
        "estimated_impact": {
          "flood_depth_m": 2.1,
          "arrival_time_hr": 3.5
        }
      },
      {
        "impact_type": "road",
        "feature_name": "NH-48 Section",
        "geometry": { "type": "LineString", "coordinates": [[...]] },
        "estimated_impact": {
          "affected_length_km": 4.2,
          "max_depth_m": 1.5
        }
      }
    ],
    "is_synthetic": true
  }
}
```

---

## Alerts

### `GET /dams/{dam_id}/alerts`

**Purpose:** List alerts for a specific dam.

**Query Parameters:**
| Param | Type | Description |
|---|---|---|
| `page` | int | Page number |
| `severity` | string | Filter: INFO, WARNING, CRITICAL |
| `acknowledged` | boolean | Filter by acknowledged status |
| `date_from` | datetime | Start date filter |

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "dam_id": "uuid",
      "severity": "WARNING",
      "alert_type": "reservoir_change",
      "title": "Unusual reservoir change detected",
      "reason": "Reservoir water spread increased by 12% between Oct 1 and Oct 5, which exceeds the normal variation threshold.",
      "evidence": {
        "change_id": "uuid",
        "observation_ids": ["uuid-a", "uuid-b"],
        "metrics": { "area_change_pct": 12.3 }
      },
      "recommended_action": "Review satellite observations and consider on-site inspection.",
      "acknowledged": false,
      "created_at": "2026-10-05T14:35:00Z"
    }
  ]
}
```

---

### `GET /alerts`

**Purpose:** List all alerts across all dams.

**Query Parameters:** Same as dam-specific, plus `dam_id` filter.

---

### `PATCH /alerts/{alert_id}/acknowledge`

**Purpose:** Acknowledge an alert.

**Auth:** `admin`, `engineer`

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "acknowledged": true,
    "acknowledged_at": "2026-10-08T13:00:00Z",
    "acknowledged_by": "user-uuid"
  }
}
```

---

## Reports

### `GET /dams/{dam_id}/reports`

**Purpose:** List monitoring reports for a dam.

**Query Parameters:**
| Param | Type | Description |
|---|---|---|
| `page` | int | Page number |
| `limit` | int | Items per page |

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "dam_id": "uuid",
      "monitoring_period_start": "2026-10-01",
      "monitoring_period_end": "2026-10-08",
      "generated_at": "2026-10-08T14:00:00Z",
      "version": 3
    }
  ]
}
```

---

### `GET /reports/{report_id}`

**Purpose:** Get full report content.

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "dam_id": "uuid",
    "dam_name": "Koyna Dam",
    "monitoring_period_start": "2026-10-01",
    "monitoring_period_end": "2026-10-08",
    "latest_observation": {
      "date": "2026-10-05",
      "source": "sentinel-2",
      "summary": "Clear optical observation, 95% coverage."
    },
    "previous_observation": {
      "date": "2026-10-01",
      "source": "sentinel-2"
    },
    "detected_changes": [
      {
        "type": "water_spread",
        "description": "Reservoir water spread increased by 12%.",
        "severity": "moderate"
      }
    ],
    "current_status": {
      "status": "WATCH",
      "reasons": ["Significant water-spread change detected."]
    },
    "downstream_impact_summary": "Latest scenario estimates 42.5 km² affected area, 8 settlements potentially impacted.",
    "active_alerts": [
      {
        "severity": "WARNING",
        "title": "Unusual reservoir change detected"
      }
    ],
    "evidence": [
      "Sentinel-2 observation 2026-10-05",
      "Change detection result CD-001"
    ],
    "limitations": "Flood impact estimates use synthetic simulation. Real hydrodynamic validation pending.",
    "generated_at": "2026-10-08T14:00:00Z",
    "version": 3
  }
}
```

---

### `GET /reports/{report_id}/export`

**Purpose:** Export report as PDF or Markdown.

**Query Parameters:**
| Param | Type | Description |
|---|---|---|
| `format` | string | `pdf` or `markdown` (default: `pdf`) |

**Response (200):** File download.

---

## Health

### `GET /health`

**Purpose:** System health check.

**Response (200):**
```json
{
  "status": "healthy",
  "database": "connected",
  "redis": "connected",
  "storage": "connected",
  "timestamp": "2026-10-08T12:00:00Z"
}
```

---

## Common Error Codes

| Code | HTTP Status | Description |
|---|---|---|
| `VALIDATION_ERROR` | 422 | Request body validation failed |
| `RESOURCE_NOT_FOUND` | 404 | Requested resource does not exist |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `CONFLICT` | 409 | Resource conflict (duplicate, already running) |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
