# JalSahayak — Security Design

> Version: 1.0 | Status: MVP Definition | Last updated: 2026-10-08

---

## 1. Security Philosophy

MVP security must be **practical, not theatrical**. Cover the essentials correctly. Do not over-engineer.

**Priorities:**
1. Protect user credentials and access
2. Validate all inputs
3. Secure external API keys
4. Audit sensitive operations
5. Prevent common attack vectors

## 2. Authentication

### Method
- **JWT (JSON Web Tokens)** with short-lived access tokens and longer-lived refresh tokens
- Access token expiry: **1 hour**
- Refresh token expiry: **7 days**

### Password Handling
- Hash: **bcrypt** with work factor ≥ 12
- Minimum password length: **10 characters**
- No plaintext password storage or logging — ever
- Password reset via email token (post-MVP)

### Token Flow
```
LOGIN (email + password)
      │
      ▼
VALIDATE credentials
      │
      ▼
ISSUE access_token + refresh_token
      │
      ▼
CLIENT stores tokens (httpOnly cookie preferred, localStorage acceptable for MVP)
      │
      ▼
EVERY REQUEST: Authorization: Bearer <access_token>
      │
      ▼
TOKEN EXPIRED? → Use refresh_token → Issue new access_token
```

## 3. Authorization

### Role-Based Access Control (RBAC)

| Role | Description |
|---|---|
| `admin` | Full system access, user management |
| `engineer` | Dam management, scenarios, alert acknowledgment |
| `viewer` | Read-only access to dams, reports, alerts |

### Permission Matrix

| Resource | Action | Admin | Engineer | Viewer |
|---|---|---|---|---|
| Users | Create / Edit / Delete | ✓ | ✗ | ✗ |
| Dams | Create / Edit | ✓ | ✓ | ✗ |
| Dams | View | ✓ | ✓ | ✓ |
| Dams | Delete | ✓ | ✗ | ✗ |
| Observations | Trigger fetch | ✓ | ✓ | ✗ |
| Observations | View | ✓ | ✓ | ✓ |
| Scenarios | Create / Run | ✓ | ✓ | ✗ |
| Scenarios | View | ✓ | ✓ | ✓ |
| Alerts | View | ✓ | ✓ | ✓ |
| Alerts | Acknowledge | ✓ | ✓ | ✗ |
| Reports | View / Export | ✓ | ✓ | ✓ |

### Implementation
- Role stored in user record and included in JWT claims
- FastAPI dependency that extracts role from token and checks against endpoint requirement
- Unauthorized access returns 403 with no information leakage

## 4. API Security

### Input Validation
- **All** request bodies validated via Pydantic schemas
- String length limits enforced
- Numeric ranges validated (e.g., reservoir level, breach width)
- GeoJSON geometry validated for structure and reasonable bounds
- Query parameters type-checked and range-limited

### Rate Limiting
- Global: **100 requests/minute** per authenticated user
- Expensive operations (scenario run, observation fetch): **10 requests/minute**
- Login attempts: **5 per minute** per IP
- Rate limit headers included in responses (`X-RateLimit-Remaining`, `X-RateLimit-Reset`)
- Implementation: Redis-based sliding window counter

### CORS
- Allowed origins: configured per environment
- MVP: frontend origin only
- No wildcard (`*`) in production

### HTTPS
- All traffic over HTTPS in production
- HSTS header enabled
- HTTP → HTTPS redirect

### Request Headers
- `Content-Type` enforcement
- `X-Request-ID` generated per request for tracing
- Unnecessary headers stripped from responses

## 5. Secrets Management

### MVP Approach
- Secrets stored as **environment variables**
- Never committed to version control
- `.env` file for local development (in `.gitignore`)
- Docker Compose: environment section or `.env` file

