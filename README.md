# Confidential Weather Aggregator

A privacy-preserving weather data aggregator using FHE (Fully Homomorphic Encryption) technology. This application allows weather stations to submit encrypted weather data and generates regional forecasts while maintaining data privacy.

## 🌐 Live Demo

- **Live Application**: [https://weather-aggregator.vercel.app/](https://weather-aggregator.vercel.app/)
- **GitHub Repository**: [https://github.com/MyaLind/WeatherAggregator](https://github.com/MyaLind/WeatherAggregator)
- **Video Demo**: [`demo.mp4`] - Download and watch the video demonstration of the application

## 🎥 Video Demonstration

A comprehensive video demonstration is available in the repository:

- **File**: `demo.mp4` (9.0 MB)
- **How to Watch**:
  1. Clone the repository or download the file directly from GitHub
  2. Open the video file with your preferred media player
  3. Watch a complete walkthrough of all application features

The video demonstrates:
- Wallet connection process
- Weather station registration
- Data submission workflow
- Forecast generation
- Real-time updates
- UI interactions and theme variations

## Features

- **Privacy-Preserving**: All weather data is encrypted using FHE technology
- **Decentralized**: Built on blockchain technology for transparency and trust
- **Real-time Updates**: Automatic data refresh every 30 seconds
- **Modern UI**: Built with Next.js and React for a smooth user experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Random Themes**: Each page load features a unique color theme

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Blockchain**: Ethereum, Ethers.js
- **Encryption**: FHEVM (Fully Homomorphic Encryption Virtual Machine)
- **Styling**: CSS3 with dynamic theming

## Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- MetaMask browser extension
- Access to Ethereum testnet (Sepolia recommended)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/MyaLind/WeatherAggregator.git
cd WeatherAggregator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

### For Contract Owners

1. **Connect Wallet**: Click "Connect Wallet" to connect your MetaMask
2. **Register Stations**: Add weather station addresses and locations
3. **Toggle Time Window**: Enable/disable time-based submission restrictions
4. **Monitor Activity**: View all registered stations and their submissions

### For Weather Stations

1. **Connect Wallet**: Connect your registered station wallet
2. **Submit Data**: Enter temperature, humidity, pressure, and wind speed
3. **View Status**: Check if your submission was successful
4. **Track History**: See your submission history

### For Anyone

1. **View Forecasts**: See generated regional weather forecasts
2. **Check Stations**: View all registered weather stations
3. **Browse History**: Access historical forecast data

## Smart Contract

- **Contract Address**: `0x291B77969Bb18710609C35d263adCb0848a3f82F`
- **Network**: Ethereum Sepolia Testnet
- **Features**:
  - Station registration and management
  - Encrypted weather data submission
  - Regional forecast generation
  - Time window controls

## Project Structure

```
weather-aggregator-app/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main application page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ConnectionCard.tsx
│   │   ├── ContractInfoCard.tsx
│   │   ├── ForecastInfoCard.tsx
│   │   ├── RegisterStationCard.tsx
│   │   ├── SubmitWeatherDataCard.tsx
│   │   ├── GenerateForecastCard.tsx
│   │   ├── StationsList.tsx
│   │   └── ForecastHistory.tsx
│   ├── hooks/
│   │   ├── useWeb3.ts         # Web3 connection hook
│   │   └── useContract.ts     # Contract interaction hook
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   └── utils/
│       ├── contract.ts        # Contract configuration
│       └── themes.ts          # Theme definitions
├── public/                    # Static assets
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Environment Variables

No environment variables are required. The contract address is hardcoded in the application.

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

Note: MetaMask extension must be installed for Web3 functionality.

## Security

- All sensitive operations require wallet signature
- Smart contract is verified on Etherscan
- No private keys are stored in the application
- All weather data is encrypted using FHE

## Contributing

This project was created for the FHEVM Development Competition. For questions or suggestions, please contact the development team.

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Zama for FHEVM technology
- Ethereum Foundation
- Next.js team
- React team

## Links

- **Live Demo**: [https://weather-aggregator.vercel.app/](https://weather-aggregator.vercel.app/)
- **GitHub Repository**: [https://github.com/MyaLind/WeatherAggregator](https://github.com/MyaLind/WeatherAggregator)
- **Smart Contract**: [0x291B77969Bb18710609C35d263adCb0848a3f82F](https://sepolia.etherscan.io/address/0x291B77969Bb18710609C35d263adCb0848a3f82F)

## Support

For technical support or questions:
- Review the documentation
- Check existing issues on [GitHub](https://github.com/MyaLind/WeatherAggregator/issues)
- Visit the [live application](https://weather-aggregator.vercel.app/)

---

Built with ❤️ using FHEVM technology

**Repository**: [github.com/MyaLind/WeatherAggregator](https://github.com/MyaLind/WeatherAggregator)
