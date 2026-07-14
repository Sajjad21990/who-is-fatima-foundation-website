import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";

const envContent = readFileSync(".env", "utf-8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const [key, ...valueParts] = line.split("=");
  if (key && valueParts.length) {
    envVars[key.trim()] = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
  }
});

const app = initializeApp({
  credential: cert({
    projectId: envVars.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: envVars.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: envVars.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});
const db = getFirestore(app);

const SLUG = "zulhijjah-quiz-2026";
const CORRECT_ANSWER = "9 Zulhijjah ko hui";
// Submissions before commit 1a0b268 (2026-05-19 12:35:03 +0530 = UTC 07:05:03)
// At that point correctAnswer for q19 was [34] (invalid index), so nobody got points for it
const BEFORE_DATE = new Date("2026-05-19T07:05:03Z");

console.log(`\nFixing q19 scores for: ${SLUG}`);
console.log(`Affected users: submitted before ${BEFORE_DATE.toISOString()} AND answered "${CORRECT_ANSWER}"\n`);

const snapshot = await db.collection("quiz_submissions").where("slug", "==", SLUG).get();

if (snapshot.empty) {
  console.log("No submissions found.");
  process.exit(0);
}

console.log(`Total submissions: ${snapshot.size}. Scanning...\n`);

let toFix = [];

for (const doc of snapshot.docs) {
  const data = doc.data();
  const submitted = data.timestamp ? new Date(data.timestamp) : null;
  if (!submitted || submitted >= BEFORE_DATE) continue;
  if (data.answers?.q19 !== CORRECT_ANSWER) continue;
  toFix.push({ ref: doc.ref, data });
}

if (toFix.length === 0) {
  console.log("No affected submissions found. Nothing to update.");
  process.exit(0);
}

console.log(`Found ${toFix.length} affected submission(s):\n`);
console.log(`${"Name".padEnd(32)} | ${"Old Score".padEnd(10)} | New Score`);
console.log("-".repeat(60));
for (const { data } of toFix) {
  const name = (data.userDetails?.name || "N/A").padEnd(32);
  const old = String(data.score ?? 0).padEnd(10);
  console.log(`${name} | ${old} | ${(data.score ?? 0) + 1}`);
}

// Batch update
const batchSize = 500;
let count = 0;
const batches = [];
let currentBatch = db.batch();

for (const { ref, data } of toFix) {
  currentBatch.update(ref, { score: (data.score ?? 0) + 1 });
  count++;
  if (count % batchSize === 0) {
    batches.push(currentBatch.commit());
    currentBatch = db.batch();
  }
}
if (count % batchSize !== 0) batches.push(currentBatch.commit());

await Promise.all(batches);

console.log(`\n✅ Successfully bumped ${count} score(s) by +1.`);
process.exit(0);
