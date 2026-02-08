import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Best Kebabs BCN',
  description: 'Discover, map, and rate the best kebabs in Barcelona',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}