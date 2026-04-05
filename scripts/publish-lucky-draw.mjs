// Publish lucky draw winners to Firestore event_winners collection.
//
// Usage:
//   node scripts/publish-lucky-draw.mjs <event-slug>
//   node scripts/publish-lucky-draw.mjs ramadhan-quiz-2026
//
// Winners are configured in content/lucky-draw-winners.json.
// Format: { "<event-slug>": ["submissionId1", "submissionId2", ...] }
// Order matters — first entry = rank 1, second = rank 2, etc.
// Remaining participants are ranked by score (desc), then timestamp (asc).

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

// --- Load .env ---
const envContent = readFileSync('.env', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
        envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
    }
});

const app = initializeApp({
    credential: cert({
        projectId: envVars.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: envVars.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: envVars.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
});
const db = getFirestore(app);

// --- Parse args ---
const slug = process.argv[2];
if (!slug) {
    console.error('Usage: node scripts/publish-lucky-draw.mjs <event-slug>');
    process.exit(1);
}

// --- Load winners config ---
const config = JSON.parse(readFileSync('content/lucky-draw-winners.json', 'utf-8'));
const winnerIds = config[slug];
if (!winnerIds || winnerIds.length === 0) {
    console.error(`No lucky draw winners configured for "${slug}" in content/lucky-draw-winners.json`);
    process.exit(1);
}

async function publish() {
    // 1. Fetch all submissions for this event
    const snapshot = await db.collection('quiz_submissions')
        .where('slug', '==', slug)
        .get();

    const allSubmissions = new Map();
    snapshot.docs.forEach(doc => {
        allSubmissions.set(doc.id, { id: doc.id, ...doc.data() });
    });

    console.log(`Found ${allSubmissions.size} total submissions for "${slug}"`);

    // 2. Build lucky draw winners (rank by array order)
    const winners = [];
    for (let i = 0; i < winnerIds.length; i++) {
        const id = winnerIds[i];
        const sub = allSubmissions.get(id);
        if (!sub) {
            console.error(`Submission "${id}" not found — aborting.`);
            process.exit(1);
        }
        winners.push({
            rank: i + 1,
            submissionId: id,
            userDetails: sub.userDetails,
            score: sub.score ?? 0,
            totalPoints: sub.totalPoints ?? 0,
        });
        allSubmissions.delete(id);
    }

    // 3. Rank remaining participants by score (desc), then timestamp (asc)
    const remaining = [...allSubmissions.values()].sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });

    const startRank = winners.length + 1;
    for (let i = 0; i < remaining.length; i++) {
        const p = remaining[i];
        let rank = startRank + i;

        // Same score as previous → same rank (standard competition ranking)
        if (i > 0 && p.score === remaining[i - 1].score) {
            rank = winners[winners.length - 1].rank;
        }

        winners.push({
            rank,
            submissionId: p.id,
            userDetails: p.userDetails,
            score: p.score ?? 0,
            totalPoints: p.totalPoints ?? 0,
        });
    }

    // 4. Save to Firestore
    await db.collection('event_winners').doc(slug).set({
        slug,
        winners,
        lockedAt: new Date().toISOString(),
        lockedBy: 'lucky-draw-script',
    });

    console.log(`\nPublished ${winnerIds.length} lucky draw winners + ${remaining.length} ranked participants for "${slug}":`);
    winners.slice(0, winnerIds.length).forEach(w => {
        console.log(`  #${w.rank} — ${w.userDetails?.name || 'Unknown'} (${w.submissionId}) — Score: ${w.score}/${w.totalPoints}`);
    });

    process.exit(0);
}

publish().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
