# 🚀 Deployment Guide - Confidential Weather Aggregator

Complete guide for deploying and managing the Confidential Weather Aggregator smart contracts using Hardhat.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Compilation](#compilation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Verification](#verification)
- [Interaction](#interaction)
- [Simulation](#simulation)
- [Deployment Information](#deployment-information)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **Git**: Latest version
- **MetaMask**: Browser extension with Sepolia testnet configured

### Required Accounts & Keys

1. **Ethereum Wallet**
   - Private key for deployment
   - Sufficient Sepolia ETH for gas fees (~0.1 ETH recommended)

2. **RPC Provider** (Choose one)
   - [Infura](https://infura.io) - Free tier available
   - [Alchemy](https://www.alchemy.com) - Free tier available
   - [QuickNode](https://www.quicknode.com) - Free tier available

3. **Etherscan API Key**
   - Register at [Etherscan](https://etherscan.io/myapikey)
   - Required for contract verification

### Get Sepolia Testnet ETH

Visit one of these faucets to get free Sepolia ETH:

- [Sepolia Faucet](https://sepoliafaucet.com)
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com)

---

## 🌍 Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/MyaLind/WeatherAggregator.git
cd WeatherAggregator
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- Hardhat and plugins
- Ethers.js v5
- Testing utilities
- Next.js and React dependencies

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp env.example .env
```

Edit `.env` and fill in your values:

```env
# Network Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Wallet Configuration
PRIVATE_KEY=your_private_key_without_0x_prefix

# Etherscan Configuration
ETHERSCAN_API_KEY=your_etherscan_api_key

# Contract Configuration (fill after deployment)
CONTRACT_ADDRESS=

# Optional: Enable gas reporting
REPORT_GAS=true
```

### 4. Verify Configuration

Test your setup:

```bash
npx hardhat --version
```

You should see output like:
```
2.22.16
```

---

## 🏗️ Compilation

### Compile Smart Contracts

```bash
npm run compile
```

Or using Hardhat directly:

```bash
npx hardhat compile
```

**Expected Output:**
```
Compiled 1 Solidity file successfully
```

**Generated Files:**
- `artifacts/` - Compiled contract artifacts
- `cache/` - Compilation cache

### Clean Artifacts

If you need to recompile from scratch:

```bash
npm run clean
npx hardhat compile
```

---

## 🧪 Testing

### Run All Tests

```bash
npm test
```

Or:

```bash
npx hardhat test
```

### Run Specific Test File

```bash
npx hardhat test test/ConfidentialWeatherAggregator.test.js
```

### Run with Gas Reporting

```bash
REPORT_GAS=true npx hardhat test
```

### Test Coverage

Generate coverage report:

```bash
npx hardhat coverage
```

**Coverage reports will be in:**
- `coverage/` - HTML coverage report
- `coverage.json` - JSON coverage data

---

## 🚀 Deployment

### Deploy to Sepolia Testnet

```bash
npm run deploy:sepolia
```

Or:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

**Expected Output:**
```
🚀 Starting deployment of ConfidentialWeatherAggregator...

📝 Deploying contracts with account: 0xYourAddress
💰 Account balance: 0.5 ETH

📦 Deploying ConfidentialWeatherAggregator...
✅ ConfidentialWeatherAggregator deployed to: 0xContractAddress
👤 Contract owner: 0xYourAddress

============================================================
⚙️  GATEWAY CONFIGURATION NOTES
============================================================
...
```

**Save the Contract Address!** You'll need it for verification and interaction.

### Deploy to Local Network

1. Start a local Hardhat node:

```bash
npx hardhat node
```

2. In another terminal, deploy:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

### Update Environment

After deployment, update your `.env`:

```env
CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

---

## ✅ Verification

### Verify on Etherscan

After deployment, verify your contract:

```bash
npm run verify
```

Or with specific contract address:

```bash
CONTRACT_ADDRESS=0xYourContractAddress npx hardhat run scripts/verify.js --network sepolia
```

**Expected Output:**
```
🔍 Starting contract verification...

📍 Contract Address: 0xYourContractAddress
🌐 Network: sepolia

⏳ Verifying contract on Etherscan...
✅ Contract verified successfully!
🔗 View on Etherscan: https://sepolia.etherscan.io/address/0xYourContractAddress#code
```

### Alternative Verification Method

Using Hardhat's built-in verify task:

```bash
npx hardhat verify --network sepolia 0xYourContractAddress
```

**If Already Verified:**
```
✅ Contract is already verified!
```

---

## 🔧 Interaction

### Interact with Deployed Contract

```bash
npm run interact
```

Or:

```bash
CONTRACT_ADDRESS=0xYourContractAddress npx hardhat run scripts/interact.js --network sepolia
```

**This script will:**
- Connect to the deployed contract
- Display contract status and statistics
- Show registered weather stations
- Display current forecast period info
- Show forecast history
- Provide quick action examples

**Sample Output:**
```
🔧 Interacting with ConfidentialWeatherAggregator

📍 Contract Address: 0xYourContractAddress
👤 Signer Address: 0xYourAddress

============================================================
📊 CONTRACT STATUS
============================================================
👑 Owner: 0xOwnerAddress
🏢 Total Stations: 3
✅ Active Stations: 3
📈 Total Forecasts: 5
⏰ Time Window Enabled: true
...
```

### Custom Interactions

Create your own interaction script or use Hardhat console:

```bash
npx hardhat console --network sepolia
```

Then interact with the contract:

```javascript
const contract = await ethers.getContractAt(
  "ConfidentialWeatherAggregator",
  "0xYourContractAddress"
);

const owner = await contract.owner();
console.log("Owner:", owner);

const stationCount = await contract.stationCount();
console.log("Stations:", stationCount.toString());
```

---

## 🎮 Simulation

### Run Full System Simulation

The simulation script performs a complete end-to-end test:

```bash
npm run simulate
```

Or:

```bash
npx hardhat run scripts/simulate.js --network sepolia
```

**Simulation Steps:**

1. ✅ Deploy contract
2. ✅ Register 5 weather stations
3. ✅ Configure time windows
4. ✅ Submit weather data from all stations
5. ✅ Check submission status
6. ✅ Generate regional forecast
7. ✅ Display results summary

**Expected Output:**
```
======================================================================
🌤️  CONFIDENTIAL WEATHER AGGREGATOR - FULL SIMULATION
======================================================================

📦 STEP 1: DEPLOYING CONTRACT
✅ Contract deployed at: 0xNewContractAddress

🏢 STEP 2: REGISTERING WEATHER STATIONS
📍 Registering Station 0: Tokyo Weather Station
📍 Registering Station 1: Seoul Meteorological Center
...

📤 STEP 4: SUBMITTING WEATHER DATA
📊 Station 0 (Tokyo Weather Station):
   Temperature: 22.50°C
   Humidity: 65.00%
   ...

📊 SIMULATION RESULTS SUMMARY
...
```

---

## 📊 Deployment Information

### Current Deployment (Sepolia Testnet)

| Parameter | Value |
|-----------|-------|
| **Network** | Ethereum Sepolia Testnet |
| **Contract Address** | `0x291B77969Bb18710609C35d263adCb0848a3f82F` |
| **Owner Address** | `0xee8d5E90a8c481C5D482fdbb278649A66fF96A9A` |
| **Gateway Address** | `0x33347831500F1E73F0CccBBe71C7E21Ca0100a42` |
| **Compiler Version** | Solidity 0.8.24 |
| **Optimizer** | Enabled (200 runs) |
| **EVM Version** | Cancun |

### Network Information

**Sepolia Testnet:**
- Chain ID: `11155111`
- Currency: SepoliaETH (Test ETH)
- Block Explorer: [https://sepolia.etherscan.io](https://sepolia.etherscan.io)
- RPC Endpoint: `https://rpc.sepolia.org`

### Contract Links

- **Etherscan**: [https://sepolia.etherscan.io/address/0x291B77969Bb18710609C35d263adCb0848a3f82F](https://sepolia.etherscan.io/address/0x291B77969Bb18710609C35d263adCb0848a3f82F)
- **Contract Code**: [https://sepolia.etherscan.io/address/0x291B77969Bb18710609C35d263adCb0848a3f82F#code](https://sepolia.etherscan.io/address/0x291B77969Bb18710609C35d263adCb0848a3f82F#code)
- **Read Contract**: [https://sepolia.etherscan.io/address/0x291B77969Bb18710609C35d263adCb0848a3f82F#readContract](https://sepolia.etherscan.io/address/0x291B77969Bb18710609C35d263adCb0848a3f82F#readContract)
- **Write Contract**: [https://sepolia.etherscan.io/address/0x291B77969Bb18710609C35d263adCb0848a3f82F#writeContract](https://sepolia.etherscan.io/address/0x291B77969Bb18710609C35d263adCb0848a3f82F#writeContract)

---

## 🛠️ Troubleshooting

### Common Issues

#### 1. Compilation Errors

**Error:** `Module not found`

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 2. Insufficient Funds

**Error:** `insufficient funds for gas * price + value`

**Solution:**
- Get more Sepolia ETH from faucets
- Check your wallet balance: `npx hardhat run scripts/check-balance.js`

#### 3. Network Connection Issues

**Error:** `could not detect network`

**Solution:**
- Verify your RPC URL in `.env`
- Try alternative RPC provider
- Check internet connection

#### 4. Private Key Issues

**Error:** `invalid private key`

**Solution:**
- Ensure private key is without `0x` prefix
- Verify key is 64 characters (hex)
- Check for extra spaces or newlines

#### 5. Verification Failed

**Error:** `verification failed`

**Solutions:**
- Wait 1-2 minutes after deployment
- Ensure contract is deployed
- Verify Etherscan API key
- Check constructor arguments match deployment

#### 6. Transaction Timeout

**Error:** `timeout exceeded`

**Solutions:**
```bash
# Increase timeout in hardhat.config.js
mocha: {
  timeout: 120000 // 2 minutes
}
```

### Debug Mode

Enable verbose logging:

```bash
DEBUG=true npx hardhat run scripts/deploy.js --network sepolia
```

### Check Node Version

```bash
node --version  # Should be v18+
npm --version   # Should be v8+
```

### Clear Cache

```bash
npm run clean
rm -rf cache artifacts
npx hardhat compile
```

---

## 📚 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run compile` | Compile smart contracts |
| `npm test` | Run test suite |
| `npm run deploy` | Deploy to local network |
| `npm run deploy:sepolia` | Deploy to Sepolia testnet |
| `npm run verify` | Verify contract on Etherscan |
| `npm run interact` | Interact with deployed contract |
| `npm run simulate` | Run full system simulation |
| `npm run clean` | Clean artifacts and cache |
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build Next.js application |

---

## 🔐 Security Best Practices

1. **Never commit `.env` file** - Add to `.gitignore`
2. **Use different keys** for development and production
3. **Backup your private key** securely
4. **Rotate API keys** regularly
5. **Test on testnet first** before mainnet
6. **Verify contract source** code on Etherscan
7. **Use hardware wallet** for production deployments
8. **Monitor gas prices** before deployment
9. **Audit contracts** before mainnet deployment
10. **Set spending limits** on deployment wallets

---

## 📞 Support

If you encounter issues:

1. Check this troubleshooting guide
2. Review [Hardhat Documentation](https://hardhat.org/docs)
3. Check [GitHub Issues](https://github.com/MyaLind/WeatherAggregator/issues)
4. Review [Zama fhEVM Documentation](https://docs.zama.ai/fhevm)

---

## 📝 Next Steps

After successful deployment:

1. ✅ Verify contract on Etherscan
2. ✅ Update frontend configuration
3. ✅ Register weather stations
4. ✅ Test data submission
5. ✅ Monitor contract events
6. ✅ Set up monitoring and alerts

---

**Last Updated:** November 2025
**Hardhat Version:** 2.22.16
**Network:** Sepolia Testnet
