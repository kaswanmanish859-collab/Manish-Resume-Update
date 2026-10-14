import fs from 'fs';
import { tailorResumeWithGemini, intelligentFallbackTailor } from '../src/lib/gemini';

const cv = fs.readFileSync('test-cases/case1-fullstack-cv.txt', 'utf8');
const jd = fs.readFileSync('test-cases/case1-job-description.txt', 'utf8');

try {
  const res = intelligentFallbackTailor(cv, jd);
  console.log('Result source:', res.sourceType);
  console.log('Role:', res.tailoredResume.targetRole);
  console.log('Match Score:', res.skillGap.matchScore);
} catch (e) {
  console.error('Error in intelligentFallbackTailor:', e);
}
