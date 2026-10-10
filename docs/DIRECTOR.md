# JalSahayak — Project Director

> Version: 1.0 | Status: Active | Last updated: 2026-10-08

---

## Project Goal

**BUILD A REALISTIC, FOCUSED DAM-MONITORING AND FLOOD-INTELLIGENCE MVP.**

This is the singular goal. Every feature, decision, and line of code must serve this goal.

---

## Director Authority

The Director is the highest authority in the JalSahayak project. When conflicts arise between agents, documents, or priorities, the Director's principles resolve them.

**Document hierarchy:**
```
DIRECTOR.md          ← Final authority
      ↓
PRD.md               ← Product scope
      ↓
PRODUCT_DECISIONS.md ← Decision log
      ↓
TRD.md               ← Technical spec
      ↓
ARCHITECTURE.md      ← System design
      ↓
API.md               ← Contracts
      ↓
TASKS.md             ← Work items
      ↓
Implementation
```

---

## Director Responsibilities

### 1. Protect Product Scope
- JalSahayak does ONE thing well: dam monitoring + flood intelligence
- Features must directly support the core monitoring loop
- Refer to ZERO.md for what is explicitly prohibited

### 2. Prevent Feature Creep
- Every proposed feature must answer: *"Does this help monitor a dam, detect a change, estimate flood impact, generate an alert, or produce a report?"*
- If the answer is no, the feature does not belong in MVP
- Post-MVP features go to NEXT or LATER in TASKS.md

### 3. Prioritize MVP
- The MVP proves one complete loop for one dam
- No advanced feature should be built before the core loop works end-to-end
- Phase ordering in ROADMAP.md is mandatory — do not skip phases

### 4. Resolve Conflicts Between Agents
- **Product vs Technical:** Product defines WHAT; Architecture defines HOW. Neither overrides the other's domain.
- **Speed vs Quality:** For MVP, working correctly is more important than working fast. Optimize later.
- **Real vs Synthetic:** Synthetic data is acceptable for MVP. Real data integration follows in later phases.
- **AI vs Physics:** When in doubt, trust physics. AI explains; physics simulates.

### 5. Maintain Architecture Consistency
- All services must follow the modular monolith pattern
- All providers must implement abstract interfaces
- All data must flow through defined service layers
- No shortcuts that bypass the architecture (e.g., direct DB access from routes)

### 6. Ensure Scientific Honesty
- No invented accuracy numbers
- No fake real-time claims
- No AI-predicted dam failure claims
- Limitations stated in every report
- Synthetic data always labelled
- Confidence levels always included

### 7. Ensure Every Feature Maps to a User Problem
- "As a dam safety engineer, I need to..." must precede every feature
- If no user problem is solved, the feature is rejected
- Refer to PRD.md use cases (UC-1 through UC-7)

---

## Priority Order

When priorities conflict, follow this order:

| Priority | Principle | Example |
|---|---|---|
| **1** | Core product value | The monitoring loop works end-to-end |
| **2** | Data correctness | Observations, changes, and alerts are accurate |
| **3** | Reliability | System does not lose data; jobs do not silently fail |
| **4** | Simple UX | User finds what they need in ≤3 clicks |
| **5** | Performance | System responds within acceptable time |
| **6** | Advanced features | Better AI, more data sources, cascade analysis |

**Priority 1 always beats Priority 6.** Do not build advanced features before the core loop works.

---

## Decision Framework

When a decision is needed, apply these filters in order:

```
1. Does it serve the core monitoring loop?
   No → Reject or defer

2. Is it in the current phase scope?
   No → Move to NEXT/LATER in TASKS.md

3. Does it contradict existing decisions?
   Yes → Resolve in PRODUCT_DECISIONS.md first

4. Can it be done simply?
   If a simpler approach exists, use it

5. Is it scientifically honest?
   No → Reject

6. Does it have a clear user benefit?
   No → Reject or defer
```

---

## Project Health Checks

Periodically verify:

- [ ] **Core loop integrity:** Can a dam be monitored end-to-end?
- [ ] **Data integrity:** Is synthetic data properly labelled? Are observations stored correctly?
- [ ] **Architecture compliance:** Are services following the defined patterns?
- [ ] **Documentation sync:** Do the docs match the implementation?
- [ ] **Test coverage:** Are critical paths tested?
- [ ] **Scope discipline:** Are we building only what's needed?
- [ ] **Scientific honesty:** Are claims supported by evidence?

---

## Escalation Path

```
Developer / Agent
      ↓
CODING_STANDARDS.md / RULES.md  (code-level guidance)
      ↓
ARCHITECTURE.md / API.md        (design-level guidance)
      ↓
PRODUCT_DECISIONS.md             (decision-level guidance)
      ↓
PRD.md                           (scope-level guidance)
      ↓
DIRECTOR.md                      (final authority)
```

If a question cannot be resolved by any document, it becomes a **pending decision** logged in MEMORY.md and resolved by the project owner.
