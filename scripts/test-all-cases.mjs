import fs from 'fs';

const testCases = [
  {
    name: 'Case 1: Full-Stack Engineer',
    cvFile: 'test-cases/case1-fullstack-cv.txt',
    jdFile: 'test-cases/case1-job-description.txt',
  },
  {
    name: 'Case 2: AI / ML Engineer',
    cvFile: 'test-cases/case2-ai-engineer-cv.txt',
    jdFile: 'test-cases/case2-job-description.txt',
  },
  {
    name: 'Case 3: Product Manager',
    cvFile: 'test-cases/case3-product-manager-cv.txt',
    jdFile: 'test-cases/case3-job-description.txt',
  },
];

for (const tc of testCases) {
  const cv = fs.readFileSync(tc.cvFile, 'utf8');
  const jd = fs.readFileSync(tc.jdFile, 'utf8');

  const res = await fetch('http://localhost:3000/api/tailor-resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cvText: cv, jobDescription: jd }),
  });

  const data = await res.json();
  console.log(`\n=== ${tc.name} ===`);
  console.log(`Status: ${res.status}`);
  console.log(`Candidate: ${data.data.tailoredResume.contact.fullName}`);
  console.log(`Target Role: ${data.data.tailoredResume.targetRole}`);
  console.log(`Match Score: ${data.data.skillGap.matchScore}%`);
  console.log(`Matched Skills (${data.data.skillGap.matchedSkills.length}): ${data.data.skillGap.matchedSkills.slice(0, 5).join(', ')}...`);
  console.log(`Missing Skills (${data.data.skillGap.missingSkills.length}): ${data.data.skillGap.missingSkills.join(', ')}`);
}
