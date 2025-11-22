# Changelog - Maritime Training Mission Control Dashboard

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Phase 1: Foundation & Infrastructure
*In Progress - Target: Day 1*

#### Added
- Initial project documentation structure
- task.md for implementation tracking
- changelog.md for version history
- debug.md for troubleshooting log

#### Planned
- Prisma schema with all data models
- JWT authentication system with refresh tokens
- Docker Compose configuration for all services
- Redis integration for caching and sessions
- Environment variable configuration

---

## [0.1.0] - 2024-11-22

### Added
- Project initialization
- Base folder structure as per CLAUDE.md constraints
- Documentation files:
  - PRD.md (Product Requirements Document)
  - system-architecture.md
  - api-swagger.md
  - erd.md (Entity Relationship Diagram)
  - folder-structure.md
  - style.md (UI theme configuration)
  - README.md

### Project Setup
- Frontend: Next.js 15+ with App Router structure
- Backend: Express.js with TypeScript
- Database: PostgreSQL with Prisma ORM
- Cache: Redis for sessions
- Containerization: Docker Compose

### Configuration
- CLAUDE.md implementation guidelines
- Strict technology constraints defined
- MVP-first development strategy
- Dark sci-fi UI theme (mission-control-life-support palette)

---

## Version History

### Versioning Strategy
- **0.x.x** - Development/MVP phase
- **1.0.0** - First production release with core features
- **1.x.x** - Feature additions and enhancements
- **2.0.0** - Major architectural changes (if needed)

### Release Milestones
- **v0.1.0** - Project setup and documentation
- **v0.2.0** - Foundation & Infrastructure (Phase 1)
- **v0.3.0** - Core Backend APIs (Phase 2)
- **v0.4.0** - Frontend Foundation (Phase 3)
- **v0.5.0** - Core Frontend Features (Phase 4)
- **v0.6.0** - Dashboard & Real-time (Phase 5)
- **v1.0.0** - Production Release (Phase 6)

---

## Change Categories

### Added
New features or capabilities

### Changed
Changes in existing functionality

### Deprecated
Soon-to-be removed features

### Removed
Removed features

### Fixed
Bug fixes

### Security
Security vulnerability fixes

---

## Commit Convention

All commits follow conventional commit format:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only changes
- `style:` Changes that don't affect code meaning
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `perf:` Performance improvement
- `test:` Adding missing tests
- `chore:` Changes to build process or auxiliary tools

---

## Notes

- All changes must comply with CLAUDE.md constraints
- No unauthorized technology additions
- MVP features only until explicitly approved
- Maintain backward compatibility where possible
- Document breaking changes prominently

---

*This changelog is maintained as part of the Maritime Training Mission Control Dashboard project for Singapore's defense education sectors.*