'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/schedule', label: 'Bookings' },
  { href: '/standings/singles', label: 'Standings' },
  { href: '/knockout', label: 'Bracket' },
  { href: '/members', label: 'Members' }
];

export function AppShell({ title, children }: { title: string; children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl bg-slate-100 pb-24">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-4">
        <h1 className="text-3xl font-bold">{title}</h1>
      </header>
      <main className="space-y-4 p-4">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-3xl grid-cols-5">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`p-3 text-center text-sm font-semibold ${pathname === l.href ? 'text-brand-500' : 'text-slate-400'}`}>
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
