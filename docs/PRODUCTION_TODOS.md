# Production Readiness

## Security
- [ ] Add authentication (JWT/OAuth)
- [ ] Rate limiting on API endpoints
- [ ] HTTPS + HSTS
- [ ] Input validation

## Scalability
- [ ] Database indexing optimization
- [ ] Redis caching for stats endpoint
- [ ] Pagination on all list endpoints
- [ ] Background jobs/queue for heavy tasks
- [ ] Connection pooling

## Monitoring
- [ ] Error tracking (Sentry)
- [ ] Structured logging
- [ ] Health check endpoint
- [ ] DD APM (e.g. Datadog) + Alerts

## Testing
- [ ] Unit tests
- [ ] Integration tests for API

## DevOps
- [ ] CI/CD pipeline

## Data / Reliability
- [ ] Migrations + rollback plan
- [ ] PII handling/encryption at rest

## FE improvements
- [ ] Client-side caching strategy (TanStack Query/Apollo)
- [ ] Request cancellation + deduping (AbortController) to prevent race conditions 
- [ ] Code splitting / lazy loading for heavy routes/components 
- [ ] Virtualize large tables/lists (performance)
- [ ] Global error boundary + standardized loading/empty/error states 
- [ ] Front-end monitoring: Sentry + Web Vitals (LCP/INP/CLS) 
- [ ] Accessibility checks (keyboard nav, focus management)
- [ ] Testing: Unit/Component (Vitest/Jest + React Testing Library) + E2E (Playwright or Cypress)