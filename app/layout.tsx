import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Amaravathi Lodge - Book Your Stay',
  description: 'Find affordable and comfortable rooms in Bengaluru',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}