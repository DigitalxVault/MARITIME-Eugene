# Debug Log - Maritime Training Mission Control Dashboard

This document tracks debugging steps, common issues, and their solutions during development.

---

## Quick Debugging Commands

### Check Service Status
```bash
# Check all Docker services
docker-compose ps

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
docker-compose logs -f redis

# Check network connectivity
docker-compose exec backend ping postgres
docker-compose exec backend ping redis
```

### Database Debugging
```bash
# Access PostgreSQL directly
docker-compose exec postgres psql -U postgres -d mission_control

# Check Prisma migrations
cd backend
npx prisma migrate status

# Reset database (WARNING: destroys all data)
npx prisma migrate reset

# Open Prisma Studio for visual debugging
npx prisma studio
```

### Backend Debugging
```bash
# Check backend health
curl http://localhost:4000/health

# Test JWT token generation
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@navytraining.sg","password":"Admin123!"}'

# Check Redis connection
docker-compose exec redis redis-cli ping
```

### Frontend Debugging
```bash
# Check build errors
cd frontend
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Check for linting issues
npm run lint
```

---

## Common Issues & Solutions

### Issue #001: Database Connection Failed
**Date**: TBD
**Symptoms**:
- Error: `P1001: Can't reach database server`
- Backend fails to start

**Solution**:
1. Check DATABASE_URL in .env file
2. Ensure PostgreSQL container is running: `docker-compose ps`
3. Verify port 5432 is not already in use
4. Restart database: `docker-compose restart postgres`

**Root Cause**: [To be determined]

---

### Issue #002: JWT Token Not Being Set
**Date**: TBD
**Symptoms**:
- Login succeeds but subsequent requests fail with 401
- Cookie not visible in browser DevTools

**Solution**:
1. Ensure httpOnly cookie configuration is correct
2. Check CORS settings allow credentials
3. Verify frontend includes credentials in fetch requests
4. Check cookie domain/path settings

**Root Cause**: [To be determined]

---

### Issue #003: Redis Connection Timeout
**Date**: TBD
**Symptoms**:
- Session management fails
- Cache operations timeout

**Solution**:
1. Check REDIS_URL in .env
2. Verify Redis container is running
3. Test connection: `docker-compose exec redis redis-cli ping`
4. Check Redis memory usage: `docker-compose exec redis redis-cli INFO memory`

**Root Cause**: [To be determined]

---

### Issue #004: Prisma Migration Conflicts
**Date**: TBD
**Symptoms**:
- Migration fails with conflict error
- Schema drift detected

**Solution**:
1. Check migration history: `npx prisma migrate status`
2. Resolve conflicts manually in schema.prisma
3. Create new migration: `npx prisma migrate dev --name fix_conflicts`
4. If severe, reset: `npx prisma migrate reset` (WARNING: data loss)

**Root Cause**: [To be determined]

---

### Issue #005: Frontend Build Failures
**Date**: TBD
**Symptoms**:
- TypeScript compilation errors
- Module not found errors

**Solution**:
1. Clear Next.js cache: `rm -rf .next`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check import paths match folder structure
4. Verify all required environment variables are set

**Root Cause**: [To be determined]

---

## Performance Issues

### Slow API Response Times
**Debugging Steps**:
1. Check database query performance in Prisma Studio
2. Add logging to measure service layer timing
3. Monitor Redis hit/miss ratio
4. Check for N+1 query problems
5. Use Prisma query optimization (select, include)

### High Memory Usage
**Debugging Steps**:
1. Monitor Docker container stats: `docker stats`
2. Check for memory leaks in Node.js
3. Review Redis memory settings
4. Optimize Prisma connection pool
5. Check for unnecessary data fetching

### Frontend Performance
**Debugging Steps**:
1. Use React DevTools Profiler
2. Check bundle size: `npm run build`
3. Identify heavy components
4. Review TanStack Query cache settings
5. Optimize images and static assets

---

## Security Debugging

### Authentication Issues
- Check JWT secret in environment variables
- Verify token expiry settings
- Test refresh token flow
- Check bcrypt salt rounds (should be 10)

### CORS Issues
- Verify CORS_ORIGIN in backend
- Check credentials flag in CORS config
- Test with explicit origin instead of wildcard
- Check preflight requests in network tab

### Rate Limiting
- Check rate limit settings in environment
- Test with different IP addresses
- Verify Redis is storing rate limit data
- Check rate limit window configuration

---

## Docker Debugging

### Container Won't Start
```bash
# Check container logs
docker-compose logs [service_name]

# Rebuild containers
docker-compose build --no-cache

# Remove all containers and volumes (WARNING: data loss)
docker-compose down -v

# Check Docker daemon
docker info
```

### Network Issues Between Containers
```bash
# Inspect network
docker network inspect mission-control-dashboard_mission-control-network

# Test connectivity
docker-compose exec backend ping postgres
docker-compose exec backend nc -zv postgres 5432
```

---

## Environment Variable Issues

### Missing Variables
Common missing variables and their defaults:
- NODE_ENV=development
- JWT_SECRET (no default - must set)
- DATABASE_URL (must match Docker service names)
- REDIS_URL=redis://redis:6379

### Variable Not Loading
1. Check .env file exists
2. Restart services after changing .env
3. Verify no typos in variable names
4. Check for spaces around = in .env file

---

## Debugging Tools

### Recommended VS Code Extensions
- Prisma
- Thunder Client (API testing)
- Docker
- ESLint
- Tailwind CSS IntelliSense

### Browser Extensions
- React Developer Tools
- Redux DevTools (for TanStack Query)
- EditThisCookie (for JWT debugging)

### Command Line Tools
- `curl` - API testing
- `jq` - JSON parsing
- `httpie` - Better HTTP client
- `dive` - Docker image inspection

---

## Error Codes Reference

### Backend Error Codes
- `AUTH001` - Invalid credentials
- `AUTH002` - Token expired
- `AUTH003` - Insufficient permissions
- `VAL001` - Validation failed
- `DB001` - Database operation failed
- `CACHE001` - Redis operation failed

### Frontend Error Codes
- `FETCH001` - Network request failed
- `PARSE001` - JSON parsing error
- `AUTH001` - Authentication required
- `PERM001` - Permission denied

---

## Logging Strategy

### Backend Logs
- Location: Console output (docker-compose logs)
- Levels: ERROR, WARN, INFO, DEBUG
- Format: `[timestamp] [level] [service] message`

### Frontend Logs
- Development: Browser console
- Production: Consider error tracking service
- Key areas: API calls, auth flow, state changes

---

## Testing Checklist

Before marking issue as resolved:
- [ ] Issue reproduced locally
- [ ] Fix implemented
- [ ] Manual testing passed
- [ ] No regression in related features
- [ ] Documentation updated if needed
- [ ] Changelog entry added

---

## Notes

- Always check Docker logs first for container issues
- Use Prisma Studio for database debugging
- Browser DevTools Network tab is essential for API debugging
- Keep this document updated with new issues and solutions
- Tag issues with date and resolution status

---

*Last Updated: November 22, 2024*
*Status: Initial setup - no issues logged yet*