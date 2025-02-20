import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

export const metadata = {
  title: 'Grounded Q&A Chatbot',
  description: 'An intelligent chatbot that provides grounded answers to your questions',
  keywords: ['AI', 'Chatbot', 'Q&A', 'RAG', 'Next.js'],
  authors: [{ name: 'Your Name' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className={`font-sans antialiased ${plusJakarta.className}`}>{children}</body>
    </html>
  );
}
