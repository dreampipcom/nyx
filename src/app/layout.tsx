import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DreamPip — Dashboard',
  description: 'Your journey starts here. DreamPip is fintech for compassion.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
