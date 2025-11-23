# API Reference

## ConfidentialWeatherAggregatorV3 Smart Contract API

### Table of Contents

1. [Admin Functions](#admin-functions)
2. [Station Management](#station-management)
3. [Data Submission](#data-submission)
4. [Forecast Generation](#forecast-generation)
5. [View Functions](#view-functions)
6. [Events](#events)
7. [Data Structures](#data-structures)

---

## Admin Functions

### setTimeWindowEnabled

```solidity
function setTimeWindowEnabled(bool enabled) external onlyOwner
```

Toggle time window enforcement for data submission and forecast generation.

**Parameters:**
- `enabled` (bool): Whether to enable time window checks

**Access Control:** Owner only

**Events Emitted:**
- `TimeWindowToggled(bool enabled)`

**Usage Example:**
```javascript
// Disable time windows for testing
await contract.setTimeWindowEnabled(false);

// Enable time windows for production
await contract.setTimeWindowEnabled(true);
```

---

## Station Management

### registerStation

```solidity
function registerStation(address stationAddress, string calldata location) external onlyOwner
```

Register a new weather station to participate in data submission.

**Parameters:**
- `stationAddress` (address): Ethereum address of the weather station
- `location` (string): Geographic location identifier (e.g., "New York, USA")

**Access Control:** Owner only

**Requirements:**
- `stationAddress` must not be zero address
- Station must not already be registered
- Location string must not be empty

**Events Emitted:**
- `StationRegistered(uint256 indexed stationId, address indexed stationAddress, string location)`

**Usage Example:**
```javascript
await contract.registerStation(
    "0x1234567890123456789012345678901234567890",
    "London, UK"
);
```

**Returns:** Implicitly assigns incremental `stationId` (1, 2, 3, ...)

---

### deactivateStation

```solidity
function deactivateStation(uint256 stationId, string calldata reason) external onlyOwner
```

Deactivate a weather station, preventing further data submissions.

**Parameters:**
- `stationId` (uint256): ID of the station to deactivate
- `reason` (string): Reason for deactivation (for audit trail)

**Access Control:** Owner only

**Requirements:**
- `stationId` must be valid (1 to stationCount)
- Station must currently be active

**Events Emitted:**
- `StationDeactivated(uint256 indexed stationId, string reason)`
- `SecurityAlert(string alertType, uint256 indexed relatedId, string details)`

**Usage Example:**
```javascript
await contract.deactivateStation(3, "Unreliable data submissions");
```

---

## Data Submission

### submitWeatherData

```solidity
function submitWeatherData(
    uint32 temperature,
    uint32 humidity,
    uint32 pressure,
    uint8 windSpeed
) external onlyActiveStation validForecastPeriod nonReentrant
```

Submit encrypted weather data for the current forecast period.

**Parameters:**
- `temperature` (uint32): Temperature in Celsius × 100 (e.g., 2550 = 25.50°C)
- `humidity` (uint32): Humidity percentage × 100 (e.g., 6500 = 65.00%)
- `pressure` (uint32): Pressure in hPa × 100 (e.g., 101325 = 1013.25 hPa)
- `windSpeed` (uint8): Wind speed in km/h (e.g., 45)

**Access Control:** Only active registered stations

**Requirements:**
- Must be called during valid submission time window
- Station must not have already submitted data for current period
- Temperature must be ≤ 10,000 (max 100°C)
- Humidity must be ≤ 10,000 (max 100%)
- Pressure must be ≤ 110,000 (max 1100 hPa)
- Wind speed must be ≤ 200 km/h

**Events Emitted:**
- `WeatherDataSubmitted(uint256 indexed stationId, uint256 indexed forecastId, uint256 timestamp)`

**Usage Example:**
```javascript
// Submit: 25.50°C, 65.00% humidity, 1013.25 hPa, 45 km/h wind
await contract.submitWeatherData(
    2550,   // temperature
    6500,   // humidity
    101325, // pressure
    45      // windSpeed
);
```

**Gas Optimization:**
- Data is encrypted on-chain using FHE.asEuint32/asEuint8
- Consumes HCU (Homomorphic Computation Units) for encryption

---

## Forecast Generation

### generateRegionalForecast

```solidity
function generateRegionalForecast() external nonReentrant
```

Aggregate encrypted weather data and request decryption via Gateway callback.

**Parameters:** None

**Access Control:** Public (anyone can trigger)

**Requirements:**
- Must be called during valid forecast generation period
- Forecast must not already be processed (status must be `Pending`)
- Minimum 3 stations must have submitted data

**Process:**
1. Aggregates encrypted data from all participating stations
2. Applies privacy-preserving multiplication (PRIVACY_MULTIPLIER = 1000)
3. Requests decryption from Zama Gateway
4. Sets status to `DecryptionRequested`
5. Records request timestamp for timeout protection

**Events Emitted:**
- `ForecastRequested(uint256 indexed forecastId, uint256 requestId, uint256 participatingStations)`

**Usage Example:**
```javascript
// Check if generation is allowed
const canGenerate = await contract.canGenerateForecast();
if (canGenerate) {
    await contract.generateRegionalForecast();
}
```

**Gas Cost:**
- High HCU usage due to homomorphic additions and multiplications
- Scales with number of participating stations

---

### processForecastCallback

```solidity
function processForecastCallback(
    uint256 requestId,
    bytes memory cleartexts,
    bytes memory decryptionProof
) external nonReentrant
```

**⚠️ INTERNAL USE ONLY - Called by Zama Gateway**

Gateway callback function to process decrypted forecast results.

**Parameters:**
- `requestId` (uint256): The decryption request ID
- `cleartexts` (bytes): ABI-encoded decrypted values (uint32, uint32, uint32, uint32)
- `decryptionProof` (bytes): Cryptographic proof of valid decryption

**Access Control:** Verified via FHE.checkSignatures (Gateway only)

**Security Features:**
- Signature verification to ensure authentic Gateway callback
- Replay attack prevention via `processedRequests` mapping
- Timeout check (24-hour limit)
- Reentrancy protection

**Events Emitted:**
- `ForecastCompleted(uint256 indexed forecastId, uint256 participatingStations, uint256 timestamp)` (on success)
- `ForecastTimedOut(uint256 indexed forecastId)` (on timeout)
- `RefundIssued(uint256 indexed forecastId, string reason)` (on failure/timeout)

**Usage Example:**
```javascript
// This function is called automatically by the Gateway
// Manual invocation will fail signature verification
```

---

### handleDecryptionFailure

```solidity
function handleDecryptionFailure(uint256 forecastId, string calldata reason) external onlyOwner
```

Manually mark a forecast as failed and trigger refund process.

**Parameters:**
- `forecastId` (uint256): ID of the forecast that failed
- `reason` (string): Reason for failure (for audit trail)

**Access Control:** Owner only

**Requirements:**
- Forecast must be in `DecryptionRequested` status

**Events Emitted:**
- `ForecastFailed(uint256 indexed forecastId, string reason)`
- `RefundIssued(uint256 indexed forecastId, string reason)`
- `SecurityAlert(string alertType, uint256 indexed relatedId, string details)`

**Usage Example:**
```javascript
await contract.handleDecryptionFailure(5, "Gateway timeout exceeded");
```

---

### checkTimeout

```solidity
function checkTimeout(uint256 forecastId) external
```

Check if a forecast request has timed out and update status accordingly.

**Parameters:**
- `forecastId` (uint256): ID of the forecast to check

**Access Control:** Public (anyone can trigger)

**Requirements:**
- Forecast must be in `DecryptionRequested` status
- Block timestamp must exceed `requestTimestamp + DECRYPTION_TIMEOUT` (24 hours)

**Events Emitted:**
- `ForecastTimedOut(uint256 indexed forecastId)`
- `RefundIssued(uint256 indexed forecastId, string reason)`

**Usage Example:**
```javascript
// Monitor and trigger timeout check for pending forecasts
await contract.checkTimeout(5);
```

---

## View Functions

### canSubmitData

```solidity
function canSubmitData() public view returns (bool)
```

Check if stations can currently submit data.

**Returns:**
- `bool`: True if submission is allowed (every 6 hours: 00:00, 06:00, 12:00, 18:00 UTC)

**Usage Example:**
```javascript
const canSubmit = await contract.canSubmitData();
console.log(`Can submit: ${canSubmit}`);
```

---

### canGenerateForecast

```solidity
function canGenerateForecast() public view returns (bool)
```

Check if forecast can currently be generated.

**Returns:**
- `bool`: True if generation is allowed (1 hour after submission window)

**Usage Example:**
```javascript
const canGenerate = await contract.canGenerateForecast();
console.log(`Can generate: ${canGenerate}`);
```

---

### getCurrentForecastInfo

```solidity
function getCurrentForecastInfo() external view returns (
    uint256 currentForecastId,
    bool canSubmit,
    bool canGenerate,
    uint256 submittedStations,
    ForecastStatus status
)
```

Get comprehensive information about the current forecast period.

**Returns:**
- `currentForecastId` (uint256): Current forecast period ID
- `canSubmit` (bool): Whether data submission is allowed
- `canGenerate` (bool): Whether forecast generation is allowed
- `submittedStations` (uint256): Number of stations that submitted data
- `status` (ForecastStatus): Current forecast status (enum)

**Usage Example:**
```javascript
const [forecastId, canSubmit, canGenerate, submitted, status] =
    await contract.getCurrentForecastInfo();

console.log(`Forecast ID: ${forecastId}`);
console.log(`Stations submitted: ${submitted}`);
console.log(`Status: ${status}`); // 0=Pending, 1=Aggregating, 2=DecryptionRequested, etc.
```

---

### getStationInfo

```solidity
function getStationInfo(uint256 stationId) external view returns (
    address stationAddress,
    string memory location,
    bool isActive,
    uint256 lastSubmissionTime,
    uint256 submissionCount,
    uint256 reputation
)
```

Get detailed information about a weather station.

**Parameters:**
- `stationId` (uint256): Station ID to query

**Returns:**
- `stationAddress` (address): Ethereum address of the station
- `location` (string): Geographic location
- `isActive` (bool): Whether station is currently active
- `lastSubmissionTime` (uint256): Unix timestamp of last submission
- `submissionCount` (uint256): Total number of submissions
- `reputation` (uint256): Station reputation score (0-100)

**Usage Example:**
```javascript
const [address, location, isActive, lastTime, count, reputation] =
    await contract.getStationInfo(1);

console.log(`Station: ${location}`);
console.log(`Active: ${isActive}`);
console.log(`Submissions: ${count}`);
console.log(`Reputation: ${reputation}%`);
```

---

### getRegionalForecast

```solidity
function getRegionalForecast(uint256 forecastId) external view returns (
    uint32 temperature,
    uint32 humidity,
    uint32 pressure,
    uint8 windSpeed,
    uint256 timestamp,
    uint256 participatingStations,
    ForecastStatus status
)
```

Get completed forecast data (only available after successful decryption).

**Parameters:**
- `forecastId` (uint256): Forecast period ID to query

**Returns:**
- `temperature` (uint32): Average temperature (Celsius × 100)
- `humidity` (uint32): Average humidity (percentage × 100)
- `pressure` (uint32): Average pressure (hPa × 100)
- `windSpeed` (uint8): Average wind speed (km/h)
- `timestamp` (uint256): Unix timestamp when forecast was completed
- `participatingStations` (uint256): Number of stations that contributed data
- `status` (ForecastStatus): Forecast status (3 = Completed)

**Usage Example:**
```javascript
const [temp, humidity, pressure, wind, timestamp, stations, status] =
    await contract.getRegionalForecast(5);

if (status === 3) { // ForecastStatus.Completed
    console.log(`Temperature: ${temp / 100}°C`);
    console.log(`Humidity: ${humidity / 100}%`);
    console.log(`Pressure: ${pressure / 100} hPa`);
    console.log(`Wind Speed: ${wind} km/h`);
}
```

---

### hasStationSubmitted

```solidity
function hasStationSubmitted(uint256 stationId) external view returns (bool)
```

Check if a specific station has submitted data for the current period.

**Parameters:**
- `stationId` (uint256): Station ID to check

**Returns:**
- `bool`: True if station submitted data for current forecast period

**Usage Example:**
```javascript
const hasSubmitted = await contract.hasStationSubmitted(1);
console.log(`Station 1 submitted: ${hasSubmitted}`);
```

---

### getActiveStationCount

```solidity
function getActiveStationCount() external view returns (uint256)
```

Get total number of active weather stations.

**Returns:**
- `uint256`: Count of active stations

**Usage Example:**
```javascript
const activeCount = await contract.getActiveStationCount();
console.log(`Active stations: ${activeCount}`);
```

---

### getCurrentHour

```solidity
function getCurrentHour() external view returns (uint256)
```

Get current UTC hour for timing validation.

**Returns:**
- `uint256`: Current hour (0-23 UTC)

**Usage Example:**
```javascript
const hour = await contract.getCurrentHour();
console.log(`Current UTC hour: ${hour}`);
```

---

### getForecastStatus

```solidity
function getForecastStatus(uint256 forecastId) external view returns (
    ForecastStatus status,
    uint256 requestId,
    uint256 requestTimestamp,
    bool isTimedOut
)
```

Get detailed status information for a forecast.

**Parameters:**
- `forecastId` (uint256): Forecast period ID to query

**Returns:**
- `status` (ForecastStatus): Current forecast status enum
- `requestId` (uint256): Decryption request ID (0 if not requested)
- `requestTimestamp` (uint256): When decryption was requested
- `isTimedOut` (bool): Whether the request has timed out

**Usage Example:**
```javascript
const [status, requestId, timestamp, timedOut] =
    await contract.getForecastStatus(5);

console.log(`Status: ${status}`);
console.log(`Request ID: ${requestId}`);
console.log(`Timed out: ${timedOut}`);
```

---

## Events

### StationRegistered

```solidity
event StationRegistered(
    uint256 indexed stationId,
    address indexed stationAddress,
    string location
)
```

Emitted when a new weather station is registered.

---

### StationDeactivated

```solidity
event StationDeactivated(
    uint256 indexed stationId,
    string reason
)
```

Emitted when a station is deactivated.

---

### WeatherDataSubmitted

```solidity
event WeatherDataSubmitted(
    uint256 indexed stationId,
    uint256 indexed forecastId,
    uint256 timestamp
)
```

Emitted when a station submits weather data.

---

### ForecastRequested

```solidity
event ForecastRequested(
    uint256 indexed forecastId,
    uint256 requestId,
    uint256 participatingStations
)
```

Emitted when forecast generation is initiated and decryption is requested.

---

### ForecastCompleted

```solidity
event ForecastCompleted(
    uint256 indexed forecastId,
    uint256 participatingStations,
    uint256 timestamp
)
```

Emitted when forecast is successfully completed after Gateway callback.

---

### ForecastFailed

```solidity
event ForecastFailed(
    uint256 indexed forecastId,
    string reason
)
```

Emitted when forecast generation fails.

---

### ForecastTimedOut

```solidity
event ForecastTimedOut(
    uint256 indexed forecastId
)
```

Emitted when a forecast request times out.

---

### RefundIssued

```solidity
event RefundIssued(
    uint256 indexed forecastId,
    string reason
)
```

Emitted when a refund is triggered due to failure or timeout.

---

### TimeWindowToggled

```solidity
event TimeWindowToggled(
    bool enabled
)
```

Emitted when time window enforcement is toggled.

---

### SecurityAlert

```solidity
event SecurityAlert(
    string alertType,
    uint256 indexed relatedId,
    string details
)
```

Emitted for security-related events requiring attention.

---

## Data Structures

### WeatherStation

```solidity
struct WeatherStation {
    address stationAddress;      // Ethereum address of station
    string location;             // Geographic location
    bool isActive;               // Active status
    uint256 lastSubmissionTime;  // Unix timestamp of last submission
    uint256 submissionCount;     // Total submissions
    uint256 reputation;          // Reputation score (0-100)
}
```

---

### WeatherData

```solidity
struct WeatherData {
    euint32 encryptedTemperature; // FHE encrypted temperature
    euint32 encryptedHumidity;    // FHE encrypted humidity
    euint32 encryptedPressure;    // FHE encrypted pressure
    euint8 encryptedWindSpeed;    // FHE encrypted wind speed
    uint256 timestamp;            // Submission timestamp
    bool isSubmitted;             // Submission flag
}
```

---

### RegionalForecast

```solidity
struct RegionalForecast {
    uint32 aggregatedTemperature;   // Average temperature (×100)
    uint32 aggregatedHumidity;      // Average humidity (×100)
    uint32 aggregatedPressure;      // Average pressure (×100)
    uint8 aggregatedWindSpeed;      // Average wind speed
    uint256 timestamp;              // Completion timestamp
    uint256 participatingStations;  // Number of contributing stations
    ForecastStatus status;          // Current status
    uint256 decryptionRequestId;    // Gateway request ID
    uint256 requestTimestamp;       // Request timestamp
    uint256 obfuscationNonce;       // Privacy nonce
}
```

---

### ForecastStatus (Enum)

```solidity
enum ForecastStatus {
    Pending,              // 0: Initial state
    Aggregating,          // 1: Data collection in progress
    DecryptionRequested,  // 2: Waiting for Gateway callback
    Completed,            // 3: Successfully completed
    Failed,               // 4: Decryption failed
    TimedOut              // 5: Request timed out
}
```

---

## Constants

```solidity
MIN_STATIONS_REQUIRED = 3        // Minimum stations for valid forecast
DECRYPTION_TIMEOUT = 24 hours    // Timeout for Gateway callbacks
MAX_TEMPERATURE = 10000          // Max temp: 100°C × 100
MAX_HUMIDITY = 10000             // Max humidity: 100% × 100
MAX_PRESSURE = 110000            // Max pressure: 1100 hPa × 100
MAX_WIND_SPEED = 200             // Max wind: 200 km/h
PRIVACY_MULTIPLIER = 1000        // Privacy-preserving division factor
```

---

## Integration Examples

### Complete Workflow Example

```javascript
// 1. Register stations (owner only)
await contract.registerStation("0x123...", "New York, USA");
await contract.registerStation("0x456...", "London, UK");
await contract.registerStation("0x789...", "Tokyo, Japan");

// 2. Check if submission is allowed
const canSubmit = await contract.canSubmitData();
if (!canSubmit) {
    console.log("Not in submission window");
    return;
}

// 3. Stations submit data
await contract.connect(station1).submitWeatherData(2550, 6500, 101325, 45);
await contract.connect(station2).submitWeatherData(1800, 7200, 101200, 30);
await contract.connect(station3).submitWeatherData(2100, 6800, 101300, 35);

// 4. Wait for generation window
await waitForGenerationWindow();

// 5. Generate forecast
await contract.generateRegionalForecast();

// 6. Wait for Gateway callback
await waitForCallback();

// 7. Retrieve forecast
const [temp, humidity, pressure, wind] = await contract.getRegionalForecast(1);
console.log(`Forecast: ${temp/100}°C, ${humidity/100}%, ${pressure/100}hPa, ${wind}km/h`);
```

---

**Version**: 3.0
**Last Updated**: 2025-11-23
**License**: MIT
