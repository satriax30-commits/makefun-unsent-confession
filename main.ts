// Unsent: The Micro-Confession Sprint — a two-part micro-confession:
// a To: line naming who it was meant for, and the unsent message itself,
// one line written exactly as it was typed, with no explanation after it.
// Deterministic, standard library only: no randomness, no wall-clock time,
// no network, no environment secrets. Writes exactly the entry to entry.txt
// and nothing else (no trailing newline).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry. To: my ex — the plant left on her balcony and the warm kitchen
// light we picked together only make sense to her, so swapping the
// addressee breaks the message. The confession is still driving past her
// street to check the light: too late, and too afraid to knock.
const TO = "To: my ex, who still waters the plant I left on your balcony";
const MESSAGE =
  "I drove past your street last Sunday just to see if the light in the kitchen was still the warm one we picked together.";
const ENTRY = `${TO}\n${MESSAGE}`;

// Gate: the gate checks entry.txt is UTF-8 text of 1-260 characters, not
// only white space, and the message itself is one line of at most 200
// characters. Validate before writing so a bad entry fails loudly here
// instead of silently at grading time.
const entryChars = [...ENTRY];
if (entryChars.length < 1 || entryChars.length > 260) {
  console.error(`entry must be 1-260 characters, got ${entryChars.length}`);
  process.exit(1);
}
if (ENTRY.trim().length === 0) {
  console.error("entry must not be only white space");
  process.exit(1);
}
const messageChars = [...MESSAGE];
if (messageChars.length > 200) {
  console.error(`message must be at most 200 characters, got ${messageChars.length}`);
  process.exit(1);
}
if (MESSAGE.includes("\n") || MESSAGE.includes("\r")) {
  console.error("message must be exactly one line");
  process.exit(1);
}
const lines = ENTRY.split("\n");
if (lines.length !== 2 || !lines[0].startsWith("To: ")) {
  console.error("entry must be a To: line followed by exactly one message line");
  process.exit(1);
}

const outDir = process.argv[2] ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Self-check: read the file back and confirm it is byte-for-byte the entry
// we intended, so a partial write or encoding surprise fails here.
const back = readFileSync(outPath, "utf8");
if (back !== ENTRY) {
  console.error("read-back mismatch: entry.txt does not match the entry");
  process.exit(1);
}
console.log(
  `wrote ${entryChars.length} characters (${messageChars.length} in the message) to ${outPath}`,
);
