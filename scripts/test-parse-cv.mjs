import fs from 'fs';

// Test direct text submission to parse-cv endpoint
const formData = new FormData();
formData.append('text', 'Jane Doe\nSoftware Developer\nExperience: React, Next.js, Node.js\nEducation: BS CS');

const res = await fetch('http://localhost:3000/api/parse-cv', {
  method: 'POST',
  body: formData,
});

const data = await res.json();
console.log('Parse CV Status:', res.status);
console.log('Parse CV Success:', data.success);
console.log('Chars parsed:', data.charCount);
