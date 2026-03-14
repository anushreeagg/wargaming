import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The White House and the Archipelago',
  description: 'A wargame. 15 October 1898. The Philippines. You have one day.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
