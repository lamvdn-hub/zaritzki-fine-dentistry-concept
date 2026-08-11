import { OPEN_FACTS } from '../lib/openFacts';

const rows: string[] = [];

for (const [name, fact] of Object.entries(OPEN_FACTS)) {
  if (!fact.known) {
    rows.push(`${'both'.padEnd(16)} ${name.padEnd(18)} ${fact.note}`);
  }
}

console.log(`\n${rows.length} facts awaiting the practice:\n`);
for (const r of rows) console.log(`  ${r}`);
console.log('\nNone of these may be filled in with a plausible guess.');
console.log('Prices are NOT on this list: the practice publishes none, by design (GOZ).\n');
process.exit(0);
