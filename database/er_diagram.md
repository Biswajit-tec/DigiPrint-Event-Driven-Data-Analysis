# DigiPrint ER Diagram

## Visual Representation

```
┌─────────────────────────────┐
│         USERS               │
├─────────────────────────────┤
│ PK: id (SERIAL)            │
│     username               │
│     email                  │
│     created_at             │
│     consent_status         │
│     last_active            │
└─────────────────┬───────────┘
                  │
                  │ 1
                  │
                  │ has
                  │
                  │ N
                  ▼
┌─────────────────────────────┐
│        SESSIONS             │
├─────────────────────────────┤
│ PK: id (UUID)              │
│ FK: user_id                │
│     start_time             │
│     end_time               │
│     duration_seconds       │
│     device_info (JSONB)    │
│     ip_hash                │
└─────────────────┬───────────┘
                  │
                  │ 1
                  │
                  │ contains
                  │
                  │ N
                  ▼
┌─────────────────────────────┐
│         EVENTS              │
├─────────────────────────────┤
│ PK: id (BIGSERIAL)         │
│ FK: session_id             │
│     event_type             │
│     timestamp              │
│     metadata (JSONB)       │
│     ip_hash                │
└─────────────────────────────┘
```

## Cardinality Notation

- **USER → SESSION**: 1:N (One-to-Many)
  - One user can have multiple sessions
  - Each session belongs to exactly one user

- **SESSION → EVENT**: 1:N (One-to-Many)
  - One session can contain multiple events
  - Each event belongs to exactly one session

## Key Constraints

- **Primary Keys (PK)**: Uniquely identify each record
  - users.id: SERIAL (auto-incrementing integer)
  - sessions.id: UUID (universally unique identifier)
  - events.id: BIGSERIAL (large auto-incrementing integer)

- **Foreign Keys (FK)**: Enforce referential integrity
  - sessions.user_id → users.id (ON DELETE CASCADE)
  - events.session_id → sessions.id (ON DELETE CASCADE)

## Relationship Semantics

1. **USER-SESSION Relationship**
   - Type: Identifying (session cannot exist without user)
   - Cascade: Deleting a user deletes all their sessions
   - Business Logic: User authentication creates session

2. **SESSION-EVENT Relationship**
   - Type: Identifying (event cannot exist without session)
   - Cascade: Deleting a session deletes all its events
   - Business Logic: Events tracked within session context

This ER design ensures 3NF compliance while maintaining efficient query patterns for time-series analytics.
