'use client';

import { FormEvent } from 'react';
import { AppShell } from '@/components/AppShell';
import { SectionTitle } from '@/components/Cards';
import { Stage } from '@/lib/types';
import { useAppState } from '@/state/AppStateContext';

export default function ResultsEntryPage() {
  const { state, submitResult, entryOptions, getEntryName } = useAppState();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    submitResult({
      stage: form.get('stage') as Stage,
      group: (form.get('group') as string) || undefined,
      side1Id: form.get('s1') as string,
      side2Id: form.get('s2') as string,
      score1: Number(form.get('sc1')),
      score2: Number(form.get('sc2')),
      notes: form.get('notes') as string,
      knockoutMatchId: (form.get('knockoutMatch') as string) || undefined
    });
    e.currentTarget.reset();
  };

  return (
    <AppShell title="Results Entry">
      <div className="card p-5">
        <p className="mb-2 text-sm font-semibold text-slate-500">Active Tournament</p>
        <p className="text-2xl font-bold text-slate-900">{state.activeTournament.name}</p>
        <p className="text-slate-500">{state.activeTournament.type}</p>

        <form onSubmit={onSubmit} className="mt-3 space-y-3">
          <select className="input" name="stage" defaultValue="GROUP">
            <option value="GROUP">GROUP</option>
            <option value="SEMI">SEMI</option>
            <option value="FINAL">FINAL</option>
          </select>

          {state.activeTournament.groups.length > 1 && (
            <select className="input" name="group" defaultValue={state.activeTournament.groups[0]}>
              {state.activeTournament.groups.map((group) => <option key={group} value={group}>Group {group}</option>)}
            </select>
          )}

          <select className="input" name="knockoutMatch" defaultValue="">
            <option value="">Knockout match (optional)</option>
            {state.knockout.map((match) => <option key={match.id} value={match.id}>{match.round} - {match.id}</option>)}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <select className="input" name="s1" required>{entryOptions.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select>
            <select className="input" name="s2" required>{entryOptions.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input className="input" name="sc1" type="number" min={0} required placeholder="Frames" />
            <input className="input" name="sc2" type="number" min={0} required placeholder="Frames" />
          </div>
          <textarea className="input" name="notes" placeholder="Match notes (optional)" />
          <button className="btn-primary w-full" type="submit">Submit Result</button>
        </form>
      </div>

      <SectionTitle title="Recent Results" />
      {[...state.matches].reverse().slice(0, 5).map((match) => (
        <div key={match.id} className="card p-3">
          <p className="font-semibold">{getEntryName(match.side1Id)} {match.result?.score1 ?? '-'} - {match.result?.score2 ?? '-'} {getEntryName(match.side2Id)}</p>
          <p className="text-sm text-slate-500">{match.stage} {match.group ? `• Group ${match.group}` : ''}</p>
        </div>
      ))}
    </AppShell>
  );
}
