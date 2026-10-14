import fs from 'fs';

console.log('=== TESTING LINKEDIN VERIFICATION & RESUME SYNC ===\n');

// 1. Verify Known Profile: Alex Rivera
const verifyAlexRes = await fetch('http://localhost:3000/api/verify-linkedin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ linkedinUrl: 'https://www.linkedin.com/in/alex-rivera-dev' }),
});

const alexData = await verifyAlexRes.json();
console.log('1. Alex Rivera LinkedIn Verification:');
console.log('   Status:', verifyAlexRes.status, 'Success:', alexData.success);
console.log('   Full Name:', alexData.profile.fullName);
console.log('   Headline:', alexData.profile.headline);
console.log('   Verified Badge:', alexData.profile.isVerified ? '✓ Verified' : 'No');
console.log('   Skills Count:', alexData.profile.skills.length);
console.log('   Certifications Count:', alexData.profile.certifications.length);
alexData.profile.certifications.forEach((c) => {
  console.log(`     - [${c.issuer}] ${c.name} (ID: ${c.credentialId || 'N/A'})`);
});

// 2. Verify Custom Profile URL
const verifyCustomRes = await fetch('http://localhost:3000/api/verify-linkedin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ linkedinUrl: 'https://linkedin.com/in/jordan-taylor-cloud' }),
});
const customData = await verifyCustomRes.json();
console.log('\n2. Custom Profile Verification:');
console.log('   Full Name:', customData.profile.fullName);
console.log('   Verified Badge:', customData.profile.isVerified ? '✓ Verified' : 'No');
console.log('   Certifications Count:', customData.profile.certifications.length);

// 3. Test Tailoring with Verified LinkedIn Data Attached
const cv = fs.readFileSync('test-cases/case1-fullstack-cv.txt', 'utf8');
const jd = fs.readFileSync('test-cases/case1-job-description.txt', 'utf8');

const tailorWithLinkedInRes = await fetch('http://localhost:3000/api/tailor-resume', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cvText: cv,
    jobDescription: jd,
    linkedInProfile: alexData.profile,
  }),
});

const tailorData = await tailorWithLinkedInRes.json();
console.log('\n3. Tailor Resume with LinkedIn Sync:');
console.log('   Status:', tailorWithLinkedInRes.status, 'Success:', tailorData.success);
console.log('   Candidate:', tailorData.data.tailoredResume.contact.fullName);
console.log('   LinkedIn URL in Contact:', tailorData.data.tailoredResume.contact.linkedin);
console.log('   Match Score:', tailorData.data.skillGap.matchScore + '%');
console.log('   Resume Certifications Count:', tailorData.data.tailoredResume.certifications?.length || 0);
tailorData.data.tailoredResume.certifications?.forEach((c) => {
  console.log(`     - ${c.name} by ${c.issuer} (LinkedIn Verified: ${c.isLinkedInVerified ? '✓' : 'No'})`);
});
console.log('   Strengths Highlight:', tailorData.data.skillGap.strengths[0]);
