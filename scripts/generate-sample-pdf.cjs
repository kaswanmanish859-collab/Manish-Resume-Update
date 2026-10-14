const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'pt',
  format: 'letter'
});

const pageWidth = doc.internal.pageSize.getWidth(); // 612 pt
const margin = 40;
const contentWidth = pageWidth - margin * 2; // 532 pt
let y = 45;

function checkPage(needed) {
  if (y + needed > 750) {
    doc.addPage();
    y = 45;
  }
}

// 1. Name & Target Role
doc.setFont('helvetica', 'bold');
doc.setFontSize(22);
doc.setTextColor(17, 24, 39); // #111827
doc.text('ALEX RIVERA', margin, y);
y += 18;

doc.setFont('helvetica', 'bold');
doc.setFontSize(12);
doc.setTextColor(79, 70, 229); // #4F46E5 Indigo
doc.text('Senior Full-Stack Engineer (Next.js & Cloud)', margin, y);
y += 16;

// 2. Contact Line
doc.setFont('helvetica', 'normal');
doc.setFontSize(9);
doc.setTextColor(75, 85, 99); // #4B5563
const contactLine = 'San Francisco, CA  |  (555) 382-9104  |  alex.rivera@email.com  |  linkedin.com/in/alex-rivera-dev  |  github.com/arivera-code';
doc.text(contactLine, margin, y);
y += 12;

// Divider
doc.setDrawColor(229, 231, 235);
doc.setLineWidth(1);
doc.line(margin, y, margin + contentWidth, y);
y += 16;

function drawSectionHeader(title) {
  checkPage(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  doc.text(title.toUpperCase(), margin, y);
  y += 4;
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(1.5);
  doc.line(margin, y, margin + 45, y);
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.5);
  doc.line(margin + 45, y, margin + contentWidth, y);
  y += 14;
}

// 3. Professional Summary
drawSectionHeader('Professional Summary');
doc.setFont('helvetica', 'normal');
doc.setFontSize(9.5);
doc.setTextColor(55, 65, 81);
const summaryText = 'Senior Full-Stack Engineer with 4+ years of hands-on expertise architecting high-throughput web applications with Next.js (App Router), TypeScript, React, and Node.js. Proven track record optimizing web performance by 42%, scaling microservices handling 2.5M+ daily requests, and orchestrating AWS cloud deployments with automated CI/CD pipelines.';
const splitSummary = doc.splitTextToSize(summaryText, contentWidth);
doc.text(splitSummary, margin, y);
y += splitSummary.length * 12 + 8;

// 4. Technical Skills
drawSectionHeader('Technical Skills');
const skillCategories = [
  { name: 'Core & Frontend', skills: 'Next.js (App Router / SSR), React, TypeScript, JavaScript (ES6+), Core Web Vitals, HTML5, CSS3' },
  { name: 'Backend & Data', skills: 'Node.js & Express microservices, PostgreSQL, Prisma ORM, Redis Caching, REST APIs, WebSockets' },
  { name: 'Cloud & DevOps', skills: 'AWS (ECS, S3, CloudFront, EC2), Docker, GitHub Actions CI/CD, Linux' },
  { name: 'Testing & Tools', skills: 'Jest, React Testing Library, Git, Postman, Agile / Scrum code reviews' }
];

skillCategories.forEach(cat => {
  checkPage(16);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(31, 41, 55);
  doc.text(`${cat.name}: `, margin, y);
  const offset = doc.getTextWidth(`${cat.name}: `);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  const remainingWidth = contentWidth - offset;
  const wrapped = doc.splitTextToSize(cat.skills, remainingWidth);
  doc.text(wrapped, margin + offset, y);
  y += wrapped.length * 11 + 3;
});
y += 6;

// 5. Work Experience
drawSectionHeader('Work Experience');

const experiences = [
  {
    role: 'Software Engineer',
    company: 'CloudScale Systems',
    location: 'San Francisco, CA',
    dates: 'July 2022 – Present',
    bullets: [
      'Developed customer-facing analytics dashboards using Next.js, React, and TypeScript serving 120,000 monthly active users.',
      'Reduced initial page load times by 42% through image optimization, dynamic imports, and Next.js server components.',
      'Built RESTful microservices in Node.js and Express with PostgreSQL and Prisma, handling over 2.5 million daily requests.',
      'Integrated Redis caching layer, decreasing database query latency by 60%.',
      'Configured GitHub Actions CI/CD pipeline, reducing manual release cycle time from 4 hours to 15 minutes.'
    ]
  },
  {
    role: 'Junior Full-Stack Developer',
    company: 'DevSphere Studios',
    location: 'Austin, TX',
    dates: 'June 2020 – June 2022',
    bullets: [
      'Built responsive client web portals using React, Redux, and Node.js microservices.',
      'Implemented automated unit and integration tests using Jest and Supertest, raising test coverage to 85%.',
      'Maintained PostgreSQL database migrations and optimized slow queries.',
      'Containerized development environments using Docker and Docker Compose.'
    ]
  }
];

