import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Changed font to Inter for a more modern look
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: '--font-sans', // Assign to a CSS variable
  subsets: ['latin'],
});


export const metadata: Metadata = {
  title: 'CodeDuel Arena - Challenge Your Coding Skills', // Updated Title
  description: 'Engage in fast-paced coding quizzes and climb the ranks!', // Updated Description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}> {/* Applied Inter font globally */}
      <body className={`antialiased bg-background text-foreground`}> {/* Removed Geist vars, added base styles */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
