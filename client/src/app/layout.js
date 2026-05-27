import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'ContentFlow AI — Automated Social Media Dashboard',
  description: 'Generate, schedule, and manage your social media content with AI-powered automation. Built for creators who want to grow smarter.',
  keywords: 'social media, AI, content creation, dashboard, automation',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
