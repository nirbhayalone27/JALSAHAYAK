# JalSahayak — ZERO (What We Will NOT Build)

> Version: 1.0 | Status: Active | Last updated: 2026-10-08

---

## The ZERO Principle

> *"If it does not improve dam monitoring, flood understanding, impact analysis, alerts, or reporting, it probably does not belong in the MVP."*

This document lists things that are **explicitly prohibited** from the MVP. Do not build them. Do not plan them. Do not allocate time for them.

---

## Prohibited Features

### ❌ Generic Chatbot
No conversational AI assistant. Users do not need to "chat" with their dam monitoring system. They need clear data, clear status, and clear alerts.

### ❌ Social Feed
No activity feed, comments, likes, or social features. This is a monitoring tool, not a social platform.

### ❌ Unnecessary 3D Globe
No WebGL globe visualization. A 2D map with proper overlays is sufficient and performant. A 3D globe adds loading time and complexity without adding monitoring value.

### ❌ Crypto / Blockchain
No blockchain for data integrity, no cryptocurrency, no tokens. PostgreSQL with audit logs provides sufficient data integrity for this use case.

### ❌ NFTs
No NFTs for anything — not for reports, not for observations, not for alerts. This is self-explanatory.

### ❌ Complex Gamification
No points, badges, leaderboards, or achievement systems. Dam monitoring is serious operational work, not a game.

### ❌ Excessive AI Agents
No swarm of autonomous AI agents making decisions. AI assists human interpretation (see AI_SYSTEMS.md). Humans make safety decisions.

### ❌ Fake Digital Twin Marketing
Do not label the system a "digital twin" unless it actually maintains a synchronized, physics-accurate digital representation of a physical dam. MVP does not do this. Using the term is misleading.

### ❌ Fake Real-Time Alerts
Do not claim real-time alerting when satellite revisit times are hours to days and processing adds further latency. Use "latest available" or "near-real-time" with honest latency disclosure.

### ❌ Fake Accuracy Dashboards
No accuracy percentage displays that are not backed by validation. No "99.7% detection rate" without a validated test dataset. Unvalidated numbers erode trust.

### ❌ Unnecessary Microservices
No Kubernetes cluster, no service mesh, no API gateway chain — for an MVP that monitors 50 dams. A modular monolith on Docker Compose is the correct architecture.

### ❌ Dozens of Dashboards
No dashboard sprawl. The user flow has fewer than 10 screens. Each screen serves one purpose. No "analytics dashboard," "executive dashboard," "admin dashboard," "monitoring dashboard" — just one coherent interface.

### ❌ Features Unrelated to Dam Monitoring
No weather forecasting. No earthquake monitoring. No air quality. No traffic. No generic disaster management. JalSahayak monitors dams and analyses flood impact. That's it.

### ❌ Features Just Because Competitors Have Them
Do not add a feature simply because another platform has it. Every feature must pass the Director's test: *"Does this help monitor a dam, detect a change, estimate flood impact, generate an alert, or produce a report?"*

---

## Prohibited Technical Choices

### ❌ Unnecessary Dependencies
Do not add npm packages or Python libraries without clear justification. Prefer standard library where sufficient. Every dependency is a maintenance and security burden.

### ❌ Custom Implementations of Solved Problems
Do not write a custom geospatial library when GDAL exists. Do not write a custom ORM when SQLAlchemy exists. Do not write a custom auth system when JWT + bcrypt exists.

### ❌ Premature Optimization
Do not build caching layers, CDNs, or read replicas for MVP. Optimize when actual performance problems are measured.

### ❌ Multiple Frontend Frameworks
One framework: React. No mixing with Vue, Svelte, Angular, or other frameworks.

### ❌ Multiple Backend Languages
One language: Python. No mixing with Go, Rust, Java, or Node.js for the backend.

---

## The Test

Before adding ANY feature, component, or dependency, ask:

```
1. Does this directly improve dam monitoring?         → If no, stop.
2. Does this directly improve flood understanding?     → If no, stop.
3. Does this directly improve impact analysis?         → If no, stop.
4. Does this directly improve alerts?                  → If no, stop.
5. Does this directly improve reporting?               → If no, stop.
6. Is this required for the core loop to function?     → If no, defer to LATER.
```

If a feature fails all six questions, it does not belong in JalSahayak MVP.

---

## When ZERO Can Be Overridden

ZERO can only be overridden by:

1. A documented decision in `PRODUCT_DECISIONS.md` with clear rationale
2. Approval from the project owner
3. Evidence that the feature directly serves the core monitoring loop

The burden of proof is on the person proposing the addition, not on ZERO.
