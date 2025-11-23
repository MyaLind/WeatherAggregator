# Architecture Documentation

## ConfidentialWeatherAggregatorV3 Architecture

### Overview

ConfidentialWeatherAggregatorV3 is an advanced Fully Homomorphic Encryption (FHE) based weather data aggregation system built on the Zama fhEVM framework. It implements privacy-preserving computation with robust security mechanisms.

---

## System Architecture

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Weather Stations                         │
│  (Multiple distributed data providers)                      │
└──────────────────┬──────────────────────────────────────────┘
                   │ Encrypted Weather Data
                   ▼
┌─────────────────────────────────────────────────────────────┐
│         ConfidentialWeatherAggregatorV3 Contract            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Data Collection Layer                               │   │
│  │  - Encrypted data submission                         │   │
│  │  - Input validation                                  │   │
│  │  - Timestamp verification                            │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Aggregation Layer (FHE Operations)                  │   │
│  │  - Homomorphic addition                              │   │
│  │  - Privacy-preserving multiplication                 │   │
│  │  - Encrypted computation                             │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Decryption Request Layer                            │   │
│  │  - Gateway request initiation                        │   │
│  │  - Request tracking                                  │   │
│  │  - Timeout monitoring                                │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────────┘
                   │ Decryption Request
                   ▼
┌─────────────────────────────────────────────────────────────┐
│              Zama Gateway (Decryption Oracle)               │
│  - Secure decryption infrastructure                         │
│  - Multi-party computation                                  │
│  - Threshold cryptography                                   │
└──────────────────┬──────────────────────────────────────────┘
                   │ Callback with Decrypted Results
                   ▼
┌─────────────────────────────────────────────────────────────┐
│         ConfidentialWeatherAggregatorV3 Contract            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Callback Processing Layer                           │   │
│  │  - Signature verification                            │   │
│  │  - Replay attack prevention                          │   │
│  │  - Privacy-preserving division                       │   │
│  │  - Price obfuscation                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Result Finalization Layer                           │   │
│  │  - Average calculation                               │   │
│  │  - Data obfuscation                                  │   │
│  │  - Result storage                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Gateway Callback Mode

### Request-Response Flow

1. **User Submits Encrypted Request**
   - Weather stations submit encrypted data
   - Contract validates and stores encrypted values
   - Homomorphic operations aggregate data

2. **Contract Records Request**
   - Generate unique request ID
   - Store request metadata
   - Set timeout timestamp
   - Update forecast status to `DecryptionRequested`

3. **Gateway Decrypts**
   - Off-chain decryption service processes request
   - Multiple validators participate in threshold decryption
   - Generate cryptographic proof of decryption

4. **Callback Completes Transaction**
   - Gateway calls `processForecastCallback` with decrypted values
   - Contract verifies signatures using `FHE.checkSignatures`
   - Process results and finalize forecast
   - Update status to `Completed`

### Security Measures in Callback

```solidity
function processForecastCallback(
    uint256 requestId,
    bytes memory cleartexts,
    bytes memory decryptionProof
) external nonReentrant {
    // 1. Verify decryption proof
    FHE.checkSignatures(requestId, cleartexts, decryptionProof);

    // 2. Prevent replay attacks
    require(!processedRequests[requestId], "Request already processed");
    processedRequests[requestId] = true;

    // 3. Validate request state
    require(forecast.status == ForecastStatus.DecryptionRequested);

    // 4. Check timeout
    if (block.timestamp > forecast.requestTimestamp + DECRYPTION_TIMEOUT) {
        // Handle timeout and issue refund
        return;
    }

    // 5. Process results with privacy preservation
}
```

---

## Refund Mechanism

### Handling Decryption Failures

The contract implements comprehensive refund mechanisms for various failure scenarios:

#### 1. **Automatic Timeout Refunds**

```solidity
// In processForecastCallback
if (block.timestamp > forecast.requestTimestamp + DECRYPTION_TIMEOUT) {
    forecast.status = ForecastStatus.TimedOut;
    emit ForecastTimedOut(forecastId);
    emit RefundIssued(forecastId, "Decryption timeout");
    return;
}
```

#### 2. **Manual Failure Handling**

