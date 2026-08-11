import { pending, type Pending } from './pending';

export type PhotographyDecision = 'approved' | 'replace';

type OpenFacts = {
  readonly clinicians: Pending<readonly string[]>;
  readonly sharedTeam: Pending<boolean>;
  readonly selfPayWording: Pending<string>;
  readonly photography: Pending<PhotographyDecision>;
};

/** Every unresolved practice fact, kept typed and enumerable in one registry. */
export const OPEN_FACTS: OpenFacts = {
  clinicians: pending('Names and credentials beyond Dr. Zaritzki not supplied'),
  sharedTeam: pending('Whether both addresses share clinicians is unknown'),
  selfPayWording: pending('Estimate wording awaiting practice confirmation'),
  photography: pending('All 12 images are licensed stock awaiting approval or replacement'),
};
