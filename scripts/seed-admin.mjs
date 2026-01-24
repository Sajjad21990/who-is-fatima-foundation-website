// Temporary script to seed the first admin user
// Run with: node scripts/seed-admin.mjs

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

async function seedAdmin() {
    const uid = 'ZRIFlDUDZ6PSYAlvn4fzuuyG3dh1';
    const email = 'sajjadhaider21990@gmail.com';

    try {
        await db.collection('users').doc(uid).set({
            uid,
            email,
            displayName: 'Sajjad Haider',
            role: 'admin',
            createdAt: new Date().toISOString()
        });

        console.log('✅ Admin user created successfully!');
        console.log(`   Email: ${email}`);
        console.log(`   UID: ${uid}`);
        console.log(`   Role: admin`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
}

seedAdmin();
