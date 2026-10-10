# JalSahayak — Coding Standards

> Version: 1.0 | Status: Active | Last updated: 2026-10-08

---

## 1. General Principles

- Write clear, readable code over clever code
- Every function should do one thing
- Name things for what they mean, not for how they work
- Comments explain *why*, not *what*
- Keep files focused and reasonably sized (< 400 lines preferred)
- No dead code — delete it, don't comment it out

---

## 2. Frontend (TypeScript / React)

### TypeScript
- **Strict mode** enabled (`"strict": true` in tsconfig)
- No `any` — use proper types or `unknown` with type guards
- Interfaces for data shapes; types for unions/intersections
- Export types alongside components that use them

### Component Structure
```
components/
├── DamList/
│   ├── DamList.tsx          # Component
│   ├── DamList.css          # Styles (CSS Modules)
│   ├── DamList.types.ts     # Types
│   └── index.ts             # Re-export
├── DamOverview/
└── ...
```

### Naming Conventions
| Element | Convention | Example |
|---|---|---|
| Component | PascalCase | `DamOverview` |
| Component file | PascalCase.tsx | `DamOverview.tsx` |
| Hook | camelCase, prefix `use` | `useDamStatus` |
| Utility function | camelCase | `formatCoordinates` |
| Constant | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE` |
| CSS class | camelCase (CSS Modules) | `statusBadge` |
| Type/Interface | PascalCase | `DamResponse` |
| Enum | PascalCase (members too) | `DamStatus.Normal` |

### State Management
- **Local state:** `useState` for component-specific state
- **Shared state:** React Context + `useReducer` for cross-component state
- **Server state:** Custom hooks wrapping fetch calls (consider React Query post-MVP)
- Do not put server data in global state — fetch it where needed

### API Handling
```typescript
// services/api/dams.ts
const API_BASE = '/api/v1';

export async function getDams(params?: DamListParams): Promise<DamListResponse> {
  const response = await fetch(`${API_BASE}/dams?${buildQuery(params)}`);
  if (!response.ok) throw new ApiError(response);
  return response.json();
}
```

- One file per API resource (`dams.ts`, `observations.ts`, `scenarios.ts`)
- Typed request parameters and response shapes
- Centralized error handling
- No raw `fetch` calls in components — use service functions

### Error Handling
- API errors caught and displayed via toast/notification component
- Loading states shown for all async operations
- Error boundaries for component tree protection
- Never swallow errors silently

---

## 3. Backend (Python / FastAPI)

### Python Version
- Python 3.11+ required
- Use modern syntax: `match` statements, union types (`X | Y`), type hints everywhere

### Type Hints
```python
# YES
def get_dam(dam_id: UUID) -> Dam:
    ...

def compute_status(changes: list[Change], window_days: int = 7) -> StatusResult:
    ...

# NO
def get_dam(dam_id):
    ...
```

- All function signatures must have type hints (parameters and return)
- Use `typing` module for complex types
- Pydantic models for all external data (requests, responses, configs)

### Pydantic Conventions
```python
class DamCreate(BaseModel):
    """Schema for creating a new dam."""
    name: str = Field(..., min_length=1, max_length=200)
    river: str | None = None
    location: Point  # GeoJSON point
    reservoir_area: Polygon  # GeoJSON polygon

    model_config = ConfigDict(
        str_strip_whitespace=True,
        json_schema_extra={"example": {...}}
    )
```

- `Create` suffix for creation schemas
- `Update` suffix for update schemas (all fields optional)
- `Response` suffix for API response schemas
- Validators for business rules

### FastAPI Conventions
```python
# api/dams.py
router = APIRouter(prefix="/dams", tags=["dams"])

@router.get("", response_model=PaginatedResponse[DamResponse])
async def list_dams(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: DamStatus | None = None,
    dam_service: DamService = Depends(get_dam_service),
) -> PaginatedResponse[DamResponse]:
    """List all monitored dams."""
    return await dam_service.list_dams(page, page_size, status)
```

- Route handlers are thin — delegate to services
- Use dependency injection (`Depends`) for services
- Document endpoints with docstrings (OpenAPI generation)
- Return typed responses

### Service / Repository Pattern
```
Route Handler (thin)
      │
      ▼
Service (business logic)
      │
      ▼
Repository / ORM (data access)
```

- **Services** contain business logic, orchestration
- **Repositories** (models + queries) handle data access
- **Providers** abstract external systems (satellite, simulation)
- Services may call other services but avoid circular dependencies

### Logging
```python
import structlog

logger = structlog.get_logger()

