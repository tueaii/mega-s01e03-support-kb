// Where each problem in a split ticket is tracked, and how it ended. causes.ts says which problem a
// report belongs to; this file only says where that problem lives now.
import type { Cause } from '#lib/kb/causes';

export const ISSUE_REPO = 'https://github.com/tueaii/mega-s01e03-support-kb';

export const TRACKED: Record<Cause, { issue: number; what: string; outcome: string; how: string }> = {
  parser: {
    issue: 1,
    what: 'the shared parser reads the date month first',
    outcome: 'fixed',
    how: 'fix(dates): parse dd/mm for eu locales',
  },
  hint: {
    issue: 2,
    what: 'booking-v3 prints MM/DD/YYYY, then reads the date day first',
    outcome: "won't fix",
    how: 'booking-v3 form retired',
  },
};
