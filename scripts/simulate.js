const hre = require("hardhat");
require("dotenv").config();

/**
 * Simulate Complete Weather Aggregation Workflow
 *
 * This script demonstrates a full end-to-end simulation of the weather aggregation system:
 * 1. Deploy the contract
 * 2. Register multiple weather stations
 * 3. Simulate weather data submissions from various stations
 * 4. Generate regional forecasts
 * 5. Display aggregated results
 *
 * Usage:
 * npx hardhat run scripts/simulate.js --network sepolia
 */

// Simulation configuration
const SIMULATION_CONFIG = {
  numStations: 5,
  stationLocations: [
    "Tokyo Weather Station",
    "Seoul Meteorological Center",
    "Beijing Climate Observatory",
    "Shanghai Weather Bureau",
    "Hong Kong Observatory"
  ],
  // Simulated weather data ranges
  weatherRanges: {
    temperature: { min: 1500, max: 3000 }, // 15°C to 30°C (x100)
    humidity: { min: 4000, max: 8000 },    // 40% to 80% (x100)
    pressure: { min: 99000, max: 103000 }, // 990 to 1030 hPa (x100)
    windSpeed: { min: 5, max: 25 }         // 5 to 25 km/h
  }
};

/**
 * Generate random weather data within realistic ranges
 */
function generateRandomWeatherData() {
  const ranges = SIMULATION_CONFIG.weatherRanges;

  return {
    temperature: Math.floor(
      Math.random() * (ranges.temperature.max - ranges.temperature.min) + ranges.temperature.min
    ),
    humidity: Math.floor(
      Math.random() * (ranges.humidity.max - ranges.humidity.min) + ranges.humidity.min
    ),
    pressure: Math.floor(
      Math.random() * (ranges.pressure.max - ranges.pressure.min) + ranges.pressure.min
    ),
    windSpeed: Math.floor(
      Math.random() * (ranges.windSpeed.max - ranges.windSpeed.min) + ranges.windSpeed.min
    )
  };
}

/**
 * Format weather data for display
 */
function formatWeatherData(data) {
  return {
    temperature: `${(data.temperature / 100).toFixed(2)}°C`,
    humidity: `${(data.humidity / 100).toFixed(2)}%`,
    pressure: `${(data.pressure / 100).toFixed(2)} hPa`,
    windSpeed: `${data.windSpeed} km/h`
  };
}

