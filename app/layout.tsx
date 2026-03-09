import './globals.css';
import { AppStateProvider } from '@/state/AppStateContext';

export const metadata = {
  title: 'Gamlingay Social Club',
  description: 'Snooker Booking & Tournament Manager'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppStateProvider>{children}</AppStateProvider>
      </body>
    </html>
  );
}
