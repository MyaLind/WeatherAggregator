# Deployment Guide

## Quick Start

### Development Mode

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open browser:
```
http://localhost:3000
```

## Production Deployment

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts to complete deployment

### Option 2: Netlify

1. Build the project:
```bash
npm run build
```

2. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

3. Deploy:
```bash
netlify deploy --prod
```

### Option 3: Docker

1. Create Dockerfile:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

2. Build Docker image:
```bash
docker build -t weather-aggregator .
```

3. Run container:
```bash
docker run -p 3000:3000 weather-aggregator
```

### Option 4: Static Export

1. Update `next.config.js`:
```javascript
const nextConfig = {
  output: 'export',
  // ... rest of config
}
```

2. Build:
```bash
npm run build
```

3. Deploy the `out` directory to any static hosting service

## Environment Configuration

No environment variables are needed. The smart contract address is hardcoded in:
- `src/utils/contract.ts`

If you need to change the contract address, edit this file before deployment.

## Pre-Deployment Checklist

- [ ] Run `npm run build` to ensure no build errors
- [ ] Run `npm run type-check` to verify TypeScript types
- [ ] Test with MetaMask on the target network
- [ ] Verify contract address is correct
- [ ] Test all major features:
  - [ ] Wallet connection
  - [ ] Station registration
  - [ ] Weather data submission
  - [ ] Forecast generation
  - [ ] Historical data viewing

## Post-Deployment

1. Test the deployed application with MetaMask
2. Verify all smart contract interactions work
3. Check responsive design on mobile devices
4. Monitor for any console errors

## Troubleshooting

### Build Errors

If you encounter build errors:
```bash
rm -rf node_modules .next
npm install
npm run build
```

### Type Errors

Run type checking:
```bash
npm run type-check
```

### Web3 Connection Issues

- Ensure MetaMask is installed
- Check you're on the correct network (Sepolia)
- Verify the contract address is correct
- Clear browser cache and reload

## Performance Optimization

The application is already optimized with:
- Code splitting
- Static generation where possible
- Optimized images
- Minimal bundle size

## Security Notes

- No private keys are stored
- All transactions require user approval
- Smart contract address is public
- No sensitive data in localStorage

## Support

For deployment issues, check:
1. Next.js documentation
2. Vercel documentation
3. Project README.md

---

Last updated: 2025-10-15
