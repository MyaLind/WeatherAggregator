const hre = require("hardhat");
require("dotenv").config();

/**
 * Verify Contract on Etherscan
 *
 * Usage:
 * npx hardhat run scripts/verify.js --network sepolia
 *
 * Or with custom contract address:
 * CONTRACT_ADDRESS=0x... npx hardhat run scripts/verify.js --network sepolia
 */

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS || "0x291B77969Bb18710609C35d263adCb0848a3f82F";

  console.log("🔍 Starting contract verification...\n");
  console.log("📍 Contract Address:", contractAddress);
  console.log("🌐 Network:", hre.network.name);
  console.log();

  try {
    console.log("⏳ Verifying contract on Etherscan...");

    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [], // ConfidentialWeatherAggregator has no constructor args
    });

    console.log("✅ Contract verified successfully!");
    console.log(`🔗 View on Etherscan: https://sepolia.etherscan.io/address/${contractAddress}#code`);
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Contract is already verified!");
      console.log(`🔗 View on Etherscan: https://sepolia.etherscan.io/address/${contractAddress}#code`);
    } else {
      console.error("❌ Verification failed:", error.message);
      process.exit(1);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