### Secrets Inventory
| Secret | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET_KEY` | JWT signing key |
| `SATELLITE_API_KEY` | Copernicus / Sentinel API credentials |
| `OBJECT_STORAGE_KEY` | MinIO / S3 access credentials |

### Rules
- JWT secret: minimum 256-bit random value
- Rotate secrets on any suspected compromise
- Never log secret values
- Never include secrets in API responses

## 6. File Upload Security

MVP has limited file upload (potential manual observation upload post-MVP):

- **File type validation:** Allow only GeoTIFF, GeoJSON, PNG, JPEG
- **File size limit:** 100 MB max per file
- **Filename sanitization:** Strip path traversal characters, generate UUID-based storage names
- **Virus scan:** Not required for MVP; add when accepting public uploads
- **Storage isolation:** Uploaded files stored in object storage, never on application server filesystem

## 7. Data Validation

### Input Validation Rules
| Data Type | Validation |
|---|---|
| Coordinates | Latitude: -90 to 90; Longitude: -180 to 180 |
| Dates | Valid ISO 8601; not in the future (for observations) |
| GeoJSON | Valid structure; polygon area < 10,000 km² (reasonable monitoring area) |
| Dam name | 1–200 characters; alphanumeric + spaces + common punctuation |
| Scenario params | Positive numbers within physically reasonable ranges |
| Email | RFC 5322 compliant |
| Pagination | page ≥ 1; page_size 1–100 |

### Output Sanitization
- No raw database errors exposed to client
- Stack traces only in development mode
- User-facing error messages are generic; details logged server-side

## 8. Audit Logging

### Audited Operations
| Operation | Logged Fields |
|---|---|
| Login (success/failure) | User, IP, timestamp, result |
| Dam created / modified / deleted | User, dam ID, changes, timestamp |
| Scenario created / run | User, scenario ID, parameters, timestamp |
| Alert acknowledged | User, alert ID, timestamp |
| Status change | Dam ID, old status, new status, reasons, timestamp |
| User created / role changed | Admin user, target user, changes, timestamp |

### Storage
- Audit logs stored in a separate database table (`audit_logs`)
- Retention: 1 year minimum
- Immutable: append-only, no updates or deletes
- Queryable by user, resource type, date range

## 9. Encryption

### In Transit
- TLS 1.2+ for all external connections
- Internal services (MVP, single server): unencrypted is acceptable within Docker network
- Production: TLS between all components

### At Rest
- Database: PostgreSQL encryption at rest (filesystem-level or managed DB encryption)
- Object storage: server-side encryption (MinIO supports SSE)
- Backups: encrypted

### Sensitive Fields
- Password hashes: bcrypt (not reversible)
- JWT tokens: signed with HMAC-SHA256
- External API keys: encrypted in database or environment variables

## 10. Background Job Security

- Workers authenticate to Redis with password
- Job payloads do not contain secrets (reference by ID, not inline)
- Failed job logs do not expose sensitive data
- Job results sanitized before storage

## 11. External API Key Handling

### Satellite Provider Credentials
- Stored as environment variables
- Never logged
- Never included in job payloads
- Used only within the satellite provider service
- Token refresh handled within provider abstraction

### Rate Limiting for External APIs
- Respect external API rate limits
- Implement backoff when rate-limited
- Track usage to avoid exceeding quotas

## 12. Privacy

### Data Minimization
- Collect only necessary user data (email, name, role)
- No tracking or analytics beyond audit logs
- No third-party analytics in MVP

### Data Access
- Users can only access dams and data they are authorized for
- Admin can view all data
- No public API endpoints (authentication required for everything)

## 13. Data Retention

| Data Type | Retention | Rationale |
|---|---|---|
| User accounts | Until deleted | Active user management |
| Dam records | Indefinite | Historical reference |
| Observations | Indefinite | Historical monitoring record |
| Changes | Indefinite | Change history |
| Scenarios | Indefinite | Scenario library |
| Alerts | Indefinite | Audit trail |
| Reports | Indefinite | Monitoring record |
| Audit logs | 1 year minimum | Compliance |
| Session tokens | Until expiry | Automatic cleanup |
| Background job logs | 30 days | Debugging |

## 14. Security Checklist (MVP)

- [ ] JWT authentication implemented
- [ ] Password hashing with bcrypt
- [ ] Role-based access control on all endpoints
- [ ] Pydantic validation on all inputs
- [ ] Rate limiting on login and expensive operations
- [ ] CORS configured correctly
- [ ] Secrets in environment variables, not code
- [ ] Audit logging for sensitive operations
- [ ] No secrets in logs
- [ ] HTTPS in production
- [ ] SQL injection prevention (parameterized queries via ORM)
- [ ] No raw error details in API responses
