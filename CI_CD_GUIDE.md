# 🚀 CI/CD Guide - Confidential Weather Aggregator

Comprehensive guide for Continuous Integration and Continuous Deployment workflows.

---

## 📊 Overview

This project uses **GitHub Actions** for automated testing, code quality checks, and continuous integration. All workflows are automatically triggered on code changes to ensure high quality and reliability.

### CI/CD Statistics

| Metric | Value |
|--------|-------|
| **Workflows** | 2 (Test Suite + CI/CD Pipeline) |
| **Node.js Versions** | 18.x, 20.x |
| **Code Quality Tools** | Solhint, ESLint, TypeScript |
| **Coverage Reporting** | Codecov |
| **Auto-Triggers** | Push to main/develop, Pull Requests |

---

## 📋 Table of Contents

- [Workflows](#workflows)
- [Automated Testing](#automated-testing)
- [Code Quality Checks](#code-quality-checks)
- [Coverage Reporting](#coverage-reporting)
- [Configuration Files](#configuration-files)
- [Setting Up CI/CD](#setting-up-cicd)
- [Troubleshooting](#troubleshooting)

---

## 🔄 Workflows

### 1. Test Suite Workflow (`.github/workflows/test.yml`)

**Purpose:** Run comprehensive test suite on multiple Node.js versions

**Triggers:**
- Push to `main` branch
- Push to `develop` branch
- Pull requests to `main` or `develop`

**Jobs:**
```yaml
test:
  - Node.js 18.x
  - Node.js 20.x
```

**Steps:**
1. ✅ Checkout code
2. ✅ Setup Node.js with cache
3. ✅ Install dependencies
4. ✅ Run Solhint (code quality)
5. ✅ Compile contracts
6. ✅ Run tests (50+ test cases)
7. ✅ Generate coverage report
8. ✅ Upload to Codecov

**Status Badges:**
```markdown
![Test Suite](https://github.com/YOUR_USERNAME/WeatherAggregator/workflows/Test%20Suite/badge.svg)
```

---

### 2. CI/CD Pipeline Workflow (`.github/workflows/ci.yml`)

**Purpose:** Complete CI/CD pipeline with multiple quality gates

**Triggers:**
- Push to `main` branch
- Push to `develop` branch
- Pull requests to `main` or `develop`

**Jobs:**

#### Job 1: Lint (Code Quality Checks)
```yaml
- ESLint (JavaScript/TypeScript)
- Solhint (Solidity)
- TypeScript type checking
```

#### Job 2: Build (Compilation)
```yaml
- Compile smart contracts
- Build Next.js application
- Upload build artifacts
```

#### Job 3: Test (Multi-version Testing)
```yaml
- Run on Node.js 18.x and 20.x
- Execute test suite
- Generate coverage
- Upload to Codecov
```

#### Job 4: Security (Vulnerability Scanning)
```yaml
- npm audit
- Check for known vulnerabilities
- Production dependency check
```

#### Job 5: Summary
```yaml
- Display pipeline status
- Aggregate results
```

**Status Badges:**
```markdown
![CI/CD Pipeline](https://github.com/YOUR_USERNAME/WeatherAggregator/workflows/CI%2FCD%20Pipeline/badge.svg)
```

---

## 🧪 Automated Testing

### Test Execution

Tests run automatically on:
- Every push to `main` or `develop`
- Every pull request
- Manual workflow dispatch

### Test Matrix

| Node.js Version | Status |
|----------------|--------|
| 18.x | ✅ Tested |
| 20.x | ✅ Tested |

### Test Suite Details

**Total Tests:** 50+

**Categories:**
1. Deployment (4 tests)
2. Station Registration (5 tests)
3. Station Deactivation (4 tests)
4. Time Window Management (3 tests)
5. Weather Data Submission (5 tests)
6. Regional Forecast Generation (4 tests)
7. Current Forecast Info (2 tests)
8. Access Control (1 test)
9. Edge Cases (6 tests)
10. Gas Optimization (3 tests)
11. Multi-Station Scenarios (3 tests)
12. Time Window Restrictions (2 tests)
13. Forecast History (3 tests)
14. View Functions (4 tests)

### Running Tests Locally

```bash
# Run all tests
npm test

# Run with coverage
npm run coverage

# Run Solhint
npm run lint:sol
```

---

## 🔍 Code Quality Checks

### 1. Solhint (Solidity Linter)

**Configuration:** `.solhint.json`

**Rules:**
- Code complexity: max 10
- Compiler version: >=0.8.24
- Function visibility: enforced
- Max line length: 120
- Named parameters: warned
- Security checks: enforced

**Commands:**
```bash
# Check all contracts
npm run lint:sol

# Auto-fix issues
npm run lint:sol:fix
```

**Ignored Files:** `.solhintignore`
```
node_modules/
artifacts/
cache/
coverage/
*.backup
```

### 2. ESLint (JavaScript/TypeScript)

**Configuration:** `.eslintrc.json`

**Commands:**
```bash
# Check code
npm run lint

# Auto-fix issues
npm run lint --fix
```

### 3. TypeScript Type Checking

**Commands:**
```bash
# Check types
npm run type-check
```

### Quality Gates

All pull requests must pass:
- ✅ Solhint checks
- ✅ ESLint checks
- ✅ TypeScript compilation
- ✅ All tests
- ✅ Coverage threshold (80%)

---

## 📈 Coverage Reporting

### Codecov Integration

**Configuration:** `codecov.yml`

**Settings:**
- Target coverage: 80%
- Threshold: 5%
- Precision: 2 decimal places
- Range: 70-100%

**Coverage Reports:**
- Project coverage
- Patch coverage
- Diff coverage

**Ignored Files:**
```
test/**/*
scripts/**/*
node_modules/**/*
artifacts/**/*
*.test.js
*.spec.js
```

### Setting Up Codecov

1. **Create Codecov Account:**
   - Visit [codecov.io](https://codecov.io)
   - Sign up with GitHub
   - Add repository

2. **Get Codecov Token:**
   - Go to repository settings
   - Copy upload token

3. **Add Secret to GitHub:**
   ```
   Repository Settings → Secrets and variables → Actions
   New repository secret:
   Name: CODECOV_TOKEN
   Value: [your token]
   ```

4. **View Coverage Reports:**
   - Visit `https://codecov.io/gh/YOUR_USERNAME/WeatherAggregator`

**Coverage Badge:**
```markdown
[![codecov](https://codecov.io/gh/YOUR_USERNAME/WeatherAggregator/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/WeatherAggregator)
```

---

## 📁 Configuration Files

### Workflow Files

| File | Purpose |
|------|---------|
| `.github/workflows/test.yml` | Test suite workflow |
| `.github/workflows/ci.yml` | Complete CI/CD pipeline |

### Configuration Files

| File | Purpose |
|------|---------|
| `.solhint.json` | Solidity linting rules |
| `.solhintignore` | Files to ignore in Solhint |
| `codecov.yml` | Codecov configuration |
| `hardhat.config.js` | Hardhat configuration |

---

## 🛠️ Setting Up CI/CD

### For Repository Owners

#### 1. Enable GitHub Actions

```bash
# Workflows are automatically enabled when you push to GitHub
git add .github/
git commit -m "Add CI/CD workflows"
git push origin main
```

#### 2. Configure Secrets

**Required Secrets:**
```
CODECOV_TOKEN - For coverage reporting (optional but recommended)
```

**Optional Secrets:**
```
SEPOLIA_RPC_URL - For deployment tests
PRIVATE_KEY - For deployment tests
ETHERSCAN_API_KEY - For contract verification
```

**Adding Secrets:**
1. Go to repository Settings
2. Navigate to Secrets and variables → Actions
3. Click "New repository secret"
4. Add name and value
5. Click "Add secret"

#### 3. Branch Protection Rules

**Recommended Settings:**
```
Settings → Branches → Add rule

Branch name pattern: main

☑ Require a pull request before merging
☑ Require status checks to pass before merging
  ☑ test (Node.js 18.x)
  ☑ test (Node.js 20.x)
  ☑ lint
  ☑ build
☑ Require branches to be up to date before merging
```

### For Contributors

#### 1. Fork the Repository

```bash
# Fork on GitHub, then clone
git clone https://github.com/YOUR_USERNAME/WeatherAggregator.git
cd WeatherAggregator
```

#### 2. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

#### 3. Make Changes and Test Locally

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run tests
npm test

# Check code quality
npm run lint:sol
npm run lint

# Generate coverage
npm run coverage
```

#### 4. Push and Create Pull Request

```bash
git add .
git commit -m "Add feature: description"
git push origin feature/your-feature-name
```

**Pull Request Checklist:**
- ✅ All tests pass
- ✅ Code coverage maintained
- ✅ Solhint checks pass
- ✅ ESLint checks pass
- ✅ TypeScript compiles
- ✅ Documentation updated

---

## 🎯 Workflow Status

### View Workflow Runs

1. Go to repository on GitHub
2. Click "Actions" tab
3. View workflow runs and logs

### Workflow Badges

Add to README.md:

```markdown
## CI/CD Status

![Test Suite](https://github.com/YOUR_USERNAME/WeatherAggregator/workflows/Test%20Suite/badge.svg)
![CI/CD Pipeline](https://github.com/YOUR_USERNAME/WeatherAggregator/workflows/CI%2FCD%20Pipeline/badge.svg)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/WeatherAggregator/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/WeatherAggregator)
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Workflow Fails on Dependencies

**Error:** `npm ci failed`

**Solution:**
```bash
# Use legacy peer deps
npm ci --legacy-peer-deps
```

#### 2. Solhint Not Found

**Error:** `solhint: command not found`

**Solution:**
```bash
# Install solhint
npm install --save-dev solhint
```

#### 3. Coverage Upload Fails

**Error:** `Codecov token not found`

**Solution:**
- Add `CODECOV_TOKEN` to repository secrets
- Or set `fail_ci_if_error: false` in workflow

#### 4. Tests Timeout

**Error:** `Test timeout exceeded`

**Solution:**
```javascript
// In test file
this.timeout(60000); // 60 seconds
```

#### 5. Build Artifacts Too Large

**Error:** `Artifact size limit exceeded`

**Solution:**
- Reduce retention days
- Exclude unnecessary files
- Use `.gitignore` patterns

### Debugging Workflows

#### Enable Debug Logging

1. Go to repository Settings
2. Secrets and variables → Actions
3. Add secret:
   ```
   Name: ACTIONS_STEP_DEBUG
   Value: true
   ```

#### View Detailed Logs

1. Click on failed workflow
2. Click on failed job
3. Expand failed step
4. Review error messages

---

## 📚 Additional Resources

### Documentation
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Codecov Documentation](https://docs.codecov.com/)
- [Solhint Rules](https://github.com/protofire/solhint/blob/master/docs/rules.md)
- [Hardhat Testing](https://hardhat.org/hardhat-runner/docs/guides/test-contracts)

### Best Practices
- Write comprehensive tests
- Maintain high coverage (>80%)
- Follow linting rules
- Use semantic commit messages
- Keep workflows fast (<10 minutes)

---

## 🎉 Benefits of CI/CD

### For the Project
- ✅ Automated quality assurance
- ✅ Early bug detection
- ✅ Consistent code quality
- ✅ Faster review process
- ✅ Reliable deployments

### For Contributors
- ✅ Immediate feedback
- ✅ Confidence in changes
- ✅ Clear quality standards
- ✅ Automated testing
- ✅ Professional workflow

### For Users
- ✅ High-quality code
- ✅ Fewer bugs
- ✅ Regular updates
- ✅ Transparent development
- ✅ Reliable software

---

**CI/CD Framework:** GitHub Actions
**Test Coverage:** Codecov
**Code Quality:** Solhint + ESLint
**Status:** ✅ Fully Automated
**Last Updated:** November 2, 2025