```solidity
function handleDecryptionFailure(uint256 forecastId, string calldata reason)
    external onlyOwner {
    forecast.status = ForecastStatus.Failed;
    emit ForecastFailed(forecastId, reason);
    emit RefundIssued(forecastId, reason);
}
```

#### 3. **Proactive Timeout Checks**

```solidity
function checkTimeout(uint256 forecastId) external {
    if (block.timestamp > forecast.requestTimestamp + DECRYPTION_TIMEOUT) {
        forecast.status = ForecastStatus.TimedOut;
        emit ForecastTimedOut(forecastId);
        emit RefundIssued(forecastId, "Timeout protection triggered");
    }
}
```

### Forecast Status Lifecycle

```
Pending → Aggregating → DecryptionRequested → {Completed | Failed | TimedOut}
                                            ↓
                                      Refund Issued
```

---

## Timeout Protection

### Preventing Permanent Locks

**Configuration:**
- Default timeout: 24 hours (`DECRYPTION_TIMEOUT = 24 hours`)
- Configurable per deployment requirements

**Protection Mechanisms:**

1. **Request Timestamp Recording**
   ```solidity
   regionalForecasts[forecastCount] = RegionalForecast({
       requestTimestamp: block.timestamp,
       decryptionRequestId: requestId,
       status: ForecastStatus.DecryptionRequested,
       // ... other fields
   });
   ```

2. **Timeout Verification in Callback**
   - Automatic check in `processForecastCallback`
   - Manual check via `checkTimeout` function
   - Status transition to `TimedOut` state

3. **Recovery Actions**
   - Emit timeout events for monitoring
   - Issue refund notifications
   - Allow retry for next forecast period

---

## Privacy-Preserving Division

### Problem: Division Leaks Information

Traditional division operations can leak sensitive information about aggregated data totals.

### Solution: Random Multiplier Technique

```solidity
// PRIVACY_MULTIPLIER = 1000 (configurable)

// Before decryption: multiply encrypted totals
euint32 privacyMultiplier = FHE.asEuint32(PRIVACY_MULTIPLIER);
totalTemperature = FHE.mul(totalTemperature, privacyMultiplier);
totalHumidity = FHE.mul(totalHumidity, privacyMultiplier);
totalPressure = FHE.mul(totalPressure, privacyMultiplier);
totalWindSpeed = FHE.mul(totalWindSpeed, privacyMultiplier);

// After decryption: divide by (participatingStations * PRIVACY_MULTIPLIER)
uint256 divisor = participatingStations * PRIVACY_MULTIPLIER;
uint32 avgTemperature = uint32(totalTemp / divisor);
```

### Benefits:
1. **Hides Exact Totals**: Decryption oracle sees obfuscated values
2. **Preserves Accuracy**: Final averages remain mathematically correct
3. **Scalable Privacy**: Multiplier adjustable based on privacy requirements
4. **Gas Efficient**: Minimal additional computational overhead

---

## Price Obfuscation (Fuzzing)

### Preventing Value Leakage

Even after privacy-preserving division, exact averages could leak information. Obfuscation adds additional protection.

### Implementation

```solidity
function _applyObfuscation(uint32 value, uint256 nonce, uint256 index)
    private pure returns (uint32) {
    // Generate pseudo-random offset (±5% variation)
    uint256 seed = uint256(keccak256(abi.encodePacked(nonce, index)));
    uint256 offset = (seed % 11); // 0-10, representing -5% to +5%

    // Apply fuzzing
    if (offset < 5) {
        return uint32((value * (100 - offset)) / 100); // Decrease 0-5%
    } else {
        return uint32((value * (100 + (offset - 5))) / 100); // Increase 0-5%
    }
}
```

### Obfuscation Nonce Generation

```solidity
obfuscationNonce: uint256(keccak256(abi.encodePacked(
    block.timestamp,
    block.prevrandao
)))
```

### Properties:
- **Deterministic per Forecast**: Same nonce for all fields in one forecast
- **Unpredictable**: Uses block randomness
- **Bounded Variation**: ±5% ensures data utility while protecting privacy
- **Field-Specific**: Different randomness per weather metric

---

## Security Features

### 1. Input Validation