experiences.forEach(exp => {
  checkPage(60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(17, 24, 39);
  doc.text(exp.role, margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.text(exp.dates, margin + contentWidth - doc.getTextWidth(exp.dates), y);
  y += 12;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(79, 70, 229);
  doc.text(exp.company, margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text(exp.location, margin + contentWidth - doc.getTextWidth(exp.location), y);
  y += 12;

  exp.bullets.forEach(b => {
    checkPage(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(79, 70, 229);
    doc.text('•', margin + 6, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 65, 81);
    const splitBullet = doc.splitTextToSize(b, contentWidth - 18);
    doc.text(splitBullet, margin + 18, y);
    y += splitBullet.length * 11 + 3;
  });
  y += 6;
});

// 6. Projects
drawSectionHeader('Key Projects');
checkPage(40);
doc.setFont('helvetica', 'bold');
doc.setFontSize(9.5);
doc.setTextColor(17, 24, 39);
doc.text('TradePulse — Real-Time Portfolio Tracker', margin, y);

doc.setFont('helvetica', 'normal');
doc.setFontSize(8.5);
doc.setTextColor(107, 114, 128);
const projTech = 'Next.js, TypeScript, WebSockets, AWS ECS, CloudFront';
doc.text(projTech, margin + contentWidth - doc.getTextWidth(projTech), y);
y += 12;

const pBullet1 = 'Built a portfolio tracking web app with Next.js, TypeScript, and WebSockets for real-time price feeds.';
const splitPB1 = doc.splitTextToSize(pBullet1, contentWidth - 18);
doc.setFont('helvetica', 'bold');
doc.setTextColor(79, 70, 229);
doc.text('•', margin + 6, y);
doc.setFont('helvetica', 'normal');
doc.setTextColor(55, 65, 81);
doc.text(splitPB1, margin + 18, y);
y += splitPB1.length * 11 + 3;

const pBullet2 = 'Deployed on AWS ECS with automated SSL and CloudFront CDN distribution.';
const splitPB2 = doc.splitTextToSize(pBullet2, contentWidth - 18);
doc.setFont('helvetica', 'bold');
doc.setTextColor(79, 70, 229);
doc.text('•', margin + 6, y);
doc.setFont('helvetica', 'normal');
doc.setTextColor(55, 65, 81);
doc.text(splitPB2, margin + 18, y);
y += splitPB2.length * 11 + 8;

// 7. Education & Certifications
drawSectionHeader('Education & Certifications');
checkPage(35);
doc.setFont('helvetica', 'bold');
doc.setFontSize(9.5);
doc.setTextColor(17, 24, 39);
doc.text('Bachelor of Science in Computer Science', margin, y);
doc.setFont('helvetica', 'normal');
doc.setFontSize(9);
doc.setTextColor(107, 114, 128);
const eduDates = '2016 – 2020  |  GPA: 3.8 / 4.0';
doc.text(eduDates, margin + contentWidth - doc.getTextWidth(eduDates), y);
y += 12;

doc.setFont('helvetica', 'normal');
doc.setTextColor(55, 65, 81);
doc.text('University of Texas at Austin', margin, y);
y += 14;

doc.setFont('helvetica', 'bold');
doc.setFontSize(9);
doc.setTextColor(17, 24, 39);
doc.text('AWS Certified Developer – Associate', margin, y);
doc.setFont('helvetica', 'normal');
doc.setTextColor(79, 70, 229);
doc.text(' [LinkedIn Verified ✓]', margin + doc.getTextWidth('AWS Certified Developer – Associate'), y);
doc.setFont('helvetica', 'normal');
doc.setTextColor(107, 114, 128);
doc.text('Issued Oct 2023  |  ID: AWS-DEV-984210', margin + contentWidth - doc.getTextWidth('Issued Oct 2023  |  ID: AWS-DEV-984210'), y);
y += 12;

doc.setFont('helvetica', 'bold');
doc.setFontSize(9);
doc.setTextColor(17, 24, 39);
doc.text('Meta Front-End Developer Professional Certificate', margin, y);
doc.setFont('helvetica', 'normal');
doc.setTextColor(79, 70, 229);
doc.text(' [LinkedIn Verified ✓]', margin + doc.getTextWidth('Meta Front-End Developer Professional Certificate'), y);
doc.setFont('helvetica', 'normal');
doc.setTextColor(107, 114, 128);
doc.text('Issued Mar 2022  |  ID: META-FE-554192', margin + contentWidth - doc.getTextWidth('Issued Mar 2022  |  ID: META-FE-554192'), y);
y += 12;

doc.setFont('helvetica', 'bold');
doc.setFontSize(9);
doc.setTextColor(17, 24, 39);
doc.text('Docker Certified Associate (DCA)', margin, y);
doc.setFont('helvetica', 'normal');
doc.setTextColor(79, 70, 229);
doc.text(' [LinkedIn Verified ✓]', margin + doc.getTextWidth('Docker Certified Associate (DCA)'), y);
doc.setFont('helvetica', 'normal');
doc.setTextColor(107, 114, 128);
doc.text('Issued Jan 2023  |  ID: DCA-881923', margin + contentWidth - doc.getTextWidth('Issued Jan 2023  |  ID: DCA-881923'), y);
y += 16;

const outputPath = path.join(__dirname, '..', 'sample-generated-resume.pdf');
const pdfBytes = doc.output('arraybuffer');
fs.writeFileSync(outputPath, Buffer.from(pdfBytes));
console.log('Sample resume PDF generated successfully at:', outputPath);