/**
 * Sleep utility for delays
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log("=".repeat(70));
  console.log("🌤️  CONFIDENTIAL WEATHER AGGREGATOR - FULL SIMULATION");
  console.log("=".repeat(70));
  console.log();

  // Get deployer and additional accounts for stations
  const [deployer, ...stationAccounts] = await hre.ethers.getSigners();
  console.log("👤 Deployer Address:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Deployer Balance:", hre.ethers.formatEther(balance), "ETH");
  console.log();

  // ========================================
  // STEP 1: Deploy Contract
  // ========================================
  console.log("=".repeat(70));
  console.log("📦 STEP 1: DEPLOYING CONTRACT");
  console.log("=".repeat(70));
  console.log();

  const ConfidentialWeatherAggregator = await hre.ethers.getContractFactory("ConfidentialWeatherAggregator");
  console.log("⏳ Deploying ConfidentialWeatherAggregator...");

  const weatherAggregator = await ConfidentialWeatherAggregator.deploy();
  await weatherAggregator.waitForDeployment();

  const contractAddress = await weatherAggregator.getAddress();
  console.log("✅ Contract deployed at:", contractAddress);
  console.log("👑 Contract owner:", await weatherAggregator.owner());
  console.log();

  // ========================================
  // STEP 2: Register Weather Stations
  // ========================================
  console.log("=".repeat(70));
  console.log("🏢 STEP 2: REGISTERING WEATHER STATIONS");
  console.log("=".repeat(70));
  console.log();

  const numStations = Math.min(SIMULATION_CONFIG.numStations, stationAccounts.length);
  const registeredStations = [];

  for (let i = 0; i < numStations; i++) {
    const stationAddress = stationAccounts[i].address;
    const location = SIMULATION_CONFIG.stationLocations[i] || `Weather Station ${i + 1}`;

    console.log(`📍 Registering Station ${i}:`, location);
    console.log(`   Address: ${stationAddress}`);

    const tx = await weatherAggregator.registerStation(stationAddress, location);
    await tx.wait();

    registeredStations.push({
      id: i,
      address: stationAddress,
      location: location,
      signer: stationAccounts[i]
    });

    console.log(`   ✅ Registered successfully`);
  }
  console.log();
  console.log(`✅ Total Stations Registered: ${numStations}`);
  console.log();

  // ========================================
  // STEP 3: Disable Time Window for Testing
  // ========================================
  console.log("=".repeat(70));
  console.log("⏰ STEP 3: CONFIGURING TIME WINDOW");
  console.log("=".repeat(70));
  console.log();

  console.log("⏳ Disabling time window restrictions for simulation...");
  const disableTx = await weatherAggregator.setTimeWindowEnabled(false);
  await disableTx.wait();
  console.log("✅ Time window disabled - stations can submit anytime");
  console.log();

  // ========================================
  // STEP 4: Submit Weather Data
  // ========================================
  console.log("=".repeat(70));
  console.log("📤 STEP 4: SUBMITTING WEATHER DATA");
  console.log("=".repeat(70));
  console.log();

  const submittedData = [];

  for (const station of registeredStations) {
    const weatherData = generateRandomWeatherData();
    const formattedData = formatWeatherData(weatherData);

    console.log(`📊 Station ${station.id} (${station.location}):`);
    console.log(`   Temperature: ${formattedData.temperature}`);
    console.log(`   Humidity: ${formattedData.humidity}`);
    console.log(`   Pressure: ${formattedData.pressure}`);
    console.log(`   Wind Speed: ${formattedData.windSpeed}`);

    console.log(`   ⏳ Submitting encrypted data...`);

    // Connect with station's signer
    const stationContract = weatherAggregator.connect(station.signer);

    const tx = await stationContract.submitWeatherData(
      weatherData.temperature,
      weatherData.humidity,
      weatherData.pressure,
      weatherData.windSpeed
    );

    await tx.wait();
    console.log(`   ✅ Data submitted successfully`);
    console.log();

    submittedData.push({
      station: station,
      data: weatherData,
      formatted: formattedData
    });

    // Small delay between submissions
    await sleep(1000);
  }

  console.log(`✅ All ${numStations} stations have submitted data`);
  console.log();

  // ========================================
  // STEP 5: Check Submission Status
  // ========================================
  console.log("=".repeat(70));
  console.log("📊 STEP 5: CHECKING SUBMISSION STATUS");
  console.log("=".repeat(70));
  console.log();

  const currentInfo = await weatherAggregator.getCurrentForecastInfo();
  console.log("📈 Current Forecast Period:");
  console.log(`   Forecast ID: ${currentInfo.currentForecastId}`);
  console.log(`   Stations Submitted: ${currentInfo.submittedStations}`);
  console.log(`   Can Submit: ${currentInfo.canSubmit}`);
  console.log(`   Can Generate: ${currentInfo.canGenerate}`);
  console.log();

  // ========================================
  // STEP 6: Generate Regional Forecast
  // ========================================
  console.log("=".repeat(70));
  console.log("⚙️  STEP 6: GENERATING REGIONAL FORECAST");
  console.log("=".repeat(70));
  console.log();

  if (currentInfo.canGenerate) {
    console.log("⏳ Initiating forecast generation...");
    console.log("📝 Note: This will trigger FHE decryption via Zama Gateway");
    console.log();

    const generateTx = await weatherAggregator.generateRegionalForecast();
    const receipt = await generateTx.wait();

    console.log("✅ Forecast generation transaction confirmed");
    console.log(`   Transaction Hash: ${receipt.hash}`);
    console.log(`   Block Number: ${receipt.blockNumber}`);
    console.log();

    console.log("⏳ Waiting for Gateway decryption callback...");
    console.log("   (In production, this may take 10-30 seconds)");
    console.log();

    // In a real scenario, we'd wait for the callback
    // For simulation, we'll just display the pending status

  } else {
    console.log("⚠️  Cannot generate forecast at this time");
    console.log(`   Reason: Need minimum 3 stations, currently have ${currentInfo.submittedStations}`);
    console.log();
  }

  // ========================================
  // STEP 7: Display Results Summary
  // ========================================
  console.log("=".repeat(70));
  console.log("📊 STEP 7: SIMULATION RESULTS SUMMARY");
  console.log("=".repeat(70));
  console.log();

  console.log("🏢 Registered Stations Summary:");
  console.log("─".repeat(70));

  for (const station of registeredStations) {
    const stationInfo = await weatherAggregator.getStationInfo(station.id);
    console.log(`\n📍 ${station.location}`);
    console.log(`   Station ID: ${station.id}`);
    console.log(`   Address: ${station.address}`);
    console.log(`   Status: ${stationInfo.isActive ? "✅ Active" : "❌ Inactive"}`);
    console.log(`   Submissions: ${stationInfo.submissionCount}`);
  }
  console.log();

  console.log("📊 Submitted Weather Data:");
  console.log("─".repeat(70));

  // Calculate averages from submitted data
  let avgTemp = 0, avgHumidity = 0, avgPressure = 0, avgWind = 0;

  submittedData.forEach((item, index) => {
    avgTemp += item.data.temperature;
    avgHumidity += item.data.humidity;
    avgPressure += item.data.pressure;
    avgWind += item.data.windSpeed;
  });

  const count = submittedData.length;
  avgTemp = avgTemp / count;
  avgHumidity = avgHumidity / count;
  avgPressure = avgPressure / count;
  avgWind = Math.floor(avgWind / count);

  console.log("\n🌡️  Expected Regional Averages (unencrypted calculation):");
  console.log(`   Temperature: ${(avgTemp / 100).toFixed(2)}°C`);
  console.log(`   Humidity: ${(avgHumidity / 100).toFixed(2)}%`);
  console.log(`   Pressure: ${(avgPressure / 100).toFixed(2)} hPa`);
  console.log(`   Wind Speed: ${avgWind} km/h`);
  console.log();
  console.log("📝 Note: The on-chain forecast will show similar values after Gateway decryption");
  console.log();

  // ========================================
  // STEP 8: Next Steps
  // ========================================
  console.log("=".repeat(70));
  console.log("💡 NEXT STEPS");
  console.log("=".repeat(70));
  console.log();

  console.log("1️⃣  Check forecast status:");
  console.log(`   npx hardhat run scripts/interact.js --network ${hre.network.name}`);
  console.log();

  console.log("2️⃣  Verify contract on Etherscan:");
  console.log(`   CONTRACT_ADDRESS=${contractAddress} npx hardhat run scripts/verify.js --network ${hre.network.name}`);
  console.log();

  console.log("3️⃣  View contract on Etherscan:");
  if (hre.network.name === "sepolia") {
    console.log(`   https://sepolia.etherscan.io/address/${contractAddress}`);
  }
  console.log();

  console.log("4️⃣  Update frontend configuration:");
  console.log(`   CONTRACT_ADDRESS="${contractAddress}"`);
  console.log();

  // Save deployment information
  const simulationResults = {
    contractAddress: contractAddress,
    deployer: deployer.address,
    network: hre.network.name,
    timestamp: new Date().toISOString(),
    stations: registeredStations.map(s => ({
      id: s.id,
      location: s.location,
      address: s.address
    })),
    expectedAverages: {
      temperature: (avgTemp / 100).toFixed(2),
      humidity: (avgHumidity / 100).toFixed(2),
      pressure: (avgPressure / 100).toFixed(2),
      windSpeed: avgWind
    },
    forecastGenerated: currentInfo.canGenerate
  };

  console.log("=".repeat(70));
  console.log("💾 SIMULATION RESULTS (JSON)");
  console.log("=".repeat(70));
  console.log();
  console.log(JSON.stringify(simulationResults, null, 2));
  console.log();

  console.log("=".repeat(70));
  console.log("✨ SIMULATION COMPLETED SUCCESSFULLY!");
  console.log("=".repeat(70));
  console.log();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Simulation failed:", error);
    process.exit(1);
  });