**Range Checks:**
```solidity
require(temperature <= MAX_TEMPERATURE, "Temperature out of range");   // 0-100°C
require(humidity <= MAX_HUMIDITY, "Humidity out of range");           // 0-100%
require(pressure <= MAX_PRESSURE, "Pressure out of range");           // 0-1100 hPa
require(windSpeed <= MAX_WIND_SPEED, "Wind speed out of range");      // 0-200 km/h
```

**Address Validation:**
```solidity
require(stationAddress != address(0), "Zero address not allowed");
require(bytes(location).length > 0, "Location cannot be empty");
```

### 2. Access Control

**Role-Based Access:**
```solidity
modifier onlyOwner() {
    require(msg.sender == owner, "UNAUTHORIZED");
    _;
}

modifier onlyActiveStation() {
    require(stationId > 0, "UNREGISTERED");
    require(weatherStations[stationId].isActive, "INACTIVE");
    _;
}
```

**Callback Security:**
```solidity
// Only Gateway can call callback (verified by FHE.checkSignatures)
FHE.checkSignatures(requestId, cleartexts, decryptionProof);
```

### 3. Overflow Protection

**SafeMath Operations:**
- Solidity 0.8.24+ has built-in overflow checks
- All arithmetic operations revert on overflow/underflow
- Explicit validation for division by zero

**Checked Arithmetic:**
```solidity
require(divisor > 0, "MATH_ERROR: Invalid divisor");
uint32 avgTemperature = uint32(totalTemp / divisor);
```

### 4. Reentrancy Protection

```solidity
modifier nonReentrant() {
    require(!_locked, "REENTRANCY: Reentrant call detected");
    _locked = true;
    _;
    _locked = false;
}
```

Applied to all state-changing functions:
- `submitWeatherData`
- `generateRegionalForecast`
- `processForecastCallback`

### 5. Replay Attack Prevention

```solidity
mapping(uint256 => bool) public processedRequests;

function processForecastCallback(...) external {
    require(!processedRequests[requestId], "REPLAY_ATTACK");
    processedRequests[requestId] = true;
    // ... process callback
}
```

### 6. Audit Events

**Comprehensive Event Logging:**
```solidity
event SecurityAlert(string alertType, uint256 indexed relatedId, string details);
event ForecastFailed(uint256 indexed forecastId, string reason);
event RefundIssued(uint256 indexed forecastId, string reason);
event StationDeactivated(uint256 indexed stationId, string reason);
```

**Monitoring Points:**
- Station deactivation
- Decryption failures
- Timeout events
- Refund issuance

---

## Gas Optimization (HCU Management)

### Homomorphic Computation Units (HCU)

FHE operations consume HCU instead of traditional gas. Efficient HCU usage is critical.

### Optimization Strategies

#### 1. Batch Operations
```solidity
// Efficient: Single loop for all aggregations
for (uint256 i = 1; i <= stationCount; i++) {
    totalTemperature = FHE.add(totalTemperature, data.encryptedTemperature);
    totalHumidity = FHE.add(totalHumidity, data.encryptedHumidity);
    totalPressure = FHE.add(totalPressure, data.encryptedPressure);
    totalWindSpeed = FHE.add(totalWindSpeed, FHE.asEuint32(data.encryptedWindSpeed));
}
```

#### 2. Minimize Type Conversions
```solidity
// Efficient: Convert once and reuse
euint32 privacyMultiplier = FHE.asEuint32(PRIVACY_MULTIPLIER);
totalTemperature = FHE.mul(totalTemperature, privacyMultiplier);
```

#### 3. Selective Decryption
```solidity
// Only decrypt aggregated totals, not individual station data
bytes32[] memory cts = new bytes32[](4); // 4 values instead of N stations * 4
```

#### 4. Off-Chain Computation
- Average calculation performed on decrypted values (no HCU cost)
- Obfuscation applied to plain values (no HCU cost)

### HCU Cost Breakdown

| Operation | Approximate HCU Cost |
|-----------|---------------------|
| `FHE.asEuint32` | Low (encryption) |
| `FHE.add` | Medium (homomorphic addition) |
| `FHE.mul` | High (homomorphic multiplication) |
| `FHE.requestDecryption` | Medium (decryption request) |

**Total HCU per Forecast:**
- Data submission: `4 * N stations` (encryption)
- Aggregation: `4 * N stations` (additions) + `4` (multiplications)
- Decryption: `4` (decryption requests)

