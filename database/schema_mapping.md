# Database Schema Mapping Documentation

## ER → Relational Schema Mapping

### Entity-Relationship Design

**Entities:**
1. **USER** - Represents platform users
2. **SESSION** - Represents browsing/usage sessions
3. **EVENT** - Represents discrete digital footprint actions

**Relationships:**
- USER (1) → SESSION (Many): One user can have multiple sessions
- SESSION (1) → EVENT (Many): One session can contain multiple events

### Cardinalities

```
USER ────┬──── (1:N) ────┬──── SESSION ────┬──── (1:N) ────┬──── EVENT
         │               │                  │               │
      (PK: id)        (FK: user_id)      (PK: id)      (FK: session_id)
```

## Relational Schema

### Users Table
```sql
users (
    id              [PK, SERIAL],
    username        [UNIQUE, NOT NULL],
    email           [UNIQUE, NOT NULL],
    created_at      [DEFAULT NOW()],
    consent_status  [BOOLEAN],
    last_active     [TIMESTAMP]
)
```

### Sessions Table
```sql
sessions (
    id              [PK, UUID],
    user_id         [FK → users(id), NOT NULL],
    start_time      [DEFAULT NOW()],
    end_time        [TIMESTAMP, nullable],
    duration_seconds [INTEGER, computed via trigger],
    device_info     [JSONB],
    ip_hash         [VARCHAR(64)]
)
```

### Events Table
```sql
events (
    id              [PK, BIGSERIAL],
    session_id      [FK → sessions(id), NOT NULL],
    event_type      [VARCHAR(50), CHECK constraint],
    event_timestamp [DEFAULT NOW()],
    metadata        [JSONB],
    ip_hash         [VARCHAR(64)]
)
```

## Normalization (3NF Compliance)

### First Normal Form (1NF)
✅ All attributes contain atomic values
✅ No repeating groups
✅ Each column contains single value type

### Second Normal Form (2NF)
✅ Already in 1NF
✅ All non-key attributes fully dependent on primary key
✅ No partial dependencies (all PKs are single column)

### Third Normal Form (3NF)
✅ Already in 2NF
✅ No transitive dependencies
✅ duration_seconds in sessions is computed (derived) but acceptable for performance
✅ last_active in users is denormalized for quick lookups (trade-off documented)

## Metadata Design Rationale

### Why JSON Storage?

**Choice:** `metadata` stored as JSONB in events table

**Rationale:**
1. **Flexibility**: Different event types require different attributes
   - `login`: `{attempt_number, success, auth_method}`
   - `click`: `{element_id, page_url, coordinates}`
   - `search`: `{query, results_count, filters}`
   
2. **Schema Evolution**: Adding new event types doesn't require migrations

3. **Query Performance**: PostgreSQL JSONB supports indexing and efficient queries

4. **Storage Efficiency**: Sparse attributes don't waste space

**Trade-offs:**
- ❌ Less strict type enforcement
- ❌ Requires application-level validation
- ✅ Extreme flexibility for event-driven systems
- ✅ No schema changes for new event types
- ✅ GIN indexing available if needed

### Normalized Alternative (Not Chosen)
```sql
-- This approach would require:
event_attributes (
    id, 
    event_id FK,
    attribute_name,
    attribute_value
)
-- Problems: Many JOINs, complex queries, poor performance
```

## Design Decisions

### 1. User Consent Tracking
- **consent_status** field ensures GDPR/privacy compliance
- Events only collected from consenting users

### 2. IP Hashing
- Store `ip_hash` instead of raw IP addresses
- Privacy-first approach using SHA-256 hashing

### 3. UUID for Sessions
- Using UUID instead of SERIAL for session IDs
- Better for distributed systems and prevents guessing

### 4. BIGSERIAL for Events
- Expecting high volume of events (millions+)
- BIGSERIAL accommodates large-scale data

### 5. Denormalization: last_active
- Stored in users table for quick dashboard queries
- Updated via trigger (update_user_last_active)
- Trade-off: slight redundancy for major performance gain

### 6. Denormalization: duration_seconds
- Computed and stored in sessions table
- Avoids repeated calculations in analytics queries
- Updated automatically via trigger

## Performance Optimizations

See `indexes.sql` for detailed indexing strategy:
- B-tree indexes on timestamp columns
- Composite indexes for session queries
- Partial indexes for recent data (30-day window)
- GIN indexes available for JSONB queries

## Scalability Considerations

**Current Capacity:**
- Users: 1M+ (SERIAL)
- Sessions: Virtually unlimited (UUID)
- Events: 9.2 quintillion (BIGSERIAL)

**Future Archival Strategy:**
- Partition events table by timestamp (monthly/yearly)
- Move old events to archive tables
- Maintain recent data in hot storage
