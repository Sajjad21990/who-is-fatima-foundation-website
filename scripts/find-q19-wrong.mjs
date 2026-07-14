import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";

const envContent = readFileSync(".env", "utf-8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const [key, ...valueParts] = line.split("=");
  if (key && valueParts.length) {
    envVars[key.trim()] = valueParts
      .join("=")
      .trim()
      .replace(/^["']|["']$/g, "");
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
const TARGET_ANSWER = "9 Zulhijjah ko hui";
// Submissions before commit 1a0b268 (2026-05-19 12:35:03 +0530 = UTC 07:05:03)
const BEFORE_DATE = new Date("2026-05-19T07:05:03Z");

const snapshot = await db
  .collection("quiz_submissions")
  .where("slug", "==", SLUG)
  .get();

if (snapshot.empty) {
  console.log("No submissions found.");
  process.exit(0);
}

const matches = snapshot.docs
  .map((doc) => doc.data())
  .filter((data) => {
    if (data.answers?.q19 !== TARGET_ANSWER) return false;
    const submitted = data.timestamp ? new Date(data.timestamp) : null;
    return submitted && submitted < BEFORE_DATE;
  });

console.log(`Submissions for "${SLUG}" where Q19 = "${TARGET_ANSWER}" AND submitted before ${BEFORE_DATE.toISOString()}:`);
console.log(`Found ${matches.length} of ${snapshot.size} total\n`);
console.log(
  "UID                          | Name                          | Score",
);
console.log("-".repeat(75));

for (const data of matches) {
  const uid = (data.uid || data.userId || "N/A").padEnd(28);
  const name = (data.userDetails?.name || "N/A").padEnd(30);
  const score = data.score ?? "N/A";
  console.log(`${uid} | ${name} | ${score}`);
}

process.exit(0);
