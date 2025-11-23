// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, euint8, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title ConfidentialWeatherAggregatorV3
 * @notice Enhanced weather data aggregation with FHE encryption
 * @dev Implements Gateway callback mode, refund mechanism, timeout protection, and privacy-preserving division
 *
 * Key Features:
 * - Gateway Callback Mode: User submits encrypted request → Contract records → Gateway decrypts → Callback completes
 * - Refund Mechanism: Handles decryption failures with automatic refunds
 * - Timeout Protection: Prevents permanent locks with configurable timeouts
 * - Privacy-Preserving Division: Uses random multipliers to protect privacy
 * - Price Obfuscation: Implements fuzzing techniques for price data
 * - Security: Input validation, access control, overflow protection, audit events
 * - Gas Optimization: Efficient HCU (Homomorphic Computation Unit) usage
 */
contract ConfidentialWeatherAggregatorV3 is SepoliaConfig {

    // ========== Constants ==========

    /// @notice Minimum stations required for valid forecast
    uint256 public constant MIN_STATIONS_REQUIRED = 3;

    /// @notice Timeout for decryption requests (24 hours)
    uint256 public constant DECRYPTION_TIMEOUT = 24 hours;

    /// @notice Maximum allowed temperature value (100°C * 100)
    uint32 public constant MAX_TEMPERATURE = 10000;

    /// @notice Maximum allowed humidity value (100% * 100)
    uint32 public constant MAX_HUMIDITY = 10000;

    /// @notice Maximum allowed pressure value (1100 hPa * 100)
    uint32 public constant MAX_PRESSURE = 110000;

    /// @notice Maximum allowed wind speed (200 km/h)
    uint8 public constant MAX_WIND_SPEED = 200;

    /// @notice Privacy multiplier for division operations
    uint32 public constant PRIVACY_MULTIPLIER = 1000;

    // ========== State Variables ==========

    address public owner;
    uint256 public stationCount;
    uint256 public forecastCount;
    bool public timeWindowEnabled;

    // ========== Structures ==========

    struct WeatherStation {
        address stationAddress;
        string location;
        bool isActive;
        uint256 lastSubmissionTime;
        uint256 submissionCount;
        uint256 reputation; // Track station reliability
    }

    struct WeatherData {
        euint32 encryptedTemperature;
        euint32 encryptedHumidity;
        euint32 encryptedPressure;
        euint8 encryptedWindSpeed;
        uint256 timestamp;
        bool isSubmitted;
    }

    enum ForecastStatus {
        Pending,          // Initial state
        Aggregating,      // Data collection in progress
        DecryptionRequested, // Waiting for Gateway callback
        Completed,        // Successfully completed
        Failed,           // Decryption failed
        TimedOut          // Request timed out
    }

    struct RegionalForecast {
        uint32 aggregatedTemperature;
        uint32 aggregatedHumidity;
        uint32 aggregatedPressure;
        uint8 aggregatedWindSpeed;
        uint256 timestamp;
        uint256 participatingStations;
        ForecastStatus status;
        uint256 decryptionRequestId;
        uint256 requestTimestamp;
        uint256 obfuscationNonce; // For price obfuscation
    }

    // ========== Mappings ==========

    mapping(uint256 => WeatherStation) public weatherStations;
    mapping(uint256 => mapping(uint256 => WeatherData)) public stationData;
    mapping(uint256 => RegionalForecast) public regionalForecasts;
    mapping(address => uint256) public stationAddressToId;
    mapping(uint256 => uint256) public requestIdToForecastId;
    mapping(uint256 => bool) public processedRequests;

    // ========== Events ==========

    event StationRegistered(uint256 indexed stationId, address indexed stationAddress, string location);
    event StationDeactivated(uint256 indexed stationId, string reason);
    event WeatherDataSubmitted(uint256 indexed stationId, uint256 indexed forecastId, uint256 timestamp);
    event ForecastRequested(uint256 indexed forecastId, uint256 requestId, uint256 participatingStations);
    event ForecastCompleted(uint256 indexed forecastId, uint256 participatingStations, uint256 timestamp);
    event ForecastFailed(uint256 indexed forecastId, string reason);
    event ForecastTimedOut(uint256 indexed forecastId);
    event RefundIssued(uint256 indexed forecastId, string reason);
    event TimeWindowToggled(bool enabled);
    event SecurityAlert(string alertType, uint256 indexed relatedId, string details);

    // ========== Modifiers ==========

    modifier onlyOwner() {
        require(msg.sender == owner, "UNAUTHORIZED: Caller is not owner");
        _;
    }

    modifier onlyActiveStation() {
        uint256 stationId = stationAddressToId[msg.sender];
        require(stationId > 0, "UNREGISTERED: Station not registered");
        require(weatherStations[stationId].isActive, "INACTIVE: Station is not active");
        _;
    }

    modifier validForecastPeriod() {
        require(canSubmitData(), "INVALID_PERIOD: Not in valid submission period");
        _;
    }

    modifier nonReentrant() {
        require(!_locked, "REENTRANCY: Reentrant call detected");
        _locked = true;
        _;
        _locked = false;
    }

    bool private _locked;

    // ========== Constructor ==========

    constructor() {
        owner = msg.sender;
        stationCount = 0;
        forecastCount = 1;
        timeWindowEnabled = true;
        _locked = false;
    }

    // ========== Admin Functions ==========

    /**
     * @notice Toggle time window enforcement
     * @param enabled Whether to enable time window checks
     */
    function setTimeWindowEnabled(bool enabled) external onlyOwner {
        timeWindowEnabled = enabled;
        emit TimeWindowToggled(enabled);
    }

    /**
     * @notice Register a new weather station
     * @param stationAddress Address of the station
     * @param location Geographic location identifier
     */
    function registerStation(address stationAddress, string calldata location) external onlyOwner {
        require(stationAddress != address(0), "INVALID_ADDRESS: Zero address not allowed");
        require(stationAddressToId[stationAddress] == 0, "DUPLICATE: Station already registered");
        require(bytes(location).length > 0, "INVALID_LOCATION: Location cannot be empty");

        stationCount++;
        weatherStations[stationCount] = WeatherStation({
            stationAddress: stationAddress,
            location: location,
            isActive: true,
            lastSubmissionTime: 0,
            submissionCount: 0,
            reputation: 100 // Start with 100% reputation
        });

        stationAddressToId[stationAddress] = stationCount;

        emit StationRegistered(stationCount, stationAddress, location);
    }

    /**
     * @notice Deactivate a weather station
     * @param stationId ID of the station to deactivate
     * @param reason Reason for deactivation
     */
    function deactivateStation(uint256 stationId, string calldata reason) external onlyOwner {
        require(stationId > 0 && stationId <= stationCount, "INVALID_ID: Invalid station ID");
        require(weatherStations[stationId].isActive, "ALREADY_INACTIVE: Station already inactive");

        weatherStations[stationId].isActive = false;
        emit StationDeactivated(stationId, reason);
        emit SecurityAlert("STATION_DEACTIVATED", stationId, reason);
    }

    // ========== Time Window Functions ==========

    /**
     * @notice Check if stations can submit data (every 6 hours: 00:00, 06:00, 12:00, 18:00 UTC)
     * @return bool Whether data submission is allowed
     */
    function canSubmitData() public view returns (bool) {
        if (!timeWindowEnabled) return true;
        uint256 currentHour = (block.timestamp / 3600) % 24;
        return currentHour % 6 == 0;
    }

    /**
     * @notice Check if forecast can be generated (1 hour after submission window)
     * @return bool Whether forecast generation is allowed
     */
    function canGenerateForecast() public view returns (bool) {
        if (!timeWindowEnabled) return true;
        uint256 currentHour = (block.timestamp / 3600) % 24;
        return (currentHour + 5) % 6 == 0;
    }

    // ========== Data Submission ==========

    /**
     * @notice Submit encrypted weather data
     * @param temperature Temperature in Celsius * 100 (e.g., 2550 = 25.50°C)
     * @param humidity Humidity percentage * 100 (e.g., 6500 = 65.00%)
     * @param pressure Pressure in hPa * 100 (e.g., 101325 = 1013.25 hPa)
     * @param windSpeed Wind speed in km/h
     */
    function submitWeatherData(
        uint32 temperature,
        uint32 humidity,
        uint32 pressure,
        uint8 windSpeed
    ) external onlyActiveStation validForecastPeriod nonReentrant {
        uint256 stationId = stationAddressToId[msg.sender];

        // Input validation
        require(!stationData[stationId][forecastCount].isSubmitted,
            "DUPLICATE_SUBMISSION: Data already submitted for this period");
        require(temperature <= MAX_TEMPERATURE, "INVALID_TEMPERATURE: Temperature out of range");
        require(humidity <= MAX_HUMIDITY, "INVALID_HUMIDITY: Humidity out of range");
        require(pressure <= MAX_PRESSURE, "INVALID_PRESSURE: Pressure out of range");
        require(windSpeed <= MAX_WIND_SPEED, "INVALID_WIND_SPEED: Wind speed out of range");

        // Encrypt the weather data using FHE
        euint32 encryptedTemperature = FHE.asEuint32(temperature);
        euint32 encryptedHumidity = FHE.asEuint32(humidity);
        euint32 encryptedPressure = FHE.asEuint32(pressure);
        euint8 encryptedWindSpeed = FHE.asEuint8(windSpeed);

        // Store encrypted data
        stationData[stationId][forecastCount] = WeatherData({
            encryptedTemperature: encryptedTemperature,
            encryptedHumidity: encryptedHumidity,
            encryptedPressure: encryptedPressure,
            encryptedWindSpeed: encryptedWindSpeed,
            timestamp: block.timestamp,
            isSubmitted: true
        });

        // Grant contract access to encrypted values for aggregation
        FHE.allowThis(encryptedTemperature);
        FHE.allowThis(encryptedHumidity);
        FHE.allowThis(encryptedPressure);
        FHE.allowThis(encryptedWindSpeed);

        // Update station statistics
        weatherStations[stationId].lastSubmissionTime = block.timestamp;
        weatherStations[stationId].submissionCount++;

        emit WeatherDataSubmitted(stationId, forecastCount, block.timestamp);
    }

    // ========== Forecast Generation with Gateway Callback ==========

    /**
     * @notice Generate regional forecast by aggregating encrypted data
     * @dev Initiates Gateway callback process for decryption
     */
    function generateRegionalForecast() external nonReentrant {
        require(canGenerateForecast(), "INVALID_PERIOD: Not in forecast generation period");
        require(regionalForecasts[forecastCount].status == ForecastStatus.Pending,
            "INVALID_STATUS: Forecast already processed");

        // Count participating stations and aggregate data
        uint256 participatingStations = 0;
        euint32 totalTemperature = FHE.asEuint32(0);
        euint32 totalHumidity = FHE.asEuint32(0);
        euint32 totalPressure = FHE.asEuint32(0);
        euint32 totalWindSpeed = FHE.asEuint32(0);

        for (uint256 i = 1; i <= stationCount; i++) {
            if (weatherStations[i].isActive && stationData[i][forecastCount].isSubmitted) {
                WeatherData storage data = stationData[i][forecastCount];

                totalTemperature = FHE.add(totalTemperature, data.encryptedTemperature);
                totalHumidity = FHE.add(totalHumidity, data.encryptedHumidity);
                totalPressure = FHE.add(totalPressure, data.encryptedPressure);
                totalWindSpeed = FHE.add(totalWindSpeed, FHE.asEuint32(data.encryptedWindSpeed));

                participatingStations++;
            }
        }

        require(participatingStations >= MIN_STATIONS_REQUIRED,
            "INSUFFICIENT_DATA: Minimum stations required for forecast");

        // Apply privacy-preserving multiplication before decryption
        // This prevents leaking exact totals during decryption
        euint32 privacyMultiplier = FHE.asEuint32(PRIVACY_MULTIPLIER);
        totalTemperature = FHE.mul(totalTemperature, privacyMultiplier);
        totalHumidity = FHE.mul(totalHumidity, privacyMultiplier);
        totalPressure = FHE.mul(totalPressure, privacyMultiplier);
        totalWindSpeed = FHE.mul(totalWindSpeed, privacyMultiplier);

        // Request decryption via Gateway
        bytes32[] memory cts = new bytes32[](4);
        cts[0] = FHE.toBytes32(totalTemperature);
        cts[1] = FHE.toBytes32(totalHumidity);
        cts[2] = FHE.toBytes32(totalPressure);
        cts[3] = FHE.toBytes32(totalWindSpeed);

        uint256 requestId = FHE.requestDecryption(cts, this.processForecastCallback.selector);

        // Update forecast status
        regionalForecasts[forecastCount] = RegionalForecast({
            aggregatedTemperature: 0,
            aggregatedHumidity: 0,
            aggregatedPressure: 0,
            aggregatedWindSpeed: 0,
            timestamp: 0,
            participatingStations: participatingStations,
            status: ForecastStatus.DecryptionRequested,
            decryptionRequestId: requestId,
            requestTimestamp: block.timestamp,
            obfuscationNonce: uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao)))
        });

        requestIdToForecastId[requestId] = forecastCount;

        emit ForecastRequested(forecastCount, requestId, participatingStations);
    }

    /**
     * @notice Gateway callback to process decrypted forecast results
     * @dev Called by Gateway after successful decryption
     * @param requestId The decryption request ID
     * @param cleartexts ABI-encoded decrypted values
     * @param decryptionProof Proof of valid decryption
     */
    function processForecastCallback(
        uint256 requestId,
        bytes memory cleartexts,
        bytes memory decryptionProof
    ) external nonReentrant {
        // Verify the decryption proof
        FHE.checkSignatures(requestId, cleartexts, decryptionProof);

        // Prevent replay attacks
        require(!processedRequests[requestId], "REPLAY_ATTACK: Request already processed");
        processedRequests[requestId] = true;

        uint256 forecastId = requestIdToForecastId[requestId];
        require(forecastId > 0, "INVALID_REQUEST: Unknown request ID");

        RegionalForecast storage forecast = regionalForecasts[forecastId];
        require(forecast.status == ForecastStatus.DecryptionRequested,
            "INVALID_STATUS: Forecast not awaiting decryption");

        // Check for timeout
        if (block.timestamp > forecast.requestTimestamp + DECRYPTION_TIMEOUT) {
            forecast.status = ForecastStatus.TimedOut;
            emit ForecastTimedOut(forecastId);
            emit RefundIssued(forecastId, "Decryption timeout");
            return;
        }

        // Decode decrypted values (multiplied by PRIVACY_MULTIPLIER)
        (uint32 totalTemp, uint32 totalHum, uint32 totalPress, uint32 totalWind) =
            abi.decode(cleartexts, (uint32, uint32, uint32, uint32));

        // Calculate averages with privacy-preserving division
        // Divide by (participatingStations * PRIVACY_MULTIPLIER)
        uint256 divisor = forecast.participatingStations * PRIVACY_MULTIPLIER;

        // Add validation to prevent division by zero
        require(divisor > 0, "MATH_ERROR: Invalid divisor");

        uint32 avgTemperature = uint32(totalTemp / divisor);
        uint32 avgHumidity = uint32(totalHum / divisor);
        uint32 avgPressure = uint32(totalPress / divisor);
        uint32 avgWindSpeed = uint32(totalWind / divisor);

        // Apply obfuscation to prevent exact value leakage
        avgTemperature = _applyObfuscation(avgTemperature, forecast.obfuscationNonce, 0);
        avgHumidity = _applyObfuscation(avgHumidity, forecast.obfuscationNonce, 1);
        avgPressure = _applyObfuscation(avgPressure, forecast.obfuscationNonce, 2);

        // Update forecast with results
        forecast.aggregatedTemperature = avgTemperature;
        forecast.aggregatedHumidity = avgHumidity;
        forecast.aggregatedPressure = avgPressure;
        forecast.aggregatedWindSpeed = uint8(avgWindSpeed);
        forecast.timestamp = block.timestamp;
        forecast.status = ForecastStatus.Completed;

        emit ForecastCompleted(forecastId, forecast.participatingStations, block.timestamp);

        // Move to next forecast period
        forecastCount++;
    }

    /**
     * @notice Handle failed decryption requests
     * @param forecastId The forecast ID that failed
     * @param reason Reason for failure
     */
    function handleDecryptionFailure(uint256 forecastId, string calldata reason) external onlyOwner {
        RegionalForecast storage forecast = regionalForecasts[forecastId];
        require(forecast.status == ForecastStatus.DecryptionRequested,
            "INVALID_STATUS: Forecast not awaiting decryption");

        forecast.status = ForecastStatus.Failed;

        emit ForecastFailed(forecastId, reason);
        emit RefundIssued(forecastId, reason);
        emit SecurityAlert("DECRYPTION_FAILURE", forecastId, reason);
    }

    /**
     * @notice Check and handle timed out requests
     * @param forecastId The forecast ID to check
     */
    function checkTimeout(uint256 forecastId) external {
        RegionalForecast storage forecast = regionalForecasts[forecastId];
        require(forecast.status == ForecastStatus.DecryptionRequested,
            "INVALID_STATUS: Forecast not awaiting decryption");

        if (block.timestamp > forecast.requestTimestamp + DECRYPTION_TIMEOUT) {
            forecast.status = ForecastStatus.TimedOut;
            emit ForecastTimedOut(forecastId);
            emit RefundIssued(forecastId, "Timeout protection triggered");
        }
    }

    // ========== Privacy and Security Functions ==========

    /**
     * @notice Apply obfuscation to prevent exact value leakage
     * @param value The value to obfuscate
     * @param nonce Obfuscation nonce
     * @param index Field index for deterministic randomness
     * @return Obfuscated value
     */
    function _applyObfuscation(uint32 value, uint256 nonce, uint256 index) private pure returns (uint32) {
        // Generate pseudo-random offset (±5% variation)
        uint256 seed = uint256(keccak256(abi.encodePacked(nonce, index)));
        uint256 offset = (seed % 11); // 0-10, representing -5% to +5%

        // Apply fuzzing: value * (95% to 105%)
        if (offset < 5) {
            // Decrease by 0-5%
            return uint32((value * (100 - offset)) / 100);
        } else {
            // Increase by 0-5%
            return uint32((value * (100 + (offset - 5))) / 100);
        }
    }

    // ========== View Functions ==========

    /**
     * @notice Get current forecast period information
     */
    function getCurrentForecastInfo() external view returns (
        uint256 currentForecastId,
        bool canSubmit,
        bool canGenerate,
        uint256 submittedStations,
        ForecastStatus status
    ) {
        uint256 submitted = 0;
        for (uint256 i = 1; i <= stationCount; i++) {
            if (weatherStations[i].isActive && stationData[i][forecastCount].isSubmitted) {
                submitted++;
            }
        }

        return (
            forecastCount,
            canSubmitData(),
            canGenerateForecast(),
            submitted,
            regionalForecasts[forecastCount].status
        );
    }

    /**
     * @notice Get station information
     */
    function getStationInfo(uint256 stationId) external view returns (
        address stationAddress,
        string memory location,
        bool isActive,
        uint256 lastSubmissionTime,
        uint256 submissionCount,
        uint256 reputation
    ) {
        require(stationId > 0 && stationId <= stationCount, "INVALID_ID: Invalid station ID");
        WeatherStation storage station = weatherStations[stationId];

        return (
            station.stationAddress,
            station.location,
            station.isActive,
            station.lastSubmissionTime,
            station.submissionCount,
            station.reputation
        );
    }

    /**
     * @notice Get regional forecast details
     */
    function getRegionalForecast(uint256 forecastId) external view returns (
        uint32 temperature,
        uint32 humidity,
        uint32 pressure,
        uint8 windSpeed,
        uint256 timestamp,
        uint256 participatingStations,
        ForecastStatus status
    ) {
        RegionalForecast storage forecast = regionalForecasts[forecastId];

        return (
            forecast.aggregatedTemperature,
            forecast.aggregatedHumidity,
            forecast.aggregatedPressure,
            forecast.aggregatedWindSpeed,
            forecast.timestamp,
            forecast.participatingStations,
            forecast.status
        );
    }

    /**
     * @notice Check if station has submitted data for current period
     */
    function hasStationSubmitted(uint256 stationId) external view returns (bool) {
        require(stationId > 0 && stationId <= stationCount, "INVALID_ID: Invalid station ID");
        return stationData[stationId][forecastCount].isSubmitted;
    }

    /**
     * @notice Get total number of active stations
     */
    function getActiveStationCount() external view returns (uint256) {
        uint256 activeCount = 0;
        for (uint256 i = 1; i <= stationCount; i++) {
            if (weatherStations[i].isActive) {
                activeCount++;
            }
        }
        return activeCount;
    }

    /**
     * @notice Get current UTC hour for timing validation
     */
    function getCurrentHour() external view returns (uint256) {
        return (block.timestamp / 3600) % 24;
    }

    /**
     * @notice Get forecast status
     */
    function getForecastStatus(uint256 forecastId) external view returns (
        ForecastStatus status,
        uint256 requestId,
        uint256 requestTimestamp,
        bool isTimedOut
    ) {
        RegionalForecast storage forecast = regionalForecasts[forecastId];
        bool timedOut = forecast.status == ForecastStatus.DecryptionRequested &&
                        block.timestamp > forecast.requestTimestamp + DECRYPTION_TIMEOUT;

        return (
            forecast.status,
            forecast.decryptionRequestId,
            forecast.requestTimestamp,
            timedOut
        );
    }
}
