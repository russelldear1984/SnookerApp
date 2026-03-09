'use client';

import { FormEvent, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { SectionTitle } from '@/components/Cards';
import { useAppState } from '@/state/AppStateContext';

export default function MembersPage() {
  const { state, addPlayer, deletePlayer, addTeam } = useAppState();
  const [name, setName] = useState('');

  const submitPlayer = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addPlayer(name.trim());
    setName('');
  };

  const submitTeam = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const p1 = form.get('p1') as string;
    const p2 = form.get('p2') as string;
    if (p1 === p2) return;
    addTeam((form.get('name') as string) || 'New Team', p1, p2, form.get('group') as 'A'|'B');
    e.currentTarget.reset();
  };

  return (
    <AppShell title="Club Manager">
      <SectionTitle title="Individual Players" right={<span className="rounded-full bg-green-100 px-3 py-1 text-brand-700">{state.players.length} Registered</span>} />
      {state.players.map((p)=> <div key={p.id} className="card flex items-center justify-between p-4"><div><p className="text-2xl font-semibold">{p.name}</p><p className="text-slate-500">Wins: {p.wins} | Losses: {p.losses}</p></div><button onClick={()=>deletePlayer(p.id)} className="rounded bg-red-50 px-3 py-2 text-red-600">Delete</button></div>)}

      <form onSubmit={submitPlayer} className="card p-4"><SectionTitle title="Add New Player" /><div className="mt-2 flex gap-2"><input className="input" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Player name" /><button className="btn-primary" type="submit">Add</button></div></form>

      <form onSubmit={submitTeam} className="card p-4">
        <SectionTitle title="Quick Create Doubles Team" />
        <div className="mt-2 space-y-2">
          <input className="input" name="name" placeholder="Team name" />
          <div className="grid grid-cols-2 gap-2">
            <select className="input" name="p1">{state.players.map((p)=><option key={p.id} value={p.id}>{p.name}</option>)}</select>
            <select className="input" name="p2">{state.players.map((p)=><option key={p.id} value={p.id}>{p.name}</option>)}</select>
          </div>
          <select className="input" name="group"><option value="A">Group A</option><option value="B">Group B</option></select>
          <button type="submit" className="btn-primary w-full">Create Team</button>
        </div>
      </form>

      <SectionTitle title="Doubles Teams" />
      {state.teams.map((t)=> <div key={t.id} className="card p-4"><p className="text-2xl font-semibold text-brand-700">{t.name}</p><p className="text-slate-500">Group {t.group}</p></div>)}
    </AppShell>
  );
}
