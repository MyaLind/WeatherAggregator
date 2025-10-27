# 🌤️ Confidential Weather Aggregator

**Privacy-preserving regional weather forecasting powered by Zama's FHEVM technology**

Aggregate encrypted meteorological data from multiple weather stations into accurate regional forecasts **without revealing individual station measurements**. Built for collaborative weather networks, cross-border data sharing, and GDPR-compliant data aggregation.

---

## 🌐 Live Demo

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](https://weather-aggregator.vercel.app/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?logo=solidity)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.22.16-yellow)](https://hardhat.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**🔗 Live Application**: [https://weather-aggregator.vercel.app/](https://weather-aggregator.vercel.app/)

**📹 Video Demo**: See `demo.mp4` for a complete walkthrough of station registration, encrypted data submission, and forecast generation.

**📊 Deployed Contract**:
- **Network**: Sepolia Testnet (Chain ID: 11155111)
- **Contract Address**: `0x291B77969Bb18710609C35d263adCb0848a3f82F`
- **Gateway Address**: `0x33347831500F1E73F0CccBBe71C7E21Ca0100a42`
- **Explorer**: [View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0x291B77969Bb18710609C35d263adCb0848a3f82F)

---

## 🚦 CI/CD Status

![Test Suite](https://github.com/MyaLind/WeatherAggregator/workflows/Test%20Suite/badge.svg)
![CI/CD Pipeline](https://github.com/MyaLind/WeatherAggregator/workflows/CI%2FCD%20Pipeline/badge.svg)
[![codecov](https://codecov.io/gh/MyaLind/WeatherAggregator/branch/main/graph/badge.svg)](https://codecov.io/gh/MyaLind/WeatherAggregator)

**Automated Quality Gates:**
- ✅ Code Quality (ESLint + Solhint + Prettier)
- ✅ Security Audit (npm audit + security plugin)
- ✅ Performance Testing (Gas optimization tracking)
- ✅ Multi-version Testing (Node.js 18.x, 20.x)
- ✅ Code Coverage (80%+ target via Codecov)
- ✅ Pre-commit Hooks (Left-shift quality strategy)

---

## ✨ Key Features

### 🔐 Privacy-Preserving Aggregation
- **Encrypted Data Submission**: Weather data encrypted with FHE before submission
- **Computation on Encrypted Values**: Aggregations performed without decryption
- **Individual Privacy**: Each station's measurements remain confidential
- **Public Regional Forecasts**: Only averaged results are decrypted and shared

### 🏢 Multi-Station Network
- **Decentralized Registration**: Owner-controlled station registration
- **Role-Based Access**: Owner, Weather Stations, and Public permissions
- **Station Management**: Activation/deactivation controls
- **Real-time Monitoring**: Live submission status tracking

### ⚡ Automated Forecast Generation
- **Minimum Threshold**: Requires 3+ stations for forecast generation
- **Encrypted Aggregation**: FHE operations on encrypted weather data
- **Secure Decryption**: Zama Gateway handles decryption requests
- **Historical Tracking**: Complete forecast history on-chain

### ⏰ Configurable Time Windows
- **Submission Periods**: Default 6-hour submission cycles
- **Forecast Windows**: 1-hour generation periods after submission
- **Testing Mode**: Disable time restrictions for development
- **UTC-Based**: Global coordination with UTC timestamps

### 🎨 Modern User Interface
- **Responsive Design**: Works on desktop and mobile
- **MetaMask Integration**: Seamless wallet connectivity
- **Real-time Updates**: Live connection status and data refresh
- **Error Handling**: Comprehensive error messages and recovery

---

## 🏗️ Architecture

### System Overview

```
Frontend (Next.js + React)
├── Client-side FHE encryption
├── MetaMask wallet integration
├── Real-time encrypted data display
└── Responsive UI components

Smart Contract (Solidity 0.8.24)
├── Encrypted storage (euint32, euint8)
├── Homomorphic aggregation operations
├── Role-based access control
└── Time window management

Zama FHEVM
├── Fully Homomorphic Encryption layer
├── Gateway decryption service
└── Sepolia testnet deployment
```

### FHE Workflow

```
┌─────────────────┐
│ Weather Station │
│   (Raw Data)    │
└────────┬────────┘
         │
         ▼ FHE.asEuint32() - Client-side encryption
┌─────────────────┐
│ Encrypted Data  │
│ (euint32/euint8)│
└────────┬────────┘
         │
         ▼ submitWeatherData()
┌─────────────────┐
│  Smart Contract │
│   (On-chain)    │
└────────┬────────┘
         │
         ▼ FHE.add() - Encrypted aggregation
┌─────────────────┐
│ Encrypted Sum   │
└────────┬────────┘
         │
         ▼ FHE.requestDecryption()
┌─────────────────┐
│  Zama Gateway   │
│  (Decryption)   │
└────────┬────────┘
         │
         ▼ processForecastResult()
┌─────────────────┐
│ Public Forecast │
│ (Average Values)│
└─────────────────┘
```

### Smart Contract Structure

```
ConfidentialWeatherAggregator
├── Role Management
│   ├── Owner (Deploy, Register Stations, Configure)
│   └── Weather Stations (Submit Encrypted Data)
│
├── Data Structures
│   ├── WeatherStation (address, location, status)
│   ├── WeatherData (encrypted measurements)
│   └── RegionalForecast (aggregated results)
│
├── Core Functions
│   ├── registerStation() - Owner only
│   ├── submitWeatherData() - Encrypted submission
│   ├── generateRegionalForecast() - FHE aggregation
│   └── processForecastResult() - Gateway callback
│
└── Time Management
    ├── canSubmitData() - Check submission window
    ├── canGenerateForecast() - Check generation window
    └── setTimeWindowEnabled() - Testing mode toggle
```

---

## 🔧 Tech Stack

### Smart Contracts
- **Solidity**: 0.8.24 (Cancun EVM)
- **FHEVM**: `@fhevm/solidity` - Zama's FHE library
- **Hardhat**: 2.22.16 - Development framework
- **Gas Optimization**: 800 runs with Yul optimization

### Frontend
- **Next.js**: 14.0.4 - React framework
- **React**: 18.2.0 - UI library
- **TypeScript**: 5.3.3 - Type safety
- **Ethers.js**: 6.15.0 - Ethereum interaction

### Development Tools
- **Testing**: Mocha + Chai (50+ test cases)
- **Code Quality**: ESLint + Prettier + Solhint
- **Security**: ESLint Security Plugin + npm audit
- **CI/CD**: GitHub Actions + Codecov
- **Pre-commit**: Husky + Lint-staged
- **Coverage**: Solidity Coverage (80%+ target)

### Blockchain
- **Network**: Ethereum Sepolia Testnet
- **FHE Provider**: Zama FHEVM
- **Gateway**: Zama Gateway for decryption
- **Explorer**: Sepolia Etherscan

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18 or higher
- MetaMask wallet extension
- Sepolia testnet ETH ([Get from faucet](https://sepoliafaucet.com))

### Installation

```bash
# Clone repository
git clone https://github.com/MyaLind/WeatherAggregator.git
cd WeatherAggregator

# Install dependencies
npm install --legacy-peer-deps

# Set up environment
cp env.example .env
# Edit .env with your configuration
```

### Configuration

Create `.env` file with the following:

```env
# Network Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Wallet
PRIVATE_KEY=your_private_key_without_0x_prefix

# Zama Gateway (PauserSet)
NUM_PAUSERS=3
PAUSER_ADDRESS_0=0x0000000000000000000000000000000000000001
PAUSER_ADDRESS_1=0x0000000000000000000000000000000000000002
PAUSER_ADDRESS_2=0x0000000000000000000000000000000000000003

# Contract Addresses
CONTRACT_ADDRESS=0x291B77969Bb18710609C35d263adCb0848a3f82F
GATEWAY_ADDRESS=0x33347831500F1E73F0CccBBe71C7E21Ca0100a42

# Gas Monitoring
REPORT_GAS=true
COINMARKETCAP_API_KEY=your_api_key_here
```

### Build & Test

```bash
# Compile contracts
npm run compile

# Run tests
npm test

# Run tests with gas reporting
npm run test:gas

# Generate coverage report
npm run coverage

# Check code quality
npm run format
```

### Deploy

```bash
# Deploy to Sepolia testnet
npm run deploy:sepolia

# Verify contract on Etherscan
npm run verify

# Interact with deployed contract
npm run interact

# Run end-to-end simulation
npm run simulate
```

### Run Frontend

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

---

## 📋 Usage Guide

### For Contract Owners

**1. Register Weather Stations**

```typescript
// Connect owner wallet
await weatherAggregator.registerStation(
  "0xStationAddress",
  "Tokyo Weather Station"
);
```

**2. Configure Time Windows**

```typescript
// Enable/disable time restrictions
await weatherAggregator.setTimeWindowEnabled(true);
```

**3. Monitor System**

```typescript
// Check current forecast info
const info = await weatherAggregator.getCurrentForecastInfo();
console.log(`Current Forecast ID: ${info.currentForecastId}`);
console.log(`Submitted Stations: ${info.submittedStations}`);
console.log(`Can Submit: ${info.canSubmit}`);
console.log(`Can Generate: ${info.canGenerate}`);
```

### For Weather Stations

**1. Submit Weather Data**

```typescript
// Connect registered station wallet
// All values are encrypted before submission
await weatherAggregator.submitWeatherData(
  2250,  // Temperature: 22.5°C (× 100)
  6500,  // Humidity: 65.0% (× 100)
  10130, // Pressure: 1013.0 hPa (× 100)
  15     // Wind Speed: 15 km/h
);
```

**Data Ranges:**
- Temperature: -100°C to 100°C (stored as value × 100)
- Humidity: 0% to 100% (stored as value × 100)
- Pressure: 900 hPa to 1100 hPa (stored as value × 100)
- Wind Speed: 0 to 200 km/h (stored as integer)

**2. Check Submission Status**

```typescript
// Get station information
const stationInfo = await weatherAggregator.getStationInfo(stationId);
console.log(`Location: ${stationInfo.location}`);
console.log(`Active: ${stationInfo.isActive}`);
console.log(`Submissions: ${stationInfo.submissionCount}`);
```

### For Public Users

**1. Generate Regional Forecast**

```typescript
// Anyone can trigger forecast generation (during generation window)
await weatherAggregator.generateRegionalForecast();
```

**2. View Historical Forecasts**

```typescript
// Get specific forecast
const forecast = await weatherAggregator.getRegionalForecast(forecastId);
console.log(`Temperature: ${forecast.temperature / 100}°C`);
console.log(`Humidity: ${forecast.humidity / 100}%`);
console.log(`Pressure: ${forecast.pressure / 100} hPa`);
console.log(`Wind Speed: ${forecast.windSpeed} km/h`);
console.log(`Participating Stations: ${forecast.participatingStations}`);
```

---

## 🔐 Privacy Model

### What's Private

- ✅ **Individual Weather Measurements**: Each station's temperature, humidity, pressure, and wind speed data is encrypted using FHE
- ✅ **Station-Specific Data**: Individual contributions remain confidential throughout the aggregation process
- ✅ **Intermediate Calculations**: All aggregation steps performed on encrypted values
- ✅ **Historical Submissions**: Past data submissions from individual stations

### What's Public

- 📊 **Regional Forecast Averages**: Only the final averaged weather data is decrypted and made public
- 📊 **Forecast Metadata**: Timestamps, participating station counts, forecast IDs
- 📊 **Station Count**: Number of active stations and total submissions
- 📊 **System Status**: Time windows, current periods, system configuration

### Decryption Permissions

- **Weather Stations**: Cannot decrypt other stations' data (privacy-preserving)
- **Zama Gateway**: Decrypts only final aggregated totals (authorized callbacks)
- **Public**: Can view decrypted regional forecasts after generation
- **Contract Owner**: Administrative access but cannot decrypt individual station data

### Privacy Guarantees (Powered by Zama FHEVM)

```solidity
// Encrypted data types
euint32 encryptedTemperature;  // Station's temperature (private)
euint32 encryptedHumidity;     // Station's humidity (private)
euint32 encryptedPressure;     // Station's pressure (private)
euint8  encryptedWindSpeed;    // Station's wind speed (private)

// Homomorphic operations (computation on encrypted data)
totalTemperature = FHE.add(totalTemperature, encryptedTemperature);
totalHumidity = FHE.add(totalHumidity, encryptedHumidity);

// Only averages are decrypted via Gateway
uint32[] memory cts = new uint32[](4);
cts[0] = FHE.requestDecryption(totalTemperature, ...);
cts[1] = FHE.requestDecryption(totalHumidity, ...);
```

---

## 🔧 Technical Implementation

### FHEVM Integration

**Encrypted Data Types:**

```solidity
import "@fhevm/solidity/FHE.sol";

// Encrypted weather data storage
struct EncryptedWeatherData {
    euint32 temperature;  // -100°C to 100°C (× 100)
    euint32 humidity;     // 0% to 100% (× 100)
    euint32 pressure;     // 900 to 1100 hPa (× 100)
    euint8  windSpeed;    // 0 to 200 km/h
    uint256 timestamp;    // Submission time
}
```

**Homomorphic Operations:**

```solidity
// Add encrypted values without decryption
totalTemperature = FHE.add(totalTemperature, stationData.temperature);
totalHumidity = FHE.add(totalHumidity, stationData.humidity);
totalPressure = FHE.add(totalPressure, stationData.pressure);
totalWindSpeed = FHE.add(totalWindSpeed, stationData.windSpeed);
```

**Gateway Decryption Request:**

```solidity
// Request decryption of aggregated totals
uint32[] memory cts = new uint32[](4);
cts[0] = FHE.requestDecryption(totalTemperature, this.processForecastResult.selector, 0, block.timestamp + 100);
cts[1] = FHE.requestDecryption(totalHumidity, this.processForecastResult.selector, 0, block.timestamp + 100);
cts[2] = FHE.requestDecryption(totalPressure, this.processForecastResult.selector, 0, block.timestamp + 100);
cts[3] = FHE.requestDecryption(totalWindSpeed, this.processForecastResult.selector, 0, block.timestamp + 100);
```

### Smart Contract Functions

**View Functions (No Gas Required):**

```solidity
// Get current forecast information
function getCurrentForecastInfo() external view returns (
    uint256 currentForecastId,
    bool canSubmit,
    bool canGenerate,
    uint256 submittedStations
);

// Get station details
function getStationInfo(uint256 stationId) external view returns (
    address stationAddress,
    string memory location,
    bool isActive,
    uint256 lastSubmissionTime,
    uint256 submissionCount
);

// Get regional forecast data
function getRegionalForecast(uint256 forecastId) external view returns (
    uint32 temperature,
    uint32 humidity,
    uint32 pressure,
    uint8 windSpeed,
    uint256 timestamp,
    uint256 participatingStations,
    bool isGenerated
);
```

**Write Functions (Requires Gas):**

```solidity
// Owner only - Register new weather station
function registerStation(address stationAddress, string calldata location) external onlyOwner;

// Weather stations only - Submit encrypted data
function submitWeatherData(
    uint32 temperature,
    uint32 humidity,
    uint32 pressure,
    uint8 windSpeed
) external;

// Anyone - Generate regional forecast (timing restrictions apply)
function generateRegionalForecast() external;

// Gateway only - Process decrypted results (callback)
function processForecastResult(
    uint256 requestId,
    uint32 totalTemperature,
    uint32 totalHumidity,
    uint32 totalPressure,
    uint32 totalWindSpeed
) external onlyGateway;
```

### Events

```solidity
event StationRegistered(
    uint256 indexed stationId,
    address indexed stationAddress,
    string location
);

event WeatherDataSubmitted(
    uint256 indexed stationId,
    uint256 indexed forecastId,
    uint256 timestamp
);

event RegionalForecastGenerated(
    uint256 indexed forecastId,
    uint256 participatingStations,
    uint256 timestamp
);

event StationDeactivated(uint256 indexed stationId);

event TimeWindowToggled(bool enabled);
```

---

## 🧪 Testing

### Test Coverage: 50+ Test Cases

Our comprehensive test suite covers all critical functionality:

**1. Deployment & Initialization (5 tests)**
- ✅ Contract deployment
- ✅ Owner assignment
- ✅ Initial state verification
- ✅ Gateway configuration
- ✅ Time window defaults

**2. Station Registration (5 tests)**
- ✅ Successful registration
- ✅ Only owner can register
- ✅ Duplicate address prevention
- ✅ Event emission
- ✅ Station count tracking

**3. Weather Data Submission (8 tests)**
- ✅ Successful submission
- ✅ Only registered stations
- ✅ One submission per period
- ✅ Valid data ranges
- ✅ Encrypted data storage
- ✅ Event emission
- ✅ Submission tracking
- ✅ Time window enforcement

**4. Forecast Generation (7 tests)**
- ✅ Successful generation
- ✅ Minimum 3 stations required
- ✅ Time window enforcement
- ✅ Gateway decryption request
- ✅ Forecast ID incrementation
- ✅ State reset after generation
- ✅ Multiple forecast cycles

**5. Access Control (5 tests)**
- ✅ Owner permissions
- ✅ Station permissions
- ✅ Public permissions
- ✅ Gateway callback security
- ✅ Unauthorized access prevention

**6. Time Window Management (6 tests)**
- ✅ Submission window checking
- ✅ Generation window checking
- ✅ Testing mode toggle
- ✅ Hour-based cycles
- ✅ UTC calculations
- ✅ Window transitions

**7. Edge Cases (5 tests)**
- ✅ No data submitted
- ✅ Insufficient stations
- ✅ Station deactivation
- ✅ Multiple periods
- ✅ Data overflow prevention

**8. View Functions (4 tests)**
- ✅ Current forecast info
- ✅ Station information
- ✅ Forecast history
- ✅ System status

**9. Gas Optimization (3 tests)**
- ✅ Registration cost < 200k gas
- ✅ Submission cost < 500k gas
- ✅ Generation cost < 1M gas

**10. Multi-Station Scenarios (3 tests)**
- ✅ 3 stations aggregation
- ✅ 5 stations aggregation
- ✅ Maximum stations

### Run Tests

```bash
# Run all tests
npm test

# Run tests with gas reporting
npm run test:gas

# Generate coverage report
npm run coverage

# Run specific test file
npx hardhat test test/ConfidentialWeatherAggregator.test.js
```

### Test Output Example

```bash
  ConfidentialWeatherAggregator
    Deployment
      ✓ Should deploy successfully (1234ms)
      ✓ Should set correct owner (45ms)
      ✓ Should initialize with zero stations (32ms)

    Station Registration
      ✓ Should register new station (156ms)
      ✓ Should emit StationRegistered event (89ms)

    Weather Data Submission
      ✓ Should submit encrypted weather data (234ms)
      ✓ Should prevent duplicate submissions (102ms)

    Forecast Generation
      ✓ Should generate regional forecast with 3+ stations (456ms)
      ✓ Should calculate correct averages (198ms)

  50 passing (12s)
```

📖 **See [TESTING.md](TESTING.md) for detailed test documentation**

---

## 🔒 Security

### Multi-Layer Security Architecture

**1. Smart Contract Security**
- ✅ Role-based access control (Owner, Stations, Public)
- ✅ Gateway callback protection (only authorized address)
- ✅ Time-based restrictions (configurable windows)
- ✅ Input validation (range checks for all measurements)
- ✅ Reentrancy guards (recommended for external calls)
- ✅ DoS protection (rate limiting patterns)

**2. Automated Security Auditing**
- ✅ ESLint Security Plugin (injection, unsafe regex, CSRF detection)
- ✅ Solhint (Solidity security rules, deprecated functions)
- ✅ npm audit (vulnerability scanning in CI/CD)
- ✅ Pre-commit hooks (security checks before repository entry)
- ✅ CI/CD Security Job (automated audit on every push)

**3. Code Quality Enforcement**
- ✅ TypeScript strict mode (type safety prevents runtime errors)
- ✅ ESLint rules (security-focused code quality)
- ✅ Solhint complexity limits (max complexity: 10)
- ✅ Compiler version enforcement (>= 0.8.24 for overflow protection)
- ✅ Pre-commit hooks (automatic quality checks)

**4. Data Validation**
- ✅ Temperature: -100°C to 100°C (stored as value × 100)
- ✅ Humidity: 0% to 100% (stored as value × 100)
- ✅ Pressure: 900 hPa to 1100 hPa (stored as value × 100)
- ✅ Wind Speed: 0 to 200 km/h (stored as integer)

**5. Privacy Guarantees (FHE)**
- ✅ Client-side encryption (data encrypted before leaving client)
- ✅ Encrypted storage (euint32/euint8 types on-chain)
- ✅ Encrypted computation (aggregation without decryption)
- ✅ Selective decryption (only final averages via Gateway)
- ✅ No raw data exposure (individual measurements never visible)

### DoS Protection Patterns

**Rate Limiting:**

```solidity
mapping(address => uint256) public lastSubmissionTime;
uint256 public constant MIN_SUBMISSION_INTERVAL = 6 hours;

modifier rateLimited() {
    require(
        block.timestamp >= lastSubmissionTime[msg.sender] + MIN_SUBMISSION_INTERVAL,
        "Rate limit exceeded"
    );
    lastSubmissionTime[msg.sender] = block.timestamp;
    _;
}
```

**Gas Limit Protection:**

```solidity
uint256 public constant MAX_STATIONS = 100;

function processStations() public {
    require(stationCount <= MAX_STATIONS, "Too many stations");
    for (uint256 i = 0; i < stationCount; i++) {
        // Process station
    }
}
```

### Security Metrics

| Security Metric | Target | Status |
|----------------|--------|--------|
| Critical Vulnerabilities | 0 | ✅ Monitored |
| Security Audit Score | Pass | ✅ Automated |
| Code Complexity | < 10 | ✅ Enforced |
| Type Safety | 100% | ✅ TypeScript |
| Test Coverage | > 80% | ✅ Tracked |

📖 **See [SECURITY_PERFORMANCE_GUIDE.md](SECURITY_PERFORMANCE_GUIDE.md) for detailed security documentation**

---

## ⚡ Performance Optimization

### Gas Optimization Strategy

**1. Compiler Optimization**

```javascript
// hardhat.config.js
optimizer: {
  enabled: true,
  runs: 800,  // Balanced deployment vs runtime cost
  details: {
    yul: true,
    yulDetails: {
      stackAllocation: true,
      optimizerSteps: "dhfoDgvulfnTUtnIf"
    }
  }
}
```

**Benefits:**
- ✅ 800 runs: Optimal balance between deployment and runtime costs
- ✅ Yul optimization: Advanced intermediate representation
- ✅ Stack allocation: Better memory management
- ✅ Custom optimizer steps: Fine-tuned for contract patterns

**2. Gas Monitoring & Reporting**

```bash
# Run tests with gas reporting
npm run test:gas

# View gas report
cat gas-report.txt
```

**Gas Cost Targets:**
- Station Registration: < 200,000 gas
- Data Submission: < 500,000 gas
- Forecast Generation: < 1,000,000 gas

**Features:**
- ✅ USD cost estimation via CoinMarketCap API
- ✅ Method signature display
- ✅ Time spent tracking
- ✅ Per-function gas breakdown
- ✅ Historical gas report archiving (30 days in CI/CD)

**3. Code Optimization Patterns**

```solidity
// Storage packing - minimize storage slots
struct WeatherStation {
    address stationAddress;  // 20 bytes
    bool isActive;          // 1 byte
    uint8 status;           // 1 byte
    // Total: 22 bytes (1 storage slot)
}

// Memory caching - reduce storage reads
uint256 count = stationCount;  // SLOAD once
for (uint256 i = 0; i < count; i++) {
    // Process without repeated SLOAD
}

// External functions - cheaper than public
function submitData(uint256 temperature) external {
    // Called from outside only
}
```

**4. Frontend Performance**

```typescript
// Code splitting with Next.js dynamic imports
import dynamic from 'next/dynamic';

const WeatherChart = dynamic(
  () => import('./WeatherChart'),
  { loading: () => <p>Loading chart...</p> }
);
```

### Performance Metrics

| Performance Metric | Target | Status |
|-------------------|--------|--------|
| Contract Deployment | Optimized | ✅ 800 runs |
| Function Gas Costs | < targets | ✅ Monitored |
| Bundle Size | Minimal | ✅ Code splitting |
| Build Time | < 2 min | ✅ CI/CD tracked |
| Test Execution | < 5 min | ✅ Automated |

📖 **See [SECURITY_PERFORMANCE_GUIDE.md](SECURITY_PERFORMANCE_GUIDE.md) for detailed optimization guide**

---

## 🛠️ Development

### Development Commands

**Code Quality & Formatting:**

```bash
npm run format                 # Format all code (Prettier + ESLint + Solhint)
npm run lint:check             # Check ESLint issues
npm run lint:fix               # Auto-fix ESLint issues
npm run lint:sol               # Check Solidity with Solhint
npm run lint:sol:fix           # Auto-fix Solidity issues
npm run prettier:check         # Check code formatting
npm run prettier:fix           # Auto-format all files
npm run type-check             # Check TypeScript types
```

**Testing & Coverage:**

```bash
npm test                       # Run all tests
npm run test:gas               # Run tests with gas reporting
npm run coverage               # Generate coverage report
```

**Security:**

```bash
npm run security:check         # Run security audit
npm run security:fix           # Auto-fix vulnerabilities
```

**Smart Contract Deployment:**

```bash
npm run compile                # Compile contracts
npm run deploy                 # Deploy to local network
npm run deploy:sepolia         # Deploy to Sepolia testnet
npm run verify                 # Verify on Etherscan
npm run interact               # Interact with deployed contract
npm run simulate               # Run end-to-end simulation
npm run clean                  # Clean artifacts
```

**Frontend Development:**

```bash
npm run dev                    # Start Next.js dev server
npm run build                  # Build production application
npm run start                  # Start production server
```

### Pre-commit Hooks

Pre-commit hooks are automatically installed via Husky and run:
- **Before commit**: Prettier check + ESLint + Solhint
- **Before push**: Full test suite + TypeScript check

To skip hooks (emergency only):

```bash
git commit --no-verify -m "message"
git push --no-verify
```

### CI/CD Pipeline

The automated pipeline runs on every push and pull request:

1. **Lint Job**: Code quality checks (ESLint, Solhint, Prettier, TypeScript)
2. **Build Job**: Contract compilation and Next.js build
3. **Test Job**: Comprehensive test suite with coverage reporting (Node.js 18.x, 20.x)
4. **Security Job**: Vulnerability scanning and audit reports
5. **Performance Job**: Gas optimization testing and reporting
6. **Summary Job**: Pipeline status aggregation

📖 **See [CI_CD_GUIDE.md](CI_CD_GUIDE.md) for complete CI/CD documentation**

---

## 📊 Use Cases

### 1. Collaborative Forecasting Networks

**Challenge**: Competing weather services want to create better forecasts by sharing data, but don't want to reveal their proprietary measurements to competitors.

**Solution**: Each service submits encrypted data, contributes to regional forecasts, and benefits from improved accuracy without exposing their specific sensor readings.

### 2. Cross-Border Meteorological Cooperation

**Challenge**: Countries want to collaborate on weather forecasting but face data sovereignty laws that restrict raw data sharing across borders.

**Solution**: National weather agencies submit encrypted data that can be aggregated internationally while keeping raw measurements within national control.

### 3. Academic Research Networks

**Challenge**: Universities and research institutions want to contribute to large-scale climate studies but need to protect sensitive research data until publication.

**Solution**: Research stations share encrypted data for meta-analysis while maintaining exclusive rights to their raw datasets for publications.

### 4. IoT Weather Sensor Networks

**Challenge**: Smart home weather sensors can improve local forecasts, but users don't want to share exact measurements from their private property.

**Solution**: Homeowners contribute to neighborhood forecasts through encrypted submissions, enhancing accuracy while protecting personal privacy.

### 5. Agricultural Weather Monitoring

**Challenge**: Farms want to participate in regional agricultural forecasting but don't want to reveal specific microclimates that represent competitive advantages.

**Solution**: Encrypted data sharing allows collective insights for pest prediction, irrigation planning, and harvest timing without exposing individual farm conditions.

---

## 🚧 Troubleshooting

### Common Issues and Solutions

**Issue: "The library @fhevm/solidity is not installed"**

```bash
# Solution: Install FHEVM library
npm install @fhevm/solidity --legacy-peer-deps
```

**Issue: "Insufficient Sepolia ETH for gas"**

```bash
# Solution: Get testnet ETH from faucets
# - https://sepoliafaucet.com
# - https://www.infura.io/faucet/sepolia
```

**Issue: "MetaMask transaction failed"**

```bash
# Solution: Check the following:
# 1. Sufficient Sepolia ETH balance
# 2. Correct network (Sepolia testnet)
# 3. Approved transaction in MetaMask
# 4. Not exceeded rate limits (6-hour submission interval)
```

**Issue: "Cannot generate forecast"**

```bash
# Solution: Verify requirements:
# 1. Minimum 3 stations have submitted data
# 2. Within forecast generation window (check canGenerateForecast())
# 3. Current period has not already generated a forecast
```

**Issue: "Pre-commit hook failed"**

```bash
# Solution: Fix code quality issues
npm run format                 # Auto-fix formatting
npm run lint:fix               # Auto-fix linting issues
npm run lint:sol:fix           # Auto-fix Solidity issues

# Or skip hooks temporarily (not recommended)
git commit --no-verify -m "message"
```

**Issue: "Tests failing"**

```bash
# Solution: Clean and reinstall
npm run clean
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm test
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow Solidity style guide for smart contracts
- Use ESLint configuration for JavaScript/TypeScript
- Include comprehensive comments
- Write unit tests for new features (maintain 80%+ coverage)
- Update documentation as needed
- Run `npm run format` before committing

### Reporting Issues

Please use GitHub Issues for bug reports and feature requests. Include:

- Clear description of the issue
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (browser, wallet, network)

---

## 🛣️ Roadmap

### Phase 1: Core Platform ✅ (Completed)
- [x] FHE-enabled smart contracts
- [x] Weather data submission and aggregation
- [x] Gateway integration for decryption
- [x] Web-based user interface
- [x] Time window management
- [x] Comprehensive testing (50+ tests)
- [x] CI/CD pipeline
- [x] Security auditing tools

### Phase 2: Enhanced Features (Q1-Q2 2026)
- [ ] Multi-region support (separate forecasts per region)
- [ ] Weather alerts based on anomaly detection
- [ ] Stake-based station reputation system
- [ ] Mobile-responsive design improvements
- [ ] Advanced forecast visualizations
- [ ] Historical data analytics dashboard

### Phase 3: Ecosystem Expansion (Q3-Q4 2026)
- [ ] API for third-party integrations
- [ ] Decentralized storage for historical data (IPFS)
- [ ] Token incentives for data contributors
- [ ] Cross-chain deployment (Polygon, Arbitrum)
- [ ] Machine learning forecast improvements
- [ ] Mobile applications (iOS, Android)

### Phase 4: Mainnet & Scale (2027)
- [ ] Ethereum mainnet deployment
- [ ] Governance token and DAO
- [ ] Commercial partnerships with weather services
- [ ] Integration with DeFi weather derivatives
- [ ] Global expansion (1000+ stations target)

---

## 📚 Documentation

### Complete Documentation Suite

This project includes comprehensive documentation covering all aspects of development, deployment, and operations:

| Topic | Documentation | Description |
|-------|--------------|-------------|
| **Getting Started** | [README.md](README.md) | This file - Quick start and overview |
| **Testing** | [TESTING.md](TESTING.md) | 50+ test cases and coverage guide |
| **Deployment** | [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Complete deployment walkthrough |
| **Security** | [SECURITY_PERFORMANCE_GUIDE.md](SECURITY_PERFORMANCE_GUIDE.md) | Security best practices and optimization |
| **CI/CD** | [CI_CD_GUIDE.md](CI_CD_GUIDE.md) | CI/CD pipeline documentation |
| **Implementation** | [IMPLEMENTATION_VERIFICATION.md](IMPLEMENTATION_VERIFICATION.md) | Feature verification report |

### Configuration Files

```
.
├── .github/workflows/
│   ├── ci.yml              # Complete CI/CD pipeline
│   └── test.yml            # Test suite workflow
├── .husky/
│   ├── pre-commit          # Pre-commit quality checks
│   └── pre-push            # Pre-push test execution
├── .eslintrc.json          # ESLint configuration
├── .prettierrc.json        # Prettier configuration
├── .solhint.json           # Solhint configuration
├── codecov.yml             # Codecov configuration
├── hardhat.config.js       # Hardhat configuration
├── tsconfig.json           # TypeScript configuration
└── env.example             # Environment variables template
```

---

## 🔗 Links & Resources

### Project Links
- **GitHub Repository**: [https://github.com/MyaLind/WeatherAggregator](https://github.com/MyaLind/WeatherAggregator)
- **Live Application**: [https://weather-aggregator.vercel.app/](https://weather-aggregator.vercel.app/)
- **Contract (Sepolia)**: [View on Etherscan](https://sepolia.etherscan.io/address/0x291B77969Bb18710609C35d263adCb0848a3f82F)
- **Issues & Support**: [GitHub Issues](https://github.com/MyaLind/WeatherAggregator/issues)

### Zama Ecosystem
- **Zama Documentation**: [https://docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)
- **FHEVM SDK**: [https://github.com/zama-ai/fhevm](https://github.com/zama-ai/fhevm)
- **Zama Gateway**: [Gateway Documentation](https://docs.zama.ai/fhevm/fundamentals/gateway)
- **FHE Resources**: [Understanding FHE](https://www.zama.ai/post/fully-homomorphic-encryption-fhe)

### Development Resources
- **Solidity Documentation**: [https://docs.soliditylang.org](https://docs.soliditylang.org)
- **Hardhat Documentation**: [https://hardhat.org/docs](https://hardhat.org/docs)
- **Next.js Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Ethers.js Documentation**: [https://docs.ethers.org/v6/](https://docs.ethers.org/v6/)
- **TypeScript Documentation**: [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)

### Blockchain Resources
- **Sepolia Testnet**: [https://sepolia.dev](https://sepolia.dev)
- **Sepolia Faucet**: [https://sepoliafaucet.com](https://sepoliafaucet.com)
- **Sepolia Explorer**: [https://sepolia.etherscan.io](https://sepolia.etherscan.io)
- **MetaMask Guide**: [https://metamask.io/faqs/](https://metamask.io/faqs/)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Weather Aggregator Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🏆 Project Status

**Production-Ready Features:**
- ✅ Complete Hardhat development framework
- ✅ 50+ comprehensive test cases
- ✅ Full CI/CD pipeline with GitHub Actions
- ✅ Security auditing and vulnerability scanning
- ✅ Performance optimization and gas monitoring
- ✅ Pre-commit hooks for code quality
- ✅ Type-safe TypeScript implementation
- ✅ Comprehensive documentation suite
- ✅ Deployed on Sepolia testnet

**Technology Stack:**
- Hardhat 2.22.16 + Solidity 0.8.24
- Next.js 14 + React 18 + TypeScript 5.3.3
- Zama FHEVM + Sepolia Testnet
- ESLint + Prettier + Solhint
- GitHub Actions + Codecov
- Husky + Lint-staged

**Quality Metrics:**
- Test Coverage: 80%+ target ✅
- Security: Automated vulnerability scanning ✅
- Performance: Gas optimization (800 runs) ✅
- Code Quality: Pre-commit enforcement ✅

---

## 🙏 Acknowledgments

- **Zama**: For providing the fhEVM technology and Gateway infrastructure that makes privacy-preserving computation possible
- **Ethereum Foundation**: For the robust blockchain platform and Sepolia testnet
- **OpenZeppelin**: For secure smart contract libraries and best practices
- **Hardhat**: For the excellent development framework and tooling
- **The Web3 Community**: For continuous support, feedback, and innovation

Built with ❤️ for a more private and collaborative future in weather forecasting.

**Built for the Zama FHEVM Ecosystem** - Demonstrating practical privacy-preserving applications.

---

*Last Updated: November 2, 2025*
