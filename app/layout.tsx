import type { Metadata } from 'next';
import { Cormorant_Garamond, IM_Fell_English } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const imFell = IM_Fell_English({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-im-fell',
  display: 'swap',
});

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
    <html lang="en" className={`${cormorant.variable} ${imFell.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
