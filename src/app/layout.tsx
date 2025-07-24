import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Confidential Weather Aggregator',
  description: 'A privacy-preserving weather data aggregator using FHE encryption',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
