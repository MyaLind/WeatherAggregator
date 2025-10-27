# 📜 Scripts Reference Guide

Quick reference for all available Hardhat scripts in the Confidential Weather Aggregator project.

---

## 🎯 Quick Commands

| Task | Command | Description |
|------|---------|-------------|
| **Compile** | `npm run compile` | Compile all smart contracts |
| **Test** | `npm test` | Run the test suite |
| **Deploy** | `npm run deploy:sepolia` | Deploy to Sepolia testnet |
| **Verify** | `npm run verify` | Verify contract on Etherscan |
| **Interact** | `npm run interact` | Interact with deployed contract |
| **Simulate** | `npm run simulate` | Run full system simulation |
| **Clean** | `npm run clean` | Remove artifacts and cache |

---

## 📦 Development Scripts

### Compile Contracts

```bash
npm run compile
# or
npx hardhat compile
```

**What it does:**
- Compiles all Solidity contracts
- Generates artifacts in `artifacts/` directory
- Creates type definitions
- Validates contract syntax

**Output:**
- `artifacts/` - Compiled contracts
- `cache/` - Compilation cache

---

### Run Tests

```bash
npm test
# or
npx hardhat test
```

**What it does:**
- Runs all test files in `test/` directory
- Reports test results and coverage
- Validates contract functionality

**Options:**
```bash
# Run specific test file
npx hardhat test test/ConfidentialWeatherAggregator.test.js

# Run with gas reporting
REPORT_GAS=true npm test

# Run with coverage
npx hardhat coverage
```

---

### Clean Artifacts

```bash
npm run clean
# or
npx hardhat clean
```

**What it does:**
- Removes `artifacts/` directory
- Removes `cache/` directory
- Cleans typechain files

**When to use:**
- Before fresh compilation
- When switching Solidity versions
- To free up disk space

---

## 🚀 Deployment Scripts

### Deploy to Sepolia

```bash
npm run deploy:sepolia
# or
npx hardhat run scripts/deploy.js --network sepolia
```

**What it does:**
- Deploys ConfidentialWeatherAggregator contract
- Displays deployment information
- Shows gateway configuration notes
- Provides contract address for frontend

**Required Environment Variables:**
```env
SEPOLIA_RPC_URL=your_rpc_url
PRIVATE_KEY=your_private_key
```

**Output:**
```
🚀 Starting deployment...
📝 Deploying contracts with account: 0x...
✅ Contract deployed to: 0x...
👤 Contract owner: 0x...
```

**Save the contract address** for verification and interaction!

---

### Deploy to Localhost

```bash
# Terminal 1: Start local node
npx hardhat node

# Terminal 2: Deploy
npm run deploy
# or
npx hardhat run scripts/deploy.js --network localhost
```

**What it does:**
- Deploys to local Hardhat network
- Useful for testing before testnet deployment
- No gas costs

---

## ✅ Verification Scripts

### Verify on Etherscan

```bash
npm run verify
# or
CONTRACT_ADDRESS=0x... npx hardhat run scripts/verify.js --network sepolia
```

**What it does:**
- Verifies contract source code on Etherscan
- Makes contract readable on block explorer
- Enables direct interaction through Etherscan UI

**Required Environment Variables:**
```env
ETHERSCAN_API_KEY=your_api_key
CONTRACT_ADDRESS=deployed_contract_address
```

**Output:**
```
🔍 Starting contract verification...
📍 Contract Address: 0x...
✅ Contract verified successfully!
🔗 View on Etherscan: https://sepolia.etherscan.io/address/0x...#code
```

**Alternative Method:**
```bash
npx hardhat verify --network sepolia 0xYourContractAddress
```

---

## 🔧 Interaction Scripts

### Interact with Deployed Contract

```bash
npm run interact
# or
CONTRACT_ADDRESS=0x... npx hardhat run scripts/interact.js --network sepolia
```

**What it does:**
- Connects to deployed contract
- Displays current contract status
- Shows registered stations
- Lists forecast history
- Provides interaction examples

**Required Environment Variables:**
```env
CONTRACT_ADDRESS=deployed_contract_address
SEPOLIA_RPC_URL=your_rpc_url
PRIVATE_KEY=your_private_key
```

**Output Sections:**
1. **Contract Status** - Owner, station count, forecast count
2. **Registered Stations** - All stations with details
3. **Current Forecast Period** - Submission status
4. **Forecast History** - Recent forecasts
5. **Quick Actions** - Code examples for common tasks

---

### Hardhat Console

For custom interactions:

```bash
npx hardhat console --network sepolia
```

**Example Usage:**
```javascript
// Get contract instance
const contract = await ethers.getContractAt(
  "ConfidentialWeatherAggregator",
  "0xYourContractAddress"
);

// Get owner
const owner = await contract.owner();
console.log("Owner:", owner);

// Get station count
const count = await contract.stationCount();
console.log("Stations:", count.toString());

// Get current forecast info
const info = await contract.getCurrentForecastInfo();
console.log("Forecast ID:", info.currentForecastId.toString());
```

