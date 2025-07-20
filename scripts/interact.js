const hre = require("hardhat");
require("dotenv").config();

/**
 * Interact with Deployed Contract
 *
 * This script demonstrates common interactions with the ConfidentialWeatherAggregator
 *
 * Usage:
 * npx hardhat run scripts/interact.js --network sepolia
 */

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS || "0x291B77969Bb18710609C35d263adCb0848a3f82F";

  console.log("🔧 Interacting with ConfidentialWeatherAggregator\n");
  console.log("📍 Contract Address:", contractAddress);

  // Get contract instance
  const ConfidentialWeatherAggregator = await hre.ethers.getContractFactory("ConfidentialWeatherAggregator");
  const weatherAggregator = ConfidentialWeatherAggregator.attach(contractAddress);

  // Get signer
  const [signer] = await hre.ethers.getSigners();
  console.log("👤 Signer Address:", signer.address);
  console.log();

  console.log("=".repeat(60));
  console.log("📊 CONTRACT STATUS");
  console.log("=".repeat(60));

  // Get owner
  const owner = await weatherAggregator.owner();
  console.log("👑 Owner:", owner);

  // Get station count
  const stationCount = await weatherAggregator.stationCount();
  console.log("🏢 Total Stations:", stationCount.toString());

  // Get active station count
  const activeStationCount = await weatherAggregator.getActiveStationCount();
  console.log("✅ Active Stations:", activeStationCount.toString());

  // Get forecast count
  const forecastCount = await weatherAggregator.forecastCount();
  console.log("📈 Total Forecasts:", forecastCount.toString());

  // Get time window status
  const timeWindowEnabled = await weatherAggregator.timeWindowEnabled();
  console.log("⏰ Time Window Enabled:", timeWindowEnabled);

  // Get current hour
  const currentHour = await weatherAggregator.getCurrentHour();
  console.log("🕐 Current Hour (UTC):", currentHour.toString());

  // Check submission and generation status
  const canSubmit = await weatherAggregator.canSubmitData();
  const canGenerate = await weatherAggregator.canGenerateForecast();
  console.log("📤 Can Submit Data:", canSubmit);
  console.log("⚙️  Can Generate Forecast:", canGenerate);

  console.log();
  console.log("=".repeat(60));
  console.log("🏢 REGISTERED STATIONS");
  console.log("=".repeat(60));

  for (let i = 0; i < stationCount; i++) {
    try {
      const stationInfo = await weatherAggregator.getStationInfo(i);
      console.log(`\n📍 Station ${i}:`);
      console.log(`   Address: ${stationInfo.stationAddress}`);
      console.log(`   Location: ${stationInfo.location}`);
      console.log(`   Status: ${stationInfo.isActive ? "✅ Active" : "❌ Inactive"}`);
      console.log(`   Submissions: ${stationInfo.submissionCount.toString()}`);
      console.log(`   Last Submission: ${stationInfo.lastSubmissionTime > 0 ? new Date(Number(stationInfo.lastSubmissionTime) * 1000).toISOString() : "Never"}`);

      // Check if station has submitted this period
      const hasSubmitted = await weatherAggregator.hasStationSubmitted(i);
      console.log(`   Submitted This Period: ${hasSubmitted ? "✅ Yes" : "❌ No"}`);
    } catch (error) {
      console.log(`\n❌ Error getting info for Station ${i}:`, error.message);
    }
  }

  console.log();
  console.log("=".repeat(60));
  console.log("📊 CURRENT FORECAST PERIOD");
  console.log("=".repeat(60));

  const currentInfo = await weatherAggregator.getCurrentForecastInfo();
  console.log("\n📈 Current Forecast ID:", currentInfo.currentForecastId.toString());
  console.log("✅ Stations Submitted:", currentInfo.submittedStations.toString());
  console.log("📤 Can Submit:", currentInfo.canSubmit);
  console.log("⚙️  Can Generate:", currentInfo.canGenerate);

  console.log();
  console.log("=".repeat(60));
  console.log("📈 FORECAST HISTORY");
  console.log("=".repeat(60));

  if (forecastCount > 0) {
    // Show last 5 forecasts
    const forecastsToShow = Math.min(5, Number(forecastCount));
    const startIndex = Math.max(0, Number(forecastCount) - forecastsToShow);

    for (let i = startIndex; i < forecastCount; i++) {
      try {
        const forecast = await weatherAggregator.getRegionalForecast(i);

        console.log(`\n📊 Forecast #${i}:`);
        console.log(`   Status: ${forecast.isGenerated ? "✅ Generated" : "⏳ Pending"}`);
        console.log(`   Participating Stations: ${forecast.participatingStations.toString()}`);
        console.log(`   Timestamp: ${new Date(Number(forecast.timestamp) * 1000).toISOString()}`);

        if (forecast.isGenerated) {
          console.log(`   🌡️  Temperature: ${(Number(forecast.temperature) / 100).toFixed(2)}°C`);
          console.log(`   💧 Humidity: ${(Number(forecast.humidity) / 100).toFixed(2)}%`);
          console.log(`   🔽 Pressure: ${(Number(forecast.pressure) / 100).toFixed(2)} hPa`);
          console.log(`   💨 Wind Speed: ${forecast.windSpeed.toString()} km/h`);
        }
      } catch (error) {
        console.log(`\n❌ Error getting Forecast #${i}:`, error.message);
      }
    }
  } else {
    console.log("\n📭 No forecasts generated yet");
  }

  console.log();
  console.log("=".repeat(60));
  console.log("💡 QUICK ACTIONS");
  console.log("=".repeat(60));
  console.log("\n📝 To register a new station (owner only):");
  console.log("   await weatherAggregator.registerStation(stationAddress, 'Location Name')");

  console.log("\n📤 To submit weather data (registered station only):");
  console.log("   await weatherAggregator.submitWeatherData(temperature, humidity, pressure, windSpeed)");
  console.log("   Example: submitWeatherData(2250, 6500, 10130, 15) for 22.5°C, 65%, 1013hPa, 15km/h");

  console.log("\n⚙️  To generate forecast (anyone, when conditions met):");
  console.log("   await weatherAggregator.generateRegionalForecast()");

  console.log("\n⏰ To toggle time window (owner only, for testing):");
  console.log("   await weatherAggregator.setTimeWindowEnabled(false)");

  console.log();
  console.log("✨ Script completed successfully!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
