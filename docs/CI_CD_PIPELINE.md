# CI/CD Pipeline Documentation

## Overview

This document provides a comprehensive explanation of the Continuous Integration/Continuous Deployment (CI/CD) pipeline used in this project. The pipeline is implemented using **GitHub Actions** and automatically runs on every push to the main branch.

## Pipeline Workflow File

**Location:** `.github/workflows/ci.yml`

The CI/CD pipeline is defined in a YAML configuration file that orchestrates automated testing and building of both the backend and frontend components of the application.

---

## Pipeline Triggers

### When Does the Pipeline Run?

The pipeline is triggered automatically when:
- Code is **pushed to the `main` branch**

```yaml
on:
  push:
    branches: [ main ]
```

**Note:** The pipeline only runs on the main branch, ensuring that only production-ready code is processed through the entire pipeline.

---

## Pipeline Structure

### Runner Environment

**OS:** Ubuntu Latest (ubuntu-latest)

The pipeline runs on GitHub-hosted Ubuntu runners, providing a consistent Linux environment for all build and test operations.

---

## Jobs and Steps

### Job: Build

The pipeline consists of a single job named `build` that handles all frontend and backend operations sequentially.

#### Step 1: Checkout Repository

```yaml
- name: Checkout repository
  uses: actions/checkout@v3
```

**Purpose:** Clones the repository code into the runner's workspace.

**What it does:**
- Fetches the latest code from the branch that triggered the pipeline
- Makes all files available for the subsequent steps
- Uses GitHub Actions' official checkout action (v3)

---

#### Step 2: Setup Node.js

```yaml
- name: Setup Node
  uses: actions/setup-node@v3
  with:
    node-version: 18
```

**Purpose:** Installs Node.js runtime and npm package manager.

**What it does:**
- Installs Node.js version 18 (LTS version suitable for production)
- Installs npm (Node Package Manager) automatically with Node.js
- Makes `npm` and `node` commands available for all subsequent steps
- Sets up the JavaScript runtime environment for both backend and frontend

---

#### Step 3: Install Backend Dependencies

```yaml
- name: Install Backend Dependencies
  run: |
    cd backend
    npm install
```

**Purpose:** Installs all npm packages required by the backend application.

**What it does:**
- Navigates to the `backend/` directory
- Runs `npm install` to fetch and install dependencies listed in `backend/package.json`
- Creates `node_modules/` directory with all dependencies
- Generates/updates `package-lock.json` to lock dependency versions

**Dependencies installed include:**
- Express.js (web framework)
- MongoDB driver (database client)
- Authentication libraries
- Testing frameworks (Jest)
- Other utility packages

---

#### Step 4: Run Backend Tests

```yaml
- name: Run Backend Tests
  run: |
    cd backend
    npm test || echo "No tests found"
```

**Purpose:** Executes all backend unit and integration tests.

**What it does:**
- Navigates to the `backend/` directory
- Runs `npm test` which executes test suites defined in `backend/jest.config.js`
- Uses Jest as the testing framework
- If tests fail or no tests are found, the command echoes "No tests found" instead of failing the pipeline
- Test results are reported in the GitHub Actions workflow logs

**Test files run:**
- `tests/auth.test.js` - Authentication and authorization tests
- `tests/crops.test.js` - Crop management functionality tests

**Error Handling:**
- The `|| echo "No tests found"` ensures the pipeline continues even if tests are missing
- This allows the pipeline to be flexible during development phases

---

#### Step 5: Install Frontend Dependencies

```yaml
- name: Install Frontend Dependencies
  run: |
    cd frontend
    npm install
```

**Purpose:** Installs all npm packages required by the React frontend application.

**What it does:**
- Navigates to the `frontend/` directory
- Runs `npm install` to fetch and install dependencies listed in `frontend/package.json`
- Creates `node_modules/` directory with all frontend dependencies
- Generates/updates `package-lock.json`

**Dependencies installed include:**
- React (UI library)
- Vite (build tool)
- Tailwind CSS (styling framework)
- Socket.io-client (real-time communication)
- ESLint (code quality/linting)
- Testing libraries (Vitest, React Testing Library)

---

#### Step 6: Build Frontend

```yaml
- name: Build Frontend
  run: |
    cd frontend
    npm run build || echo "Build skipped"
```

**Purpose:** Compiles and bundles the React frontend application.

