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

// Load quiz questions from JSON
const quiz = JSON.parse(readFileSync("content/events/zulhijjah-quiz-2026.json", "utf-8"));
const questions = quiz.content.questions;

function recalculate(answers) {
  let score = 0;
  for (const q of questions) {
    const userAnswer = answers?.[q.id];
    if (!userAnswer) continue;
    if (q.type === "mcq") {
      const correctTexts = q.correctAnswer.map((i) => q.options[i]);
      if (correctTexts.includes(userAnswer)) score += q.points;
    } else if (q.type === "boolean") {
      if (String(q.correctAnswer) === userAnswer) score += q.points;
    } else if (q.type === "text") {
      if (userAnswer.trim().length > 0) score += q.points;
    }
  }
  return score;
}

const snapshot = await db.collection("quiz_submissions").where("slug", "==", SLUG).get();

if (snapshot.empty) {
  console.log("No submissions found.");
  process.exit(0);
}

const rows = snapshot.docs.map((doc) => {
  const data = doc.data();
  const name = data.userDetails?.name || "N/A";
  const stored = data.score ?? 0;
  const calculated = recalculate(data.answers);
  return { name, calculated, stored, matches: calculated === stored };
});

const nameW = 32;
const sep = "-".repeat(nameW + 32);

// Table 1 — all submissions
console.log(`\nAll submissions for "${SLUG}" (${rows.length} total)\n`);
console.log(`${"Name".padEnd(nameW)} | ${"Calculated".padEnd(12)} | Stored`);
console.log(sep);
for (const r of rows) {
  const flag = r.matches ? "" : " ⚠";
  console.log(`${r.name.padEnd(nameW)} | ${String(r.calculated).padEnd(12)} | ${r.stored}${flag}`);
}

// Table 2 — mismatches only
const mismatches = rows.filter((r) => !r.matches);
console.log(`\n\nMismatches (${mismatches.length})\n`);
if (mismatches.length === 0) {
  console.log("All scores match.");
} else {
  console.log(`${"Name".padEnd(nameW)} | ${"Calculated".padEnd(12)} | Stored`);
  console.log(sep);
  for (const r of mismatches) {
    console.log(`${r.name.padEnd(nameW)} | ${String(r.calculated).padEnd(12)} | ${r.stored}`);
  }
}

process.exit(0);