---

## Data Flow Diagram

```
┌─────────────┐
│   Station   │
│   Submit    │
└──────┬──────┘
       │ Temperature, Humidity, Pressure, Wind Speed (plain)
       ▼
┌─────────────────────────────────────┐
│  submitWeatherData()                │
│  - Validate inputs                  │
│  - Encrypt: FHE.asEuint32/asEuint8  │
│  - Store encrypted data             │
│  - Grant permissions                │
└──────┬──────────────────────────────┘
       │ euint32, euint8 (encrypted)
       ▼
┌─────────────────────────────────────┐
│  generateRegionalForecast()         │
│  - Aggregate with FHE.add           │
│  - Multiply by privacy multiplier   │
│  - Request decryption               │
└──────┬──────────────────────────────┘
       │ bytes32[] (encrypted totals)
       ▼
┌─────────────────────────────────────┐
│  Zama Gateway (Off-chain)           │
│  - Threshold decryption             │
│  - Generate proof                   │
└──────┬──────────────────────────────┘
       │ cleartexts + proof
       ▼
┌─────────────────────────────────────┐
│  processForecastCallback()          │
│  - Verify signatures                │
│  - Check timeout                    │
│  - Divide by (stations * multiplier)│
│  - Apply obfuscation                │
│  - Store results                    │
└─────────────────────────────────────┘
```

---

## Error Handling Strategy

### 1. Descriptive Error Messages

All errors prefixed with category for easy debugging:
- `UNAUTHORIZED`: Access control failures
- `INVALID_*`: Input validation failures
- `MATH_ERROR`: Arithmetic failures
- `REENTRANCY`: Reentrancy attack attempts
- `REPLAY_ATTACK`: Replay attack attempts
- `DUPLICATE_*`: Duplicate submission attempts

### 2. Graceful Degradation

- Failed forecasts don't block future periods
- Timeout protection allows recovery
- Station deactivation doesn't affect other stations

### 3. Event-Based Monitoring

All critical errors emit events for off-chain monitoring:
```solidity
emit SecurityAlert("DECRYPTION_FAILURE", forecastId, reason);
emit ForecastFailed(forecastId, reason);
emit RefundIssued(forecastId, reason);
```

---

## Deployment Considerations

### Network Requirements
- **Blockchain**: Zama fhEVM compatible network (Sepolia testnet)
- **Gateway**: Access to Zama Gateway decryption oracle
- **Gas**: Sufficient ETH for deployment and operations

### Configuration Parameters

```solidity
MIN_STATIONS_REQUIRED = 3       // Minimum data points for aggregation
DECRYPTION_TIMEOUT = 24 hours   // Timeout for Gateway callbacks
PRIVACY_MULTIPLIER = 1000       // Privacy-preserving division factor
MAX_TEMPERATURE = 10000         // 100°C * 100
MAX_HUMIDITY = 10000            // 100% * 100
MAX_PRESSURE = 110000           // 1100 hPa * 100
MAX_WIND_SPEED = 200            // 200 km/h
```

### Initialization Steps

1. Deploy contract
2. Register weather stations via `registerStation()`
3. Enable time windows with `setTimeWindowEnabled(true)`
4. Stations submit data during submission windows
5. Generate forecasts during generation windows

---

## Future Enhancements

1. **Multi-Region Support**: Separate aggregations per geographic region
2. **Reputation System**: Weight data by station reliability
3. **Dynamic Thresholds**: Adjust MIN_STATIONS based on network conditions
4. **Historical Analytics**: Store and query historical forecast data
5. **Stake-Based Participation**: Require stations to stake tokens for data submission
6. **Automated Refunds**: Programmatic refund distribution for failures

---

## References

- [Zama fhEVM Documentation](https://docs.zama.ai/fhevm)
- [FHE Solidity Library](https://github.com/zama-ai/fhevm)
- [Gateway Callback Pattern](https://docs.zama.ai/fhevm/guides/decrypt)
- [Homomorphic Encryption Principles](https://en.wikipedia.org/wiki/Homomorphic_encryption)

---

**Version**: 3.0
**Last Updated**: 2025-11-23
**License**: MIT
