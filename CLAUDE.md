# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **MDS EDC UI** - a Next.js frontend for the Mobility Data Space (MDS) Eclipse Dataspace Connector (EDC). It provides a web interface for managing EDC connectors, data assets, policies, and contract negotiations in the mobility data space ecosystem.

## Development Commands

### Local Development
```bash
# Start local development server
yarn dev

# Seed the database (run before first dev start)
yarn seed

# Build for production
yarn build

# Start production server
yarn start

# Lint code
yarn lint
```

### Docker Development
```bash
# Local setup (connector only, frontend runs locally)
docker compose -f docker-compose.connector.yml up -d

# Dev setup (full Docker environment)
docker compose -f docker-compose.dev.yml up -d

# Demo setup (2-participant simulation)
docker-compose -f docker-compose.demo.yml up -d
```

### Testing
```bash
# Run Playwright E2E tests
npx playwright test

# Run tests in headed mode
npx playwright test --headed

# Open Playwright UI
npx playwright test --ui
```

## Environment Configuration

The application requires specific environment variables to connect to EDC instances. Use `.envrc.example` as a template:

- **EDC_ID**: Connector identifier (format: MDSXXXXX.YYYYY)
- **EDC_MANAGEMENT_URL**: EDC Management API endpoint
- **EDC_DEFAULT_URL**: EDC Default API endpoint
- **EDC_PROTOCOL_URL**: EDC DSP Protocol endpoint
- **EDC_PUBLIC_URL**: EDC Public API endpoint
- **EDC_MANAGEMENT_API_KEY**: API key for management operations
- **MDS_DAPS_URL**: MDS DAPS service URL
- **MDS_DAPS_JWKS_URL**: MDS DAPS JWKS endpoint

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **UI Library**: Material-UI (MUI) v7 + Tailwind CSS
- **Forms**: Formik for form management
- **Internationalization**: next-i18next (supports EN, DE, CN)
- **Testing**: Playwright for E2E tests
- **EDC Integration**: @think-it-labs/edc-connector-client

### Directory Structure
- **src/app/**: Next.js App Router pages and API routes
- **src/components/**: Reusable React components
- **src/hooks/**: Custom React hooks
- **src/constants/**: Application constants and data categories
- **src/utilities/**: Helper functions and utilities
- **src/types/**: TypeScript type definitions
- **src/jsonld/**: JSON-LD schemas and processors
- **vendors/**: Third-party packages (think-it-labs EDC connector UI)

### Key Pages
- **Dashboard**: Main overview page (root redirects here)
- **Connector Management**: EDC connector configuration
- **Version**: System version information

## Important Patterns

### Path Aliases
- `@/*` maps to `./src/*`
- `@think-it-labs/edc-connector-ui/*` maps to `./vendors/think-it-labs/edc-connector-ui/src/*`

### Internationalization
The app supports multiple locales (en, de, cn) with next-i18next. Default locale is English.

### Docker Integration
The app builds as a standalone Next.js output for containerization. Three deployment modes are supported via different Docker Compose files.

### Testing Setup
Playwright tests run against `http://127.0.0.1:3000` with automatic server startup. Tests include Docker service orchestration for E2E scenarios.

## EDC Integration

This UI is specifically designed for MDS (Mobility Data Space) EDC connectors and includes:
- Data asset management
- Contract agreement workflows  
- Transfer process monitoring
- Policy definition and management
- Catalog browsing and negotiation

The UI communicates with EDC instances via REST APIs using the think-it-labs connector client library.