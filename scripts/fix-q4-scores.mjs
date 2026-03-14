import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

// Load environment variables manually from .env file
const envContent = readFileSync('.env', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
        envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
    }
});

const firebaseAdminConfig = {
    credential: cert({
        projectId: envVars.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: envVars.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: envVars.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
};

const app = initializeApp(firebaseAdminConfig);
const db = getFirestore(app);

// Q4 options:
// Index 0: "Roza Makrooh hojayega"
// Index 1: "Roza Baatil ho jayega"  ← OLD wrong correctAnswer
// Index 2: "Kaffarah dena padega"
// Index 3: "Roza baatil nahin hoga" ← NEW correct answer

const OLD_CORRECT = 'Roza Baatil ho jayega';      // was wrongly marked correct (index 1)
const NEW_CORRECT = 'Roza baatil nahin hoga';      // actual correct answer (index 3)

async function fixQ4Scores() {
    const SLUG = 'ramadhan-quiz-2026';
    console.log(`\nFixing q4 scores for: ${SLUG}`);
    console.log(`Old correct answer: "${OLD_CORRECT}" (index 1)`);
    console.log(`New correct answer: "${NEW_CORRECT}" (index 3)\n`);

    try {
        const snapshot = await db.collection('quiz_submissions')
            .where('slug', '==', SLUG)
            .get();

        if (snapshot.empty) {
            console.log('No submissions found.');
            process.exit(0);
        }

        console.log(`Found ${snapshot.size} submissions. Analyzing...\n`);

        let needsPlusOne = 0;   // answered NEW_CORRECT, was wrongly marked wrong
        let needsMinusOne = 0;  // answered OLD_CORRECT, was wrongly marked right
        let noChange = 0;       // answered something else, still wrong either way

        const batchSize = 500;
        let count = 0;
        let batches = [];
        let currentBatch = db.batch();

        for (const doc of snapshot.docs) {
            const data = doc.data();
            const q4Answer = data.answers?.q4;
            const currentScore = data.score || 0;
            let newScore = currentScore;

            if (q4Answer === NEW_CORRECT) {
                // User had the right answer but was marked wrong → +1
                newScore = currentScore + 1;
                needsPlusOne++;
                console.log(`  +1 | ${data.userDetails?.name} | ${currentScore} → ${newScore} | answered: "${q4Answer}"`);
            } else if (q4Answer === OLD_CORRECT) {
                // User had the wrong answer but was marked right → -1
                newScore = currentScore - 1;
                needsMinusOne++;
                console.log(`  -1 | ${data.userDetails?.name} | ${currentScore} → ${newScore} | answered: "${q4Answer}"`);
            } else {
                noChange++;
                continue; // skip update
            }

            currentBatch.update(doc.ref, { score: newScore });
            count++;

            if (count % batchSize === 0) {
                batches.push(currentBatch.commit());
                currentBatch = db.batch();
            }
        }

        if (count > 0 && count % batchSize !== 0) {
            batches.push(currentBatch.commit());
        }

        await Promise.all(batches);

        console.log(`\n--- Summary ---`);
        console.log(`Total submissions: ${snapshot.size}`);
        console.log(`Score +1 (had correct answer "${NEW_CORRECT}"): ${needsPlusOne}`);
        console.log(`Score -1 (had wrong answer "${OLD_CORRECT}"): ${needsMinusOne}`);
        console.log(`No change (other answers): ${noChange}`);
        console.log(`Total updated: ${count}`);
        console.log(`\nDone!`);
        process.exit(0);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixQ4Scores();
