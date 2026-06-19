import { ThemeProvider } from 'next-themes'; // <-- এই লাইনটাই মিসিং ছিল!
import './globals.css';

export const metadata = {
  title: 'StreamKeeper Pro',
  manifest: '/manifest.json', // PWA এর জন্য
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}