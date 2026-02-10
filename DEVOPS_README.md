# DevOps Documentation - AgriTech Marketplace Platform

**Multilingual Digital Marketplace for Indian Farmers**

| Document Info | |
|---------------|---------------|
| Version | 1.0 |
| Date | February 11, 2026 |
| Status | Active |
| Project Type | MERN Stack Application |

---

## Table of Contents

- [Introduction](#introduction)
- [Project Overview](#project-overview)
- [Architecture Overview](#architecture-overview)
- [Development Environment Setup](#development-environment-setup)
- [Source Code Management Strategy](#source-code-management-strategy)
- [CI/CD Pipeline](#cicd-pipeline)
- [Deployment Strategy](#deployment-strategy)
- [Component-wise DevOps Strategy](#component-wise-devops-strategy)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Security & Compliance](#security--compliance)
- [Monitoring & Logging](#monitoring--logging)
- [Troubleshooting Guide](#troubleshooting-guide)
- [Tools & Technologies](#tools--technologies)
- [Maintenance & Updates](#maintenance--updates)

---

## Introduction

This document defines the DevOps strategy for **AgriTech Marketplace**, a comprehensive MERN stack platform that connects farmers directly with buyers, eliminating intermediaries. The strategy covers continuous integration, deployment practices, and operational excellence for both development and production environments.

**Key Objectives:**
- Streamline development workflow
- Automate testing and deployment
- Ensure high availability and performance
- Maintain security and compliance
- Enable rapid iteration and feature releases

---

## Project Overview

### Repository Structure

```
SE_3-2/
├── backend/              # Node.js Express server
├── frontend/             # React Vite application
├── UML_diagrams/        # Architecture documentation
├── README.md            # Project README
└── DEVOPS_README.md     # This file
```

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React 18 | 18.x |
| **Frontend Build** | Vite | 4.x |
| **Styling** | TailwindCSS | 3.x |
| **Backend** | Node.js | 18+ |
| **Backend Framework** | Express.js | 4.x |
| **Database** | MongoDB | 5.0+ |
| **Real-time Communication** | Socket.IO | 4.x |
| **Authentication** | JWT | - |
| **Package Manager** | npm | 9+ |

### Key Features

- **Farmer Dashboard**: Crop listing, price tracking, order management
- **Buyer Dashboard**: Market search, crop discovery, bidding
- **Real-time Auctions**: Live bidding with Socket.IO
- **Multilingual Support**: UI translation system
- **Market Analytics**: Price charts and market trends
- **Negotiation System**: Farmer-buyer communication
- **Role-based Access Control**: Admin, Farmer, Buyer roles

---

## Architecture Overview

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │    React Frontend (Vite + TailwindCSS)           │  │
│  │  - Responsive UI (Desktop & Mobile)              │  │
│  │  - Multilingual Components                       │  │
│  │  - Real-time Socket.IO Integration               │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓ HTTP/WebSocket
┌─────────────────────────────────────────────────────────┐
│                  API Layer                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │   Node.js + Express.js Server                    │  │
│  │  - RESTful API Endpoints                         │  │
│  │  - JWT Authentication Middleware                 │  │
│  │  - Request Validation & Error Handling           │  │
│  │  - CORS Configuration                            │  │
│  │  - Socket.IO Server for Real-time Events         │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
         ↓ Query/Data                    ↓ Authentication
┌──────────────────────┐    ┌──────────────────────────┐
│   Database Layer     │    │  External Services       │
│                      │    │                          │
│  MongoDB             │    │  - Email Service         │
│  - Collections:      │    │  - Payment Gateway       │
│    • Users           │    │  - Translation API       │
│    • Crops           │    │  - SMS Notifications     │
│    • Orders          │    │                          │
│    • Negotiations     │    │                          │
│    • Auctions        │    │                          │
└──────────────────────┘    └──────────────────────────┘
```

### Deployment Topology

```
Local Development
    ↓
Git Repository (GitHub)
    ↓
CI/CD Pipeline Trigger
    ↓ (Automated Tests & Build)
    ├→ Frontend Build (Vite)
    ├→ Backend Tests & Lint
    ├→ Security Scanning
    ↓
Staging Environment
    ↓ (Integration Testing)
    ↓
Production Environment
    ├→ Backend Server (Node.js)
    ├→ Frontend (Static Assets)
    └→ Database (MongoDB)
```

---

## Development Environment Setup

### Prerequisites

**System Requirements:**
- Node.js 18.x or higher
- npm 9.x or higher
- Git 2.30+
- MongoDB 5.0+ (local or remote)
- Code Editor: VS Code recommended

**Operating Systems Supported:**
- Windows 10/11
- macOS 11+
- Linux (Ubuntu 20.04+)

### Initial Setup

#### 1. Clone Repository
```bash
git clone <repository-url>
cd SE_3-2
```

#### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file with the following variables:
# DB_URI=mongodb://localhost:27017/agritech
# JWT_SECRET=your_jwt_secret_key
# NODE_ENV=development
# PORT=5000

npm run dev
```

#### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env file with the following variables:
# VITE_API_URL=http://localhost:5000
# VITE_SOCKET_URL=http://localhost:5000

npm run dev
```

#### 4. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **WebSocket**: ws://localhost:5000

### Environment Variables

#### Backend (.env)

```env
# Database
DB_URI=mongodb://localhost:27017/agritech
DB_NAME=agritech

# Server Configuration
PORT=5000
NODE_ENV=development
HOST=localhost

# Authentication
JWT_SECRET=your_secure_jwt_secret_key_here
JWT_EXPIRY=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# CORS & Security
CORS_ORIGIN=http://localhost:5173
API_RATE_LIMIT=100

# Email Service (if configured)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# External APIs
TRANSLATION_API_KEY=your_translation_api_key
PAYMENT_GATEWAY_KEY=your_payment_key

# Logging
LOG_LEVEL=debug
LOG_FORMAT=json
```

#### Frontend (.env)

```env
# API Configuration
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_VOICE_INPUT=true

# Localization
VITE_DEFAULT_LANGUAGE=en
VITE_SUPPORTED_LANGUAGES=en,hi,mr,ta

# Environment
VITE_ENV=development
VITE_LOG_LEVEL=debug
```

---

## Source Code Management Strategy

### Git Workflow

#### Branch Strategy: Git Flow

```
main (Production)
  ↑
  ├—— release/v1.0.0
  |      ↑
  |      └—— develop (Integration)
  |           ↑
  |           ├—— feature/auction-system
  |           ├—— feature/price-chart
  |           ├—— feature/multilingual
  |           ├—— bugfix/auth-issue
  |           └—— hotfix/security-patch
```

#### Branch Naming Conventions

| Branch Type | Pattern | Example |
|------------|---------|---------|
| Feature | `feature/feature-name` | `feature/auction-system` |
| Bugfix | `bugfix/bug-description` | `bugfix/login-validation` |
| Hotfix | `hotfix/issue-description` | `hotfix/security-patch` |
| Release | `release/v*.*.*` | `release/v1.0.0` |
| Develop | `develop` | - |
| Main | `main` | - |

#### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** feat, fix, docs, style, refactor, test, chore
**Scopes:** frontend, backend, auth, database, api, ui

**Example:**
```
feat(auth): implement JWT token refresh mechanism

- Add refresh token endpoint
- Update authentication middleware
- Add token validation tests

Closes #123
```

### Pull Request Process

1. **Create Feature Branch** from `develop`
2. **Commit Changes** with meaningful messages
3. **Push to Repository**
4. **Create Pull Request** with description
5. **Code Review** required (minimum 1 approval)
6. **Automated Tests** must pass
7. **Merge** to `develop`
8. **Delete** feature branch

### Code Review Checklist

- [ ] Code follows project conventions
- [ ] No hardcoded secrets or credentials
- [ ] Unit tests included and passing
- [ ] No console logs or debug code
- [ ] Performance implications considered
- [ ] Security best practices followed
- [ ] Documentation updated
- [ ] No breaking changes without migration plan

---

## CI/CD Pipeline

### Pipeline Overview

The CI/CD pipeline automates testing, building, and deployment processes.

```
Code Commit to GitHub
    ↓
Trigger CI/CD Pipeline
    ├→ Code Quality & Linting
    ├→ Unit Tests
    ├→ Integration Tests
    ├→ Security Scanning
    ├→ Build Artifacts
    ├→ Deploy to Staging
    └→ Health Check
         ↓ (Manual Approval)
    Deploy to Production
         ↓
    Health Verification
```

### Automated Checks

#### 1. Code Quality
```bash
# Frontend
npm run lint           # ESLint
npm run format        # Prettier

# Backend
npm run lint          # ESLint for Node.js
npm run format        # Code formatting
```

#### 2. Testing
```bash
# Unit Tests
npm run test

# Coverage Report
npm run test:coverage

# E2E Tests (when configured)
npm run test:e2e
```

#### 3. Security Scanning
```bash
# Dependency vulnerability scan
npm audit

# SAST (Static Application Security Testing)
npm run security:scan
```

#### 4. Build Verification
```bash
# Frontend build
npm run build

# Backend build/bundle
npm run build
```

### GitHub Actions Configuration (Example)

Create `.github/workflows/ci-cd.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Dependencies
        run: npm install
      
      - name: Run Linter
        run: npm run lint
      
      - name: Run Tests
        run: npm run test:coverage
      
      - name: Security Audit
        run: npm audit
      
      - name: Build
        run: npm run build

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Staging
        run: echo "Deploying to staging environment"

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Production
        run: echo "Deploying to production environment"
```

---

## Deployment Strategy

### Environments

| Environment | Purpose | Branch | Frequency |
|------------|---------|--------|-----------|
| **Development** | Local development | feature/* | Continuous |
| **Staging** | Pre-production testing | develop | Daily |
| **Production** | Live application | main | On Release |

### Local Development Deployment

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in separate terminal)
cd frontend
npm install
npm run dev
```

### Staging Deployment

**Trigger:** Merge to `develop` branch

**Steps:**
1. Pull latest code
2. Install dependencies
3. Run all tests
4. Build application
5. Deploy to staging environment
6. Run smoke tests
7. Notify team

**Commands:**
```bash
npm install
npm run test
npm run build
npm start
```

### Production Deployment

**Trigger:** Merge to `main` branch (usually via release PR)

**Pre-deployment Checklist:**
- [ ] All tests passing
- [ ] Code review approved
- [ ] Security scanning passed
- [ ] Performance baseline acceptable
- [ ] Database migrations ready
- [ ] Rollback plan documented

**Deployment Steps:**
1. Create release branch from develop
2. Update version numbers
3. Update CHANGELOG
4. Create release PR to main
5. Deploy to production
6. Verify deployment
7. Tag release
8. Document changes

### Zero-Downtime Deployment

```
1. Deploy new version alongside current version
2. Run smoke tests on new version
3. Switch load balancer to new version
4. Keep old version running for rollback
5. Monitor metrics for 30 minutes
6. If stable, remove old version
```

### Rollback Procedure

**If issues detected:**

```bash
# Check current version
git log --oneline -5

# Rollback to previous release
git revert <commit-hash>
git push origin main

# Or use release tags
git checkout <previous-tag>
git push origin main --force
```

---

## Component-wise DevOps Strategy

### Frontend (React + Vite)

#### Build Process
```bash
npm run build
# Output: dist/
```

#### Build Optimization
- **Code Splitting**: Vite automatically chunks code
- **Asset Optimization**: Images, fonts compressed
- **Tree Shaking**: Unused code removed
- **Minification**: Production build minified

#### Deployment
- **Platform**: Vercel, Netlify, or AWS S3 + CloudFront
- **Caching**: Browser cache (30 days), CDN cache (1 year)
- **Domain**: Custom domain with SSL/TLS
- **Health Check**: Verify bundle size, page load time

#### Monitoring Metrics
```
- Bundle Size: < 500KB (gzipped)
- Lighthouse Score: > 80
- First Contentful Paint (FCP): < 2s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
```

#### Frontend DevOps Tasks
```bash
# Development
npm run dev

# Linting
npm run lint

# Code Format
npm run format

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking (if TypeScript)
npm run type-check
```

### Backend (Node.js + Express)

#### Build Process
```bash
# No build required, but dependencies must be installed
npm install --production
```

#### Application Startup
```bash
# Development
npm run dev

# Production
npm start
# or NODE_ENV=production npm start
```

#### Health Check Endpoint

Add to `server.js`:
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});
```

Monitor:
```bash
curl http://localhost:5000/health
```

#### Port Management
| Service | Port | Environment |
|---------|------|-------------|
| Backend API | 5000 | Development |
| Backend API | 3000 | Production |
| MongoDB | 27017 | Local |
| Socket.IO | 5000 | Same as Backend |

#### File Structure for Deployment
```
backend/
├── server.js          # Entry point
├── config/
│   └── db.js         # Database configuration
├── controllers/       # Business logic
├── middlewares/       # Express middleware
├── models/           # MongoDB schemas
├── routes/           # API endpoints
├── package.json      # Dependencies
└── .env              # Environment variables
```

#### Backend DevOps Tasks
```bash
# Install dependencies
npm install

# Linting
npm run lint

# Testing
npm run test

# Development server
npm run dev

# Production server
npm start

# Environment-based start
NODE_ENV=production npm start
```

### Database (MongoDB)

#### Connection Strategy

**Local Development:**
```
mongodb://localhost:27017/agritech
```

**Cloud/Production:**
```
mongodb+srv://username:password@cluster.mongodb.net/agritech?retryWrites=true&w=majority
```

#### Collections Schema

```javascript
// Users Collection
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  role: String (farmer|buyer|admin),
  profile: {
    name: String,
    phone: String,
    address: String
  },
  createdAt: Date,
  updatedAt: Date
}

// Crops Collection
{
  _id: ObjectId,
  farmerId: ObjectId,
  name: String,
  variety: String,
  quantity: Number,
  price: Number,
  images: [String],
  status: String (available|sold|bid),
  createdAt: Date,
  listing: Date
}

// Orders Collection
{
  _id: ObjectId,
  buyerId: ObjectId,
  farmerId: ObjectId,
  cropId: ObjectId,
  quantity: Number,
  totalPrice: Number,
  status: String (pending|confirmed|delivered),
  createdAt: Date,
  completedAt: Date
}

// Negotiations Collection
{
  _id: ObjectId,
  buyerId: ObjectId,
  farmerId: ObjectId,
  cropId: ObjectId,
  messages: [Array],
  status: String (active|closed),
  createdAt: Date
}
```

#### Backup Strategy

**Local Development:**
```bash
# Export data
mongodump --db agritech --out ./backups

# Import data
mongorestore --db agritech ./backups/agritech
```

**Production (MongoDB Atlas/Cloud):**
- Automated daily backups
- Point-in-time recovery enabled
- Backup retention: 7 days minimum
- Test restore monthly

#### Database Performance

**Indexing:**
```javascript
// Recommended indexes
db.users.createIndex({ email: 1 })
db.crops.createIndex({ farmerId: 1 })
db.crops.createIndex({ status: 1 })
db.orders.createIndex({ buyerId: 1, status: 1 })
db.negotiations.createIndex({ buyerId: 1, farmerId: 1 })
```

**Query Optimization:**
- Use projection to limit fields
- Implement pagination for large result sets
- Cache frequently accessed data
- Monitor slow queries

---

## Testing & Quality Assurance

### Testing Pyramid

```
                 △
               /   \          E2E Tests
              /     \        (10-15%)
             /-------\
            /         \     Integration
           /           \    Tests
          /             \  (25-30%)
         /-----------\
        /             \   Unit Tests
       /               \  (60-70%)
      /                 \
     /___________________\
```

### Unit Tests

#### Frontend Unit Tests
```bash
# Create test file: src/components/__tests__/CropCard.test.jsx
npm run test

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

**Example Test:**
```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CropCard from '../CropCard';

describe('CropCard', () => {
  it('renders crop information', () => {
    const crop = {
      id: '1',
      name: 'Wheat',
      price: 5000
    };
    render(<CropCard crop={crop} />);
    expect(screen.getByText('Wheat')).toBeInTheDocument();
  });
});
```

#### Backend Unit Tests
```bash
# Create test file: backend/__tests__/cropController.test.js
npm run test

# With coverage
npm run test:coverage

# Specific test
npm run test -- __tests__/cropController.test.js
```

**Example Test:**
```javascript
const { describe, it, expect } = require('@jest/globals');
const cropController = require('../controllers/cropController');

describe('Crop Controller', () => {
  it('should fetch all crops', async () => {
    const req = {};
    const res = {
      json: (data) => {
        expect(data.length).toBeGreaterThan(0);
      }
    };
    
    await cropController.getAllCrops(req, res);
  });
});
```

### Integration Tests

```bash
# Run integration tests
npm run test:integration

# Specific feature
npm run test:integration -- auth
```

### E2E Tests (if configured)

```bash
# Run E2E tests
npm run test:e2e

# Specific scenario
npm run test:e2e -- --grep "User login"

# Headless mode
npm run test:e2e:headless
```

### Test Coverage Requirements

| Component | Minimum Coverage |
|-----------|-----------------|
| Backend API | 80% |
| Frontend Components | 70% |
| Authentication | 95% |
| Data Models | 90% |
| Utils/Helpers | 85% |

### Code Quality Metrics

**Linting Configuration:**
```json
{
  "extends": ["eslint:recommended"],
  "env": {
    "node": true,
    "browser": true,
    "es2021": true
  },
  "rules": {
    "no-console": "warn",
    "no-debugger": "error",
    "no-var": "error",
    "prefer-const": "error"
  }
}
```

---

## Security & Compliance

### Authentication & Authorization

#### JWT Token Implementation

**Token Structure:**
```
Header: { alg: 'HS256', typ: 'JWT' }
Payload: { userId: '...', role: 'farmer', exp: 1234567890 }
Signature: HMACSHA256(header.payload, secret)
```

**Token Lifecycle:**
```
1. User Login → Issue JWT Token (7 days)
2. User Makes Request → Verify Token in Middleware
3. Token Expires → User Redirected to Login
4. Refresh Token → Issue New JWT (if refresh logic exists)
```

**Middleware:**
```javascript
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};
```

#### Role-Based Access Control (RBAC)

```javascript
const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// Usage
router.post('/admin/dashboard', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  adminController.getDashboard
);
```

### Data Security

#### Password Hashing

```javascript
const bcrypt = require('bcrypt');

// Hash password before saving
const hashedPassword = await bcrypt.hash(password, 10);

// Verify during login
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

#### HTTPS/TLS

```
Production URLs must use HTTPS only
- Certificate: Let's Encrypt (free)
- HTTP → HTTPS redirect: Automatic
- HSTS enabled: max-age=31536000
```

#### Environment Variables

**Never commit to repository:**
- API keys
- Database credentials
- JWT secrets
- Payment gateway keys
- Email passwords

**Use `.env` file (in `.gitignore`)**

### Secrets Management

#### Tools
- **Development**: `.env` files
- **Production**: Environment secrets in CI/CD platform
- **Rotation**: Change secrets every 90 days

#### Handling Secrets in GitHub Actions

```yaml
env:
  DB_URI: ${{ secrets.DB_URI }}
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

### Vulnerability Management

#### Regular Audits
```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Fix with breaking changes
npm audit fix --force

# Generate audit report
npm audit --json > audit-report.json
```

#### Dependency Updates
```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Update to latest major versions
npm upgrade
```

#### OWASP Top 10 Compliance

| Vulnerability | Mitigation |
|---|---|
| Injection | Use parameterized queries, input validation |
| Broken Authentication | JWT, password hashing, rate limiting |
| Sensitive Data Exposure | HTTPS, encryption at rest |
| XML External Entities | Disable DTD processing |
| Broken Access Control | RBAC, middleware validation |
| Security Misconfiguration | Security headers, CORS configuration |
| XSS | Input sanitization, CSP headers |
| Insecure Deserialization | Avoid unsafe serialization |
| Using Components with Known Vulnerabilities | Dependency audits |
| Insufficient Logging/Monitoring | Centralized logging, alerts |

### Security Headers

```javascript
const express = require('express');
const helmet = require('helmet');

const app = express();
app.use(helmet());

// Headers set by helmet:
// - Content-Security-Policy
// - X-Content-Type-Options: nosniff
// - X-Frame-Options: DENY
// - X-XSS-Protection: 1; mode=block
// - Strict-Transport-Security
```

### CORS Configuration

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## Monitoring & Logging

### Logging Strategy

#### Log Levels

| Level | Usage | Example |
|-------|-------|---------|
| **ERROR** | Application failures | Database connection failed |
| **WARN** | Potential issues | Deprecated API usage |
| **INFO** | Important events | User login, deployment completed |
| **DEBUG** | Detailed debugging | Request/response data |

#### Logger Implementation

```javascript
// Using Winston or similar
const logger = require('./config/logger');

// In controllers/routes
logger.info('User login attempt', { userId, timestamp });
logger.error('Database connection failed', { error });
logger.warn('API deprecation warning');
logger.debug('Query parameters', { params });
```

#### Log Output

**Development:**
```
[2026-02-11 10:30:45] INFO: User login - userId: user123
[2026-02-11 10:30:46] DEBUG: Database query time: 45ms
```

**Production (JSON format):**
```json
{
  "timestamp": "2026-02-11T10:30:45Z",
  "level": "INFO",
  "message": "User login",
  "userId": "user123",
  "environment": "production"
}
```

### Application Monitoring

#### Metrics to Track

```
API Response Time: < 200ms
Error Rate: < 0.5%
Uptime: > 99.5%
Database Query Time: < 100ms
CPU Usage: < 70%
Memory Usage: < 80%
Active Connections: Track capacity
Request Rate: Monitor for DoS
```

#### Health Check Endpoint

```bash
# Check application health
curl http://localhost:5000/health

# Response
{
  "status": "healthy",
  "uptime": 3600,
  "timestamp": "2026-02-11T10:30:45Z",
  "database": "connected",
  "memoryUsage": "120MB"
}
```

#### Error Tracking

```javascript
// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled exception', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  res.status(err.statusCode || 500).json({
    error: 'Internal Server Error',
    requestId: req.id
  });
});
```

### Frontend Monitoring

#### Performance Metrics
```javascript
// Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);  // Cumulative Layout Shift
getFID(console.log);  // First Input Delay
getFCP(console.log);  // First Contentful Paint
getLCP(console.log);  // Largest Contentful Paint
getTTFB(console.log); // Time to First Byte
```

#### Error Reporting
```javascript
// Global error handler
window.addEventListener('error', (event) => {
  logger.error('Frontend Error', {
    message: event.message,
    source: event.filename,
    lineno: event.lineno
  });
});

// Unhandled promise rejection
window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled Promise Rejection', {
    reason: event.reason
  });
});
```

---

## Troubleshooting Guide

### Common Issues & Solutions

#### Backend Not Starting

**Issue:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Windows - Find process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Or change port in .env
PORT=5001
```

#### Database Connection Error

**Issue:** `MongooseError: connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**
```bash
# 1. Check if MongoDB is running
mongod --version

# 2. Start MongoDB service
mongod  # macOS/Linux
# or
net start MongoDB  # Windows

# 3. Verify connection string in .env
DB_URI=mongodb://localhost:27017/agritech

# 4. Check MongoDB is listening
mongo mongodb://localhost:27017
```

#### Frontend Not Displaying

**Issue:** Blank page or 404 errors in browser

**Solution:**
```bash
# 1. Check if dev server is running on correct port
npm run dev

# 2. Verify API URL in .env
VITE_API_URL=http://localhost:5000

# 3. Check browser console for errors
Open DevTools → Console tab

# 4. Clear browser cache
Press Ctrl+Shift+Delete

# 5. Check CORS configuration
Verify backend CORS_ORIGIN setting
```

#### Authentication Issues

**Issue:** `401 Unauthorized` or `403 Forbidden` errors

**Solution:**
```bash
# 1. Check JWT token in browser
DevTools → Application → Cookies/LocalStorage

# 2. Verify token format
Authorization: Bearer <token>

# 3. Check JWT_SECRET in .env
JWT_SECRET should match between frontend and backend

# 4. Verify token expiry
Tokens expire after 7 days, user needs to login again
```

#### Socket.IO Connection Issues

**Issue:** Real-time features not working, no live updates

**Solution:**
```bash
# 1. Check Socket.IO is enabled in backend
import io from 'socket.io'

# 2. Verify Socket URL in frontend .env
VITE_SOCKET_URL=http://localhost:5000

# 3. Check browser console for WebSocket errors
DevTools → Console

# 4. Verify CORS in Socket.IO backend
io(server, {
  cors: { origin: process.env.CORS_ORIGIN }
})

# 5. Test connection manually
const socket = io('http://localhost:5000');
socket.on('connect', () => console.log('Connected'));
```

#### Memory Leak Issues

**Issue:** Application becomes slow, memory keeps increasing

**Solution:**
```bash
# 1. Monitor memory usage
node --inspect server.js
# Visit chrome://inspect to debug

# 2. Check for unclosed connections
- Database connections in connection pool
- File handles
- Event listeners not removed

# 3. Use heap snapshots
- Take heap snapshot before & after operation
- Compare to find memory growth

# 4. Common culprits
- Unreleased event listeners
- Large arrays accumulating data
- Circular references
```

#### Build Failures

**Issue:** `npm run build` fails with errors

**Solution:**
```bash
# 1. Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json

# 2. Reinstall dependencies
npm install

# 3. Check for TypeScript errors (if used)
npm run type-check

# 4. Run linter to catch issues
npm run lint

# 5. Try building again
npm run build

# 6. Check disk space
df -h  # macOS/Linux
Get-Volume  # Windows
```

### Performance Troubleshooting

#### Slow API Response

```bash
# 1. Check backend logs for slow queries
grep "query time" server.log

# 2. Add database indexes
db.crops.createIndex({ status: 1 })

# 3. Implement caching
- Cache frequently accessed data
- Set appropriate TTL values

# 4. Enable query monitoring
Set DEBUG=mongodb:* to see queries

# 5. Monitor database metrics
- Query execution time
- Index usage
- Connection pool size
```

#### Slow Frontend Load

```bash
# 1. Check bundle size
npm run build
ls -lh dist/

# 2. Analyze bundle
npm install -g vite-bundle-analyzer
vite-bundle-analyzer dist/stats.html

# 3. Code split large components
const CropForm = lazy(() => import('./CropForm'));

# 4. Enable gzip compression
# Server-side compression

# 5. Use CDN for static assets
Configure CDN in deployment
```

---

## Tools & Technologies

### Development Tools

| Tool | Purpose | Installation |
|------|---------|--------------|
| Node.js | JavaScript runtime | [nodejs.org](https://nodejs.org) |
| npm | Package manager | Included with Node.js |
| Git | Version control | [git-scm.com](https://git-scm.com) |
| VS Code | Code editor | [code.visualstudio.com](https://code.visualstudio.com) |
| Postman | API testing | [postman.com](https://postman.com) |
| MongoDB Compass | Database GUI | [mongodb.com/products/compass](https://mongodb.com/products/compass) |

### Frontend Stack

```
React 18          - UI library
Vite              - Build tool
TailwindCSS       - CSS framework
Socket.IO Client  - Real-time communication
Axios/Fetch       - HTTP client
React Router      - Navigation
Context API       - State management
```

### Backend Stack

```
Node.js           - Runtime
Express.js        - Web framework
MongoDB           - Database
Mongoose          - ODM
JWT               - Authentication
Socket.IO         - Real-time events
Bcryptjs          - Password hashing
CORS              - Cross-origin requests
```

### DevOps & CI/CD Tools

```
GitHub            - Repository hosting
GitHub Actions    - CI/CD pipeline
Docker (optional) - Containerization
Webpack/Vite      - Bundling
ESLint            - Code linting
Jest/Vitest       - Testing framework
```

### Monitoring & Analytics (Optional)

```
CloudWatch        - Log aggregation
DataDog           - APM monitoring
Sentry            - Error tracking
New Relic         - Performance monitoring
```

---

## Maintenance & Updates

### Regular Maintenance Tasks

#### Daily
- Monitor error logs
- Check application uptime
- Review user-reported issues
- Verify backup completion

#### Weekly
- Run security audits (`npm audit`)
- Review performance metrics
- Test backup restoration
- Update documentation

#### Monthly
- Update dependencies (`npm outdated`)
- Review and rotate secrets
- Analyze error patterns
- Performance trend analysis
- Update security patches

#### Quarterly
- Major dependency updates
- Infrastructure review
- Disaster recovery drill
- Performance optimization review

### Dependency Updates

#### Checking for Updates
```bash
# View outdated packages
npm outdated

# Check for vulnerabilities
npm audit

# Check specific package
npm info express versions
```

#### Updating Strategy

```bash
# Update minor/patch versions (safe)
npm update

# Update to specific version
npm install package@2.0.0

# Update to latest major version
npm install package@latest

# Update all packages
npm upgrade
```

#### After Updates
- Run full test suite: `npm run test`
- Check for breaking changes
- Verify functionality
- Deploy to staging first
- Monitor for issues in production

### Version Management

#### Semantic Versioning

Format: `MAJOR.MINOR.PATCH` (e.g., 1.2.3)

- **MAJOR**: Breaking changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

#### Release Process

```bash
# 1. Update version
npm version patch|minor|major

# 2. Update CHANGELOG
echo "- New feature: ..." >> CHANGELOG.md

# 3. Commit changes
git commit -m "chore: release v1.0.1"

# 4. Tag release
git tag -a v1.0.1 -m "Release version 1.0.1"

# 5. Push to repository
git push origin main --tags
```

### Changelog Maintenance

**CHANGELOG.md Format:**

```markdown
# Changelog

## [1.0.1] - 2026-02-11

### Added
- New feature: Real-time price updates
- New feature: Auction notifications

### Fixed
- Fix: Login token refresh issue
- Fix: Mobile responsive layout

### Changed
- Update: JWT token expiry to 7 days
- Update: Database connection pooling

### Security
- Bump mongoose from 7.0.0 to 7.0.5 (security fix)

## [1.0.0] - 2026-02-01

### Added
- Initial release
```

### Disaster Recovery

#### Backup Resources
- **Database backups**: Full backup daily, retained for 30 days
- **Code repository**: Hosted on GitHub with redundancy
- **Configuration**: All .env configurations documented (no secrets)
- **Static assets**: Version-controlled CDN assets

#### Recovery Procedures

**Database Recovery:**
```bash
# 1. Download backup from cloud storage
aws s3 cp s3://backups/agritech-backup.gz ./

# 2. Restore database
gunzip agritech-backup.gz
mongorestore --db agritech ./backup/agritech

# 3. Verify data integrity
mongo agritech --eval "db.users.count()"
```

**Application Recovery:**
```bash
# 1. Checkout previous working version
git log --oneline -10
git checkout <commit-hash>

# 2. Reinstall dependencies
npm install

# 3. Restart application
npm start
```

---

## Conclusion

This DevOps documentation provides a comprehensive guide for developing, testing, deploying, and maintaining the AgriTech Marketplace platform. By following these practices, the team ensures:

✅ **Consistency**: Standardized processes across all environments  
✅ **Quality**: Automated testing and quality gates  
✅ **Security**: Best practices and vulnerability management  
✅ **Reliability**: High availability and disaster recovery  
✅ **Scalability**: Infrastructure ready for growth  

### Quick Reference Links

| Topic | Command |
|-------|---------|
| Start Development | `npm run dev` (in both backend & frontend) |
| Run Tests | `npm run test` |
| Build for Production | `npm run build` |
| Static Analysis | `npm run lint` |
| Security Audit | `npm audit` |
| Check Health | `curl http://localhost:5000/health` |

### Getting Help

For issues, questions, or suggestions:
1. Check [Troubleshooting Guide](#troubleshooting-guide)
2. Review error logs
3. Check GitHub Issues
4. Contact project team

### Document Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Feb 11, 2026 | Initial DevOps documentation |

---

**Last Updated:** February 11, 2026  
**Maintained By:** Development Team  
**Next Review:** May 11, 2026
