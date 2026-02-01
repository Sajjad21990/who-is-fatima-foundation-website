
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

async function bumpScores() {
    const SLUG = 'imam-mahdi-quiz-jan-2026';
    console.log(`Starting score update for event: ${SLUG}`);

    try {
        const snapshot = await db.collection('quiz_submissions')
            .where('slug', '==', SLUG)
            .get();

        if (snapshot.empty) {
            console.log('No submissions found for this event.');
            process.exit(0);
        }

        console.log(`Found ${snapshot.size} submissions. Processing...`);

        const batchSize = 500;
        let count = 0;
        let batches = [];
        let currentBatch = db.batch();

        for (const doc of snapshot.docs) {
            const data = doc.data();
            const currentScore = data.score || 0;

            // Increment score by 1
            const newScore = currentScore + 1;

            currentBatch.update(doc.ref, { score: newScore });
            count++;

            if (count % batchSize === 0) {
                batches.push(currentBatch.commit());
                currentBatch = db.batch();
            }
        }

        if (count % batchSize !== 0) {
            batches.push(currentBatch.commit());
        }

        await Promise.all(batches);

        console.log(`✅ Successfully updated ${count} submissions.`);
        process.exit(0);

    } catch (error) {
        console.error('❌ Error updating scores:', error);
        process.exit(1);
    }
}

bumpScores();
