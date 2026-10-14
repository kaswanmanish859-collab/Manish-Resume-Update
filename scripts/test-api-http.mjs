import fs from 'fs';

const cv = fs.readFileSync('test-cases/case1-fullstack-cv.txt', 'utf8');
const jd = fs.readFileSync('test-cases/case1-job-description.txt', 'utf8');

const res = await fetch('http://localhost:3000/api/tailor-resume', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cvText: cv,
    jobDescription: jd,
  }),
});

console.log('HTTP Status:', res.status);
const data = await res.json();
console.log('API Response success:', data.success);
if (data.success) {
  console.log('Tailored Role:', data.data.tailoredResume.targetRole);
  console.log('Score:', data.data.skillGap.matchScore);
} else {
  console.log('Error:', data.error);
}
