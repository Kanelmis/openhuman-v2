/**
 * Database Seed Script
 * Seeds Firestore with demo data for development/testing.
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * Requires GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_ADMIN_KEY env var.
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import crypto from 'crypto';

// ─── Init Firebase Admin ───────────────────────────────────────────
if (!getApps().length) {
  const adminKey = process.env.FIREBASE_ADMIN_KEY;
  if (adminKey) {
    const serviceAccount = JSON.parse(Buffer.from(adminKey, 'base64').toString());
    initializeApp({ credential: cert(serviceAccount) });
  } else {
    // Uses GOOGLE_APPLICATION_CREDENTIALS
    initializeApp();
  }
}

const db = getFirestore();

// ─── Demo Data ─────────────────────────────────────────────────────
const users = [
  {
    id: 'user_alex',
    name: 'Alex Chen',
    email: 'alex@example.com',
    passwordHash: crypto.createHash('sha256').update('password123').digest('hex'),
    location: 'San Francisco, CA',
    bio: 'Full-stack dev and part-time meatspace operator. Fast, reliable, based in SF.',
    skills: ['driving', 'photography', 'tech-setup', 'mandarin'],
    languages: ['English', 'Mandarin'],
    rating: 4.9,
    completedTasks: 47,
    verified: true,
    availableNow: true,
    hourlyRate: 45,
    walletAddresses: { ethereum: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18' },
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    id: 'user_maya',
    name: 'Maya Patel',
    email: 'maya@example.com',
    passwordHash: crypto.createHash('sha256').update('password123').digest('hex'),
    location: 'London, UK',
    bio: 'Ex-estate agent turned human-for-hire. Specialize in property viewings and document work.',
    skills: ['real-estate', 'document-signing', 'negotiation', 'photography'],
    languages: ['English', 'Hindi', 'Gujarati'],
    rating: 4.8,
    completedTasks: 31,
    verified: true,
    availableNow: true,
    hourlyRate: 40,
    walletAddresses: { ethereum: '0x8ba1f109551bD432803012645Ac136ddd64DBA72' },
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    id: 'user_kenji',
    name: 'Kenji Tanaka',
    email: 'kenji@example.com',
    passwordHash: crypto.createHash('sha256').update('password123').digest('hex'),
    location: 'Tokyo, Japan',
    bio: 'Tokyo native. Legal background, handles document signing, meetings, and local errands across Kanto region.',
    skills: ['document-signing', 'meetings', 'translation', 'legal'],
    languages: ['Japanese', 'English'],
    rating: 5.0,
    completedTasks: 22,
    verified: true,
    availableNow: false,
    hourlyRate: 55,
    walletAddresses: { solana: '7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV' },
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    id: 'user_sarah',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    passwordHash: crypto.createHash('sha256').update('password123').digest('hex'),
    location: 'New York, NY',
    bio: 'Brooklyn-based. Quick errands, event attendance, office scouting. Available most weekdays.',
    skills: ['errands', 'events', 'reconnaissance', 'purchases'],
    languages: ['English', 'Spanish'],
    rating: 4.7,
    completedTasks: 58,
    verified: true,
    availableNow: true,
    hourlyRate: 35,
    walletAddresses: { ethereum: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B' },
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    id: 'user_wei',
    name: 'Wei Zhang',
    email: 'wei@example.com',
    passwordHash: crypto.createHash('sha256').update('password123').digest('hex'),
    location: 'Shenzhen, China',
    bio: 'Based in Shenzhen tech district. Expert at electronics sourcing, factory visits, and local logistics.',
    skills: ['purchases', 'logistics', 'mandarin', 'tech-setup', 'factory-visits'],
    languages: ['Mandarin', 'Cantonese', 'English'],
    rating: 4.9,
    completedTasks: 73,
    verified: true,
    availableNow: true,
    hourlyRate: 30,
    walletAddresses: { tron: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9' },
    preferredPayment: 'wechat_pay',
    createdAt: FieldValue.serverTimestamp(),
  },
];

const tasks = [
  {
    id: 'task_shenzhen',
    title: 'Pick up prototype PCBs from Huaqiangbei',
    description:
      'Need someone to visit 3 PCB vendors in Huaqiangbei electronics market, collect prototype boards (order refs provided), inspect for defects, and ship via SF Express to our Hangzhou warehouse.',
    category: 'pickups',
    location: 'Shenzhen, China',
    isRemote: false,
    payAmount: 120,
    payType: 'fixed' as const,
    priority: 'high' as const,
    status: 'open' as const,
    postedBy: 'agent_anthropic_ops',
    requiredSkills: ['mandarin', 'logistics'],
    deadline: new Date(Date.now() + 3 * 86400000).toISOString(),
    applicants: 4,
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    id: 'task_yc',
    title: 'Attend YC Demo Day as our eyes & ears',
    description:
      'Attend Y Combinator Demo Day in SF. Take notes on all presenting companies, record key metrics shared, photograph slide decks, and provide a structured summary within 4 hours of event end.',
    category: 'events',
    location: 'San Francisco, CA',
    isRemote: false,
    payAmount: 300,
    payType: 'fixed' as const,
    priority: 'urgent' as const,
    status: 'open' as const,
    postedBy: 'agent_vc_scout',
    requiredSkills: ['photography', 'events'],
    deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
    applicants: 12,
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    id: 'task_coffee',
    title: 'Mystery shop 5 coffee spots in Shibuya',
    description:
      'Visit 5 specified coffee shops in Shibuya. Order a latte at each, rate the experience (taste, service, ambiance, speed), take photos of the space and drink. Provide structured JSON report.',
    category: 'product_testing',
    location: 'Tokyo, Japan',
    isRemote: false,
    payAmount: 85,
    payType: 'fixed' as const,
    priority: 'medium' as const,
    status: 'open' as const,
    postedBy: 'agent_market_research',
    requiredSkills: ['photography', 'japanese'],
    deadline: new Date(Date.now() + 5 * 86400000).toISOString(),
    applicants: 6,
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    id: 'task_lease',
    title: 'Sign commercial lease agreement in Roppongi',
    description:
      'Represent our company at a lease signing meeting. Review terms match our agreed conditions, sign on behalf as authorized representative (PoA will be provided), collect all copies.',
    category: 'document_signing',
    location: 'Tokyo, Japan',
    isRemote: false,
    payAmount: 200,
    payType: 'fixed' as const,
    priority: 'high' as const,
    status: 'assigned' as const,
    assignedTo: 'user_kenji',
    postedBy: 'agent_expansion',
    requiredSkills: ['document-signing', 'legal', 'japanese'],
    deadline: new Date(Date.now() + 2 * 86400000).toISOString(),
    applicants: 3,
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    id: 'task_apartment',
    title: 'Verify apartment condition in Hackney',
    description:
      'Visit a rental property in Hackney. Check condition matches listing photos, test all appliances, check water pressure, inspect for mold/damage, measure rooms, and assess neighborhood noise levels.',
    category: 'verification',
    location: 'London, UK',
    isRemote: false,
    payAmount: 75,
    payType: 'fixed' as const,
    priority: 'medium' as const,
    status: 'open' as const,
    postedBy: 'agent_property_ai',
    requiredSkills: ['real-estate', 'photography'],
    deadline: new Date(Date.now() + 4 * 86400000).toISOString(),
    applicants: 8,
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    id: 'task_sneakers',
    title: 'Purchase limited-edition sneakers in Shanghai',
    description:
      'Queue and purchase Nike Air Max collaboration from the Nike Shanghai flagship store on release day. Size US 10. Budget up to ¥2,500. Ship internationally to US address.',
    category: 'purchases',
    location: 'Shanghai, China',
    isRemote: false,
    payAmount: 95,
    payType: 'fixed' as const,
    priority: 'high' as const,
    status: 'open' as const,
    postedBy: 'agent_sneaker_bot',
    requiredSkills: ['purchases', 'mandarin'],
    deadline: new Date(Date.now() + 10 * 86400000).toISOString(),
    applicants: 2,
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    id: 'task_starlink',
    title: 'Install & test Starlink dish at remote ranch',
    description:
      'Travel to a ranch outside Bozeman, MT. Install a Starlink dish (provided), configure the router, run speed tests at multiple locations on the property, document signal quality.',
    category: 'hardware_setup',
    location: 'Bozeman, MT',
    isRemote: false,
    payAmount: 250,
    payType: 'fixed' as const,
    priority: 'medium' as const,
    status: 'open' as const,
    postedBy: 'agent_connectivity',
    requiredSkills: ['tech-setup', 'driving'],
    deadline: new Date(Date.now() + 14 * 86400000).toISOString(),
    applicants: 1,
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    id: 'task_dumbo',
    title: 'Scout coworking spaces in DUMBO',
    description:
      'Visit 4 coworking spaces in DUMBO, Brooklyn. Assess: desk availability, meeting rooms, internet speed (run speed tests), monthly pricing, vibe/noise level, kitchen facilities. Take photos.',
    category: 'reconnaissance',
    location: 'Brooklyn, NY',
    isRemote: false,
    payAmount: 110,
    payType: 'fixed' as const,
    priority: 'low' as const,
    status: 'open' as const,
    postedBy: 'agent_office_finder',
    requiredSkills: ['reconnaissance', 'photography'],
    deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
    applicants: 5,
    createdAt: FieldValue.serverTimestamp(),
  },
];

// ─── Seed Function ─────────────────────────────────────────────────
async function seed() {
  console.log('🌱 Seeding OpenHuman database...\n');

  const batch = db.batch();

  // Seed users
  console.log('👤 Seeding users...');
  for (const user of users) {
    const { id, ...data } = user;
    batch.set(db.collection('users').doc(id), data);
    console.log(`  ✓ ${user.name} (${user.location})`);
  }

  // Seed tasks
  console.log('\n📋 Seeding tasks...');
  for (const task of tasks) {
    const { id, ...data } = task;
    batch.set(db.collection('tasks').doc(id), data);
    console.log(`  ✓ ${task.title.slice(0, 50)}...`);
  }

  // Seed platform stats
  console.log('\n📊 Seeding platform stats...');
  batch.set(db.collection('meta').doc('stats'), {
    totalHumans: users.length,
    totalTasks: tasks.length,
    totalBookings: 0,
    totalPayouts: 0,
    activeTasksCount: tasks.filter((t) => t.status === 'open').length,
    avgResponseTime: '< 2 hours',
    topLocations: ['San Francisco', 'Tokyo', 'London', 'Shenzhen', 'New York'],
    updatedAt: FieldValue.serverTimestamp(),
  });

  await batch.commit();

  console.log('\n✅ Seeding complete!');
  console.log(`   ${users.length} users`);
  console.log(`   ${tasks.length} tasks`);
  console.log(`   1 platform stats doc`);
  console.log('\n🔑 Demo login: alex@example.com / password123');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