---

## 🎮 Simulation Scripts

### Run Full System Simulation

```bash
npm run simulate
# or
npx hardhat run scripts/simulate.js --network sepolia
```

**What it does:**
1. ✅ Deploys new contract
2. ✅ Registers 5 weather stations
3. ✅ Configures time windows
4. ✅ Submits weather data from all stations
5. ✅ Checks submission status
6. ✅ Generates regional forecast
7. ✅ Displays comprehensive results

**Required Environment Variables:**
```env
SEPOLIA_RPC_URL=your_rpc_url
PRIVATE_KEY=your_private_key
```

**Simulation Stations:**
- Tokyo Weather Station
- Seoul Meteorological Center
- Beijing Climate Observatory
- Shanghai Weather Bureau
- Hong Kong Observatory

**Output:**
- Complete step-by-step execution log
- Weather data from each station
- Expected regional averages
- Deployment information JSON
- Next steps guide

**Use Cases:**
- Testing complete workflow
- Demo purposes
- Integration testing
- Verifying system functionality

---

## 🌐 Network Options

### Supported Networks

| Network | Command Flag | Description |
|---------|-------------|-------------|
| **Hardhat** | `--network hardhat` | Local in-memory network |
| **Localhost** | `--network localhost` | Local Hardhat node |
| **Sepolia** | `--network sepolia` | Ethereum testnet |

### Run Script on Specific Network

```bash
# General format
npx hardhat run scripts/SCRIPT_NAME.js --network NETWORK_NAME

# Examples
npx hardhat run scripts/deploy.js --network sepolia
npx hardhat run scripts/interact.js --network localhost
npx hardhat run scripts/simulate.js --network sepolia
```

---

## 📊 Additional Commands

### Check Account Balance

```bash
npx hardhat run scripts/check-balance.js --network sepolia
```

### Run Specific Test

```bash
npx hardhat test test/ConfidentialWeatherAggregator.test.js
```

### Generate Gas Report

```bash
REPORT_GAS=true npx hardhat test
```

### Generate Coverage Report

```bash
npx hardhat coverage
```

### List Accounts

```bash
npx hardhat accounts
```

### Check Hardhat Version

```bash
npx hardhat --version
```

---

## 🔍 Script Details

### scripts/deploy.js

**Purpose:** Deploy ConfidentialWeatherAggregator contract

**Features:**
- Account balance check
- Contract deployment
- Owner verification
- Gateway configuration notes
- Pauser setup instructions
- Deployment info export

**Usage:**
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

---

### scripts/verify.js

**Purpose:** Verify contract on Etherscan

**Features:**
- Automatic verification
- Already-verified detection
- Etherscan link generation
- Error handling

**Usage:**
```bash
CONTRACT_ADDRESS=0x... npx hardhat run scripts/verify.js --network sepolia
```

---

### scripts/interact.js

**Purpose:** Interact with deployed contract

**Features:**
- Contract status display
- Station information
- Forecast history
- Current period info
- Quick action examples

**Usage:**
```bash
CONTRACT_ADDRESS=0x... npx hardhat run scripts/interact.js --network sepolia
```

---

### scripts/simulate.js

**Purpose:** Run full end-to-end simulation

**Features:**
- Complete workflow test
- Multiple station simulation
- Weather data generation
- Forecast generation
- Results summary

**Usage:**
```bash
npx hardhat run scripts/simulate.js --network sepolia
```

---

## 🛠️ Troubleshooting

### Script Fails to Find Contract

**Error:** `Contract not found`

**Solution:**
```bash
# Ensure contract is compiled
npm run compile

# Check artifacts exist
ls artifacts/contracts/ConfidentialWeatherAggregator.sol/
```

---

### Environment Variables Not Loaded

**Error:** `Cannot read properties of undefined`

**Solution:**
```bash
# Ensure .env file exists
cp env.example .env

# Edit .env with your values
# Verify .env is in root directory
ls -la .env
```

---

### Network Connection Issues

**Error:** `could not detect network`

**Solution:**
```bash
# Test RPC connection
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  YOUR_RPC_URL

# Try alternative RPC provider
# Update SEPOLIA_RPC_URL in .env
```

---

### Insufficient Funds

**Error:** `insufficient funds for gas`

**Solution:**
- Get Sepolia ETH from faucets
- Check balance: `npx hardhat run scripts/check-balance.js`
- Ensure correct wallet address

---

## 📚 Additional Resources

- **Hardhat Documentation**: https://hardhat.org/docs
- **Ethers.js Documentation**: https://docs.ethers.org/v5/
- **Deployment Guide**: See `DEPLOYMENT_GUIDE.md`
- **Main README**: See `README.md`

---

**Last Updated:** November 2, 2025
**Project:** Confidential Weather Aggregator
**Framework:** Hardhat 2.22.16
