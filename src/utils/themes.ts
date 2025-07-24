import { Theme } from '@/types';

export const themes: Theme[] = [
  {
    name: 'Purple Dream',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cardBorder: '#667eea',
    primaryColor: '#667eea',
    accentColor: '#764ba2'
  },
  {
    name: 'Ocean Breeze',
    background: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
    cardBorder: '#2193b0',
    primaryColor: '#2193b0',
    accentColor: '#6dd5ed'
  },
  {
    name: 'Sunset Glow',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    cardBorder: '#f5576c',
    primaryColor: '#f5576c',
    accentColor: '#f093fb'
  },
  {
    name: 'Forest Green',
    background: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
    cardBorder: '#134e5e',
    primaryColor: '#134e5e',
    accentColor: '#71b280'
  },
  {
    name: 'Fire Blaze',
    background: 'linear-gradient(135deg, #fa8231 0%, #fc6076 100%)',
    cardBorder: '#fa8231',
    primaryColor: '#fa8231',
    accentColor: '#fc6076'
  },
  {
    name: 'Midnight Blue',
    background: 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)',
    cardBorder: '#4ca1af',
    primaryColor: '#4ca1af',
    accentColor: '#2c3e50'
  },
  {
    name: 'Cherry Blossom',
    background: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
    cardBorder: '#eb3349',
    primaryColor: '#eb3349',
    accentColor: '#f45c43'
  },
  {
    name: 'Aqua Marine',
    background: 'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)',
    cardBorder: '#00b4db',
    primaryColor: '#00b4db',
    accentColor: '#0083b0'
  },
  {
    name: 'Royal Purple',
    background: 'linear-gradient(135deg, #834d9b 0%, #d04ed6 100%)',
    cardBorder: '#834d9b',
    primaryColor: '#834d9b',
    accentColor: '#d04ed6'
  },
  {
    name: 'Golden Hour',
    background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
    cardBorder: '#f7971e',
    primaryColor: '#f7971e',
    accentColor: '#ffd200'
  }
];

export const getRandomTheme = (): Theme => {
  return themes[Math.floor(Math.random() * themes.length)];
};
