// The problems inside a merged ticket. causes.ts says which bug a report's tenant and channel point
// at; a report the desk read as a one-day move (desk-notes.json) is not a flip at all, so it gets its own.
import { causeOf, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = 'parser' | 'hint' | 'shift' | 'unplaced';

// Where each problem is tracked now that #4471 is split.
export const ISSUE_REPO = 'https://github.com/tueaii/mega-s01e03-support-kb';
export const ISSUE_OF: Record<Exclude<Problem, 'unplaced'>, number> = { parser: 1, hint: 2, shift: 3 };

export const WHAT: Record<Problem, string> = {
  parser: 'the shared parser reads the date month first',
  hint: 'booking-v3 prints MM/DD/YYYY, then reads the date day first',
  shift: 'the date moves one day earlier, by where the person is',
  unplaced: 'no tenant on file',
};

export function problemOf(r: Report, t: Tenant | undefined, oneDayMove: readonly string[]): Problem {
  if (oneDayMove.includes(r.id)) return 'shift';
  return causeOf(r, t) ?? 'unplaced';
}

export type ProblemGroup = { problem: Problem; reports: Report[]; tenants: number; firstSeen: string; lastSeen: string; misTagged: number };

export function groupByProblem(reports: Report[], tenantOf: (r: Report) => Tenant | undefined, oneDayMove: readonly string[]): ProblemGroup[] {
  const by = new Map<Problem, Report[]>();
  for (const r of reports) {
    const p = problemOf(r, tenantOf(r), oneDayMove);
    by.set(p, [...(by.get(p) ?? []), r]);
  }
  return [...by.entries()]
    .map(([problem, rs]) => {
      const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
      return {
        problem,
        reports: rs,
        tenants: new Set(rs.map((r) => r.tenant)).size,
        firstSeen: days[0],
        lastSeen: days[days.length - 1],
        // Intake only knows parser and hint; a shift report tagged either is still mis-tagged.
        misTagged: rs.filter((r) => r.meta.intakeTag !== problem).length,
      };
    })
    .sort((a, b) => b.reports.length - a.reports.length);
}
