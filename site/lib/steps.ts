/**
 * The five steps of the walk. The rail's layout assumes exactly five; adding a
 * sixth is a design change, not a data change.
 */
export const STEPS = [
  { id: 'street', anchor: 'step-street', labelKey: 'steps.street', number: '01' },
  { id: 'lounge', anchor: 'step-lounge', labelKey: 'steps.lounge', number: '02' },
  { id: 'talk', anchor: 'step-talk', labelKey: 'steps.talk', number: '03' },
  { id: 'room', anchor: 'step-room', labelKey: 'steps.room', number: '04' },
  { id: 'leaving', anchor: 'step-leaving', labelKey: 'steps.leaving', number: '05' },
] as const;

export type Step = (typeof STEPS)[number];
