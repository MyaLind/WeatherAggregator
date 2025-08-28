# Quick Start Guide

## Installation & Running

### Step 1: Install Dependencies
```bash
cd weather-aggregator-app
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

### Step 3: Connect Wallet
1. Open the application in your browser
2. Ensure MetaMask is installed
3. Click "Connect Wallet"
4. Approve the connection in MetaMask

## Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run lint` | Check code quality |
| `npm run type-check` | Verify TypeScript types |

## Project Structure

```
weather-aggregator-app/
├── src/
│   ├── app/              # Pages & layouts
│   │   ├── page.tsx      # Main page
│   │   ├── layout.tsx    # Root layout
│   │   └── globals.css   # Global styles
│   ├── components/       # UI components
│   │   ├── ConnectionCard.tsx
│   │   ├── ForecastInfoCard.tsx
│   │   ├── ContractInfoCard.tsx
│   │   ├── RegisterStationCard.tsx
│   │   ├── SubmitWeatherDataCard.tsx
│   │   ├── GenerateForecastCard.tsx
│   │   ├── StationsList.tsx
│   │   └── ForecastHistory.tsx
│   ├── hooks/            # Custom hooks
│   │   ├── useWeb3.ts
│   │   └── useContract.ts
│   ├── types/            # TypeScript types
│   │   ├── index.ts
│   │   └── window.d.ts
│   └── utils/            # Utilities
│       ├── contract.ts
│       └── themes.ts
├── public/               # Static files
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── next.config.js        # Next.js config
```

## Key Features

### 🔐 Privacy-Preserving
All weather data is encrypted using FHE technology

### 🌐 Decentralized
Built on Ethereum blockchain for transparency

### 📱 Responsive
Works on desktop, tablet, and mobile

### 🎨 Dynamic Themes
Random color theme on each page load

### ⚡ Real-time Updates
Auto-refresh every 30 seconds

## Usage

### For Contract Owners
1. Connect wallet
2. Register weather stations
3. Toggle time window restrictions
4. Monitor system activity

### For Weather Stations
1. Connect registered wallet
2. Submit weather data
3. View submission status

### For Everyone
1. View regional forecasts
2. Check station list
3. Browse historical data

## Configuration

### Smart Contract
- **Address**: `0x291B77969Bb18710609C35d263adCb0848a3f82F`
- **Network**: Ethereum Sepolia Testnet
- **Location**: `src/utils/contract.ts`

### Themes
- **Location**: `src/utils/themes.ts`
- **Count**: 10 different themes
- **Selection**: Random on page load

## Troubleshooting

### Issue: Cannot connect wallet
**Solution**: Ensure MetaMask is installed and on Sepolia network

### Issue: Transaction fails
**Solution**: Check you have sufficient ETH for gas fees

### Issue: Build errors
**Solution**:
```bash
rm -rf node_modules .next
npm install
npm run build
```

### Issue: Type errors
**Solution**:
```bash
npm run type-check
```

## Port Configuration

The default development port is **3000**. To use a different port:

```bash
# Option 1: Using PORT environment variable
PORT=3001 npm run dev

# Option 2: Using Next.js flag
npm run dev -- -p 3001
```

## Browser Requirements

- Chrome 120+ (recommended)
- Firefox 120+
- Safari 17+
- Edge 120+
- **MetaMask extension required**

## File Sizes

- **Bundle Size**: ~181 KB (gzipped)
- **Installation Size**: ~380 packages
- **Build Time**: ~10 seconds

## Environment

No environment variables needed. Everything is configured in code.

## Support

Need help? Check:
1. **README.md** - Detailed documentation
2. **DEPLOYMENT.md** - Deployment instructions
3. **PROJECT_OVERVIEW.md** - Technical details

## Next Steps

After installation:
1. ✅ Start development server
2. ✅ Connect MetaMask wallet
3. ✅ Test main features
4. ✅ Build for production
5. ✅ Deploy to hosting

## Deploy Now

**Vercel (Easiest)**:
```bash
npm install -g vercel
vercel
```

**Build & Export**:
```bash
npm run build
```

Then upload the `.next` folder to your hosting service.

---

Ready to go! 🚀