**What it does:**
- Navigates to the `frontend/` directory
- Runs `npm run build` which triggers the build process defined in `frontend/package.json`
- Uses Vite to perform optimized production build
- Creates a `dist/` directory containing optimized, minified JavaScript and CSS
- Performs code splitting and asset optimization
- If build fails or is not configured, echoes "Build skipped"

**Output:** 
- Optimized static files ready for deployment
- Reduced bundle size through minification
- Improved performance through code splitting

---

## Error Handling Strategy

The pipeline uses a **permissive error handling approach**:

1. **Backend Tests:** Continue pipeline even if tests fail (`|| echo "..."`)<br>
2. **Frontend Build:** Continue pipeline even if build fails (`|| echo "..."`)<br>

**Rationale:** 
- Allows development flexibility during early project stages
- Prevents pipeline failures from blocking other collaborators
- Can be tightened later for stricter CI/CD requirements

---

## Workflow Execution Order

```
1. Code pushed to main branch
          ↓
2. GitHub Actions triggered
          ↓
3. Checkout repository
          ↓
4. Setup Node.js 18
          ↓
5. Backend: Install dependencies
          ↓
6. Backend: Run tests
          ↓
7. Frontend: Install dependencies
          ↓
8. Frontend: Build application
          ↓
9. Workflow complete (Success/Failure reported)
```

---

## Monitoring and Debugging

### View Pipeline Status

1. **GitHub Repository:** Navigate to **Actions** tab
2. **Workflow Name:** "CI Pipeline"
3. **See logs for each step** including:
   - Dependency installation progress
   - Test results and failures
   - Build output and warnings

### Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Tests fail | New code breaks existing tests | Review test failures in logs and fix code |
| Build fails | Missing dependencies | Check `package.json` and install missing packages |
| Node version mismatch | Local vs CI version differs | Update to Node 18 locally to match CI |
| Slow pipeline | Too many dependencies | Optimize `package.json` or use caching |

---

## Future Enhancements

### Recommended Improvements

1. **Caching:** Cache npm dependencies to speed up installations
   ```yaml
   - uses: actions/setup-node@v3
     with:
       node-version: 18
       cache: 'npm'
   ```

2. **Code Coverage:** Add coverage reports
   ```yaml
   - name: Generate Coverage Report
     run: cd backend && npm test -- --coverage
   ```

3. **Linting:** Add ESLint validation
   ```yaml
   - name: Lint Code
     run: cd frontend && npm run lint
   ```

4. **Deployment:** Add automatic deployment steps
   ```yaml
   - name: Deploy to Production
     if: success()
     run: |
       # Deploy commands here
   ```

5. **Notifications:** Slack/Email notifications on failures
   ```yaml
   - name: Notify on Failure
     if: failure()
     uses: slackapi/slack-github-action@v1
   ```

---

## Configuration Files Referenced

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | Defines the CI/CD pipeline |
| `backend/package.json` | Backend dependencies and scripts |
| `backend/jest.config.js` | Jest testing configuration |
| `frontend/package.json` | Frontend dependencies and scripts |
| `frontend/vite.config.js` | Vite build configuration |

---

## Key Technologies

| Component | Technology | Version |
|-----------|----------|---------|
| Runtime | Node.js | 18 (LTS) |
| Package Manager | npm | Latest |
| CI/CD Platform | GitHub Actions | v3 |
| Backend Framework | Express.js | - |
| Frontend Framework | React + Vite | - |
| Testing | Jest | - |
| Testing Framework | React Testing Library | - |
| Styling | Tailwind CSS | - |

---

## Best Practices

### For Developers

1. **Test Locally:** Run `npm test` locally before pushing to avoid CI failures
2. **Check Dependencies:** Ensure all imports are listed in `package.json`
3. **Follow Conventions:** Match existing code style to avoid linting issues
4. **Meaningful Commits:** Provide clear commit messages for easier debugging

### For CI/CD

1. **Keep Pipeline Fast:** Minimize unnecessary steps
2. **Clear Logging:** Ensure errors are clearly logged for debugging
3. **Fail Early:** Detect issues at the earliest possible stage
4. **Document Changes:** Update this documentation when pipeline changes

---

## Conclusion

The CI/CD pipeline ensures code quality, automated testing, and consistent builds for both frontend and backend components. It provides a safety net for deployments and helps maintain code reliability throughout the development lifecycle.

For questions or updates to this pipeline, please update both the `.github/workflows/ci.yml` file and this documentation file accordingly.
