import { PRACTICES, PRACTICE_ORDER } from '../lib/locations';
import { isKnown } from '../lib/pending';

const rows: string[] = [];

for (const id of PRACTICE_ORDER) {
  const p = PRACTICES[id];
  if (!isKnown(p.bookingUrl)) {
    rows.push(`${p.shortName.padEnd(16)} bookingUrl        ${p.bookingUrl.note}`);
  }
}

// Facts held outside the practice data, tracked here so one command lists everything.
rows.push('both             clinicians         Names and credentials beyond Dr. Zaritzki not supplied');
rows.push('both             sharedTeam         Whether both addresses share clinicians is unknown');
rows.push('both             selfPayWording     Estimate wording awaiting practice confirmation');
rows.push('both             photography        All 12 images are licensed stock awaiting approval or replacement');

console.log(`\n${rows.length} facts awaiting the practice:\n`);
for (const r of rows) console.log(`  ${r}`);
console.log('\nNone of these may be filled in with a plausible guess.');
console.log('Prices are NOT on this list: the practice publishes none, by design (GOZ).\n');
process.exit(0);
