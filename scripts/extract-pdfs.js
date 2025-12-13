const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const journalsDir = path.join(__dirname, '../docs/journals');
const blogDir = path.join(__dirname, '../src/content/blog');

// Ensure blog directory exists
if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
}

function parseDate(filename) {
    // Expected format: FridayJournal-Aug-08-2025.pdf
    const match = filename.match(/FridayJournal-([A-Za-z]{3})-(\d{2})-(\d{4})\.pdf/);
    if (!match) return new Date().toISOString().split('T')[0];

    const [_, monthStr, day, year] = match;
    const monthMap = {
        'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
        'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    const month = monthMap[monthStr] || '01';
    return `${year}-${month}-${day}`;
}

async function processPdfs() {
    try {
        const files = fs.readdirSync(journalsDir).filter(file => file.endsWith('.pdf'));

        console.log(`Found ${files.length} PDF files.`);

        for (const file of files) {
            const filePath = path.join(journalsDir, file);
            const dataBuffer = fs.readFileSync(filePath);

            try {
                const data = await pdf(dataBuffer);
                const text = data.text;

                const date = parseDate(file);
                const slug = file.replace('.pdf', '').toLowerCase();
                const title = `Friday Journal - ${file.replace('FridayJournal-', '').replace('.pdf', '').replace(/-/g, ' ')}`;

                const mdxContent = `---
title: "${title}"
description: "Weekly update from Who is Fatima Foundation."
date: ${date}
tags: ["Journal", "Weekly Update"]
img: "https://images.unsplash.com/photo-1455849318743-b2233052fcff?q=80&w=1080&auto=format&fit=crop"
author: Who is Fatima Team
published: true
---

${text}
`;

                const outputPath = path.join(blogDir, `${slug}.mdx`);
                fs.writeFileSync(outputPath, mdxContent);
                console.log(`Converted ${file} to ${slug}.mdx`);

            } catch (err) {
                console.error(`Error processing ${file}:`, err);
            }
        }

        console.log('All PDFs processed successfully.');

    } catch (err) {
        console.error('Error reading directory:', err);
    }
}

processPdfs();
