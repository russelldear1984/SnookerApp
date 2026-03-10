'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/schedule', label: 'Bookings' },
  { href: '/standings/singles', label: 'Standings' },
  { href: '/knockout', label: 'Knockout' },
  { href: '/members', label: 'Members' }
];

export function AppShell({ title, children }: { title: string; children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto min-h-screen w-full max-w-5xl px-3 py-4 md:px-6 md:py-6">
      <header className="sticky top-0 z-20 mb-4 rounded-2xl border border-emerald-100 bg-white/95 p-3 shadow-[0_10px_30px_rgba(15,23,42,0.10)] backdrop-blur">
        <div className="mb-3 flex items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2"><span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-emerald-500 to-green-700" aria-hidden />
          <h1 className="text-xl font-bold text-slate-900 md:text-2xl">{title}</h1></div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Club Manager</span>
        </div>
        <nav className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {links.map((l) => {
            const active = pathname === l.href || (l.href === '/standings/singles' && pathname.startsWith('/standings'));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-xl px-3 py-2 text-center text-sm font-semibold transition ${
                  active
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="space-y-5 pb-2">{children}</main>
    </div>
  );
}