async def fetch_observations(dam_id: UUID) -> list[Observation]:
    logger.info("fetching_observations", dam_id=str(dam_id))
    try:
        observations = await satellite_provider.search(...)
        logger.info("observations_found", dam_id=str(dam_id), count=len(observations))
        return observations
    except SatelliteProviderError as e:
        logger.error("observation_fetch_failed", dam_id=str(dam_id), error=str(e))
        raise
```

- Use `structlog` for structured JSON logging
- Log key events: start, success, failure
- Include context (dam_id, job_id, user_id)
- Never log secrets, passwords, tokens

### Exception Hierarchy
```python
class JalSahayakError(Exception):
    """Base exception."""

class NotFoundError(JalSahayakError):
    """Resource not found."""

class ValidationError(JalSahayakError):
    """Input validation failed."""

class ConflictError(JalSahayakError):
    """Resource conflict."""

class ExternalServiceError(JalSahayakError):
    """External service (satellite, simulation) failed."""
```

- Custom exceptions mapped to HTTP status codes in exception handler
- Never raise raw `Exception`
- Include context in exception message

### Testing
```python
# tests/services/test_dam_service.py

@pytest.mark.asyncio
async def test_create_dam(dam_service, sample_dam_data):
    dam = await dam_service.create_dam(sample_dam_data)
    assert dam.name == sample_dam_data.name
    assert dam.current_status == DamStatus.NORMAL

@pytest.mark.asyncio
async def test_create_dam_duplicate(dam_service, existing_dam):
    with pytest.raises(ConflictError):
        await dam_service.create_dam(existing_dam)
```

- Tests mirror source structure: `tests/services/`, `tests/api/`, `tests/workers/`
- Use `pytest` + `pytest-asyncio`
- Fixtures for common test data
- Test business logic in service tests
- Test HTTP contract in API tests
- Aim for > 80% coverage on services

---

## 4. Database

### Naming Conventions
| Element | Convention | Example |
|---|---|---|
| Table | plural snake_case | `dams`, `observations`, `alerts` |
| Column | singular snake_case | `dam_id`, `observation_date`, `created_at` |
| Primary key | `id` (UUID) | `id` |
| Foreign key | `{referenced_table_singular}_id` | `dam_id`, `scenario_id` |
| Index | `ix_{table}_{columns}` | `ix_observations_dam_id_date` |
| Constraint | `{type}_{table}_{columns}` | `uq_dams_name_location` |

### Migrations (Alembic)
- Every schema change requires a migration
- Migrations are version-controlled
- Migration messages are descriptive: `"add_downstream_region_to_dams"`
- Never modify a migration after it has been applied to shared environments
- Down-migration (rollback) defined for every up-migration

### Indexes
- Foreign keys: always indexed
- Frequently filtered columns: indexed
- Spatial columns: GIST index
- Composite indexes for common query patterns (e.g., `dam_id + date`)
- Do not over-index — add indexes based on actual query patterns

### Spatial Indexes
```sql
CREATE INDEX ix_dams_location ON dams USING GIST (location);
CREATE INDEX ix_dams_reservoir ON dams USING GIST (reservoir_area);
CREATE INDEX ix_scenarios_flood_extent ON scenarios USING GIST (flood_extent);
CREATE INDEX ix_impacts_geometry ON impacts USING GIST (feature_geometry);
```

---

## 5. Git

### Branch Naming
```
main                          # production-ready
develop                       # integration branch
feature/{ticket}-{short-desc} # feature work
bugfix/{ticket}-{short-desc}  # bug fixes
hotfix/{short-desc}           # urgent production fixes
```

Examples:
- `feature/JS-012-dam-service`
- `bugfix/JS-045-alert-dedup`
- `hotfix/fix-jwt-expiry`

### Commit Messages
```
{type}: {short description}

{optional body - what and why}
```

**Types:**
| Type | Use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code restructuring (no behavior change) |
| `docs` | Documentation |
| `test` | Tests |
| `chore` | Build, tooling, dependencies |
| `style` | Formatting (no logic change) |

Examples:
```
feat: add dam service with CRUD operations
fix: prevent duplicate alerts within cooldown window
docs: add API contract for scenario endpoints
test: add service tests for change detection
refactor: extract satellite provider interface
```

### Pull Requests
- Title follows commit message format
- Description includes: what changed, why, how to test
- Link to related issue/task
- At least one review before merge
- All tests pass before merge
- No merge conflicts

---

## 6. Project Layout

```
JALSAHAYAK/
├── README.md
├── docs/                    # All documentation
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── providers/
│   │   ├── api/
│   │   ├── workers/
│   │   └── utils/
│   ├── alembic/
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── data/
│   └── synthetic/
├── scripts/
├── docker-compose.yml
└── .env.example
```
