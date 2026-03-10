'use client';

import { FormEvent, useMemo, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { SectionTitle } from '@/components/Cards';
import { Stage, TournamentType } from '@/lib/types';
import { useAppState } from '@/state/AppStateContext';

export default function ResultsEntryPage() {
  const { state, submitResult } = useAppState();
  const [mode, setMode] = useState<TournamentType>('SINGLES');

  const entries = useMemo(() => mode === 'SINGLES' ? state.players.map((p) => ({ id: p.id, name: p.name })) : state.teams.map((t) => ({ id: t.id, name: t.name })), [mode, state.players, state.teams]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    submitResult({
      tournamentId: mode === 'SINGLES' ? 'singles' : 'doubles',
      stage: form.get('stage') as Stage,
      group: (form.get('group') as 'A'|'B') || undefined,
      side1Id: form.get('s1') as string,
      side2Id: form.get('s2') as string,
      score1: Number(form.get('sc1')),
      score2: Number(form.get('sc2')),
      notes: form.get('notes') as string
    });
    e.currentTarget.reset();
  };

  return (
    <AppShell title="Enter Match Result">
      <div className="card p-4">
        <div className="grid grid-cols-2 gap-2">
          <button className={`rounded-xl p-2 font-semibold ${mode==='SINGLES'?'bg-brand-500 text-white':'bg-slate-100'}`} onClick={()=>setMode('SINGLES')}>Singles</button>
          <button className={`rounded-xl p-2 font-semibold ${mode==='DOUBLES'?'bg-brand-500 text-white':'bg-slate-100'}`} onClick={()=>setMode('DOUBLES')}>Doubles</button>
        </div>

        <form onSubmit={onSubmit} className="mt-3 space-y-2">
          <select className="input" name="stage" defaultValue="GROUP"><option>GROUP</option><option>SEMI</option><option>FINAL</option></select>
          {mode === 'DOUBLES' && <select className="input" name="group" defaultValue="A"><option value="A">Group A</option><option value="B">Group B</option></select>}
          <div className="grid grid-cols-2 gap-2">
            <select className="input" name="s1">{entries.map((e)=><option key={e.id} value={e.id}>{e.name}</option>)}</select>
            <select className="input" name="s2">{entries.map((e)=><option key={e.id} value={e.id}>{e.name}</option>)}</select>
          </div>
          <div className="grid grid-cols-2 gap-2"><input className="input" name="sc1" type="number" min={0} required placeholder="Frames" /><input className="input" name="sc2" type="number" min={0} required placeholder="Frames" /></div>
          <textarea className="input" name="notes" placeholder="Match notes (optional)" />
          <button className="btn-primary w-full" type="submit">Submit Result</button>
        </form>
      </div>

      <SectionTitle title="Recent Results" />
      {[...state.matches].reverse().slice(0,5).map((m)=><div key={m.id} className="card p-3"><p className="font-semibold">{m.side1Id} {m.result?.score1 ?? '-'} - {m.result?.score2 ?? '-'} {m.side2Id}</p><p className="text-sm text-slate-500">{m.stage} {m.group ? `• Group ${m.group}` : ''}</p></div>)}
    </AppShell>
  );
}
