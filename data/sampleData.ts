import { TailoredResumeData, JDAnalysis, SkillGapAnalysis } from '@/types/resume';

export interface SampleTestCase {
  id: string;
  title: string;
  role: string;
  shortDesc: string;
  jobDescription: string;
  originalCvText: string;
  precomputedTailored: TailoredResumeData;
  precomputedJdAnalysis: JDAnalysis;
  precomputedGap: SkillGapAnalysis;
}

export const SAMPLE_TEST_CASES: SampleTestCase[] = [
  {
    id: 'case-1-fullstack',
    title: 'Test Case 1: Full-Stack Engineer',
    role: 'Senior Full-Stack Engineer',
    shortDesc: 'Software Engineer CV tailored for Senior Next.js / TypeScript & AWS Role',
    jobDescription: `Job Title: Senior Full-Stack Engineer (Next.js & Cloud)
Company: Apex FinTech Labs
Location: New York, NY / Remote

About the Role:
We are looking for a Senior Full-Stack Engineer with strong production experience in Next.js, React, TypeScript, and Node.js microservices. You will architect high-throughput financial dashboards, design resilient REST & GraphQL APIs, and deploy cloud infrastructure on AWS.

Key Requirements:
- 4+ years of professional experience with React, Next.js (App Router), TypeScript, and Node.js.
- Strong understanding of state management, SSR/SSG caching, and web performance optimization (Core Web Vitals).
- Production experience with PostgreSQL, Prisma ORM, Redis caching, and Docker.
- Hands-on experience with AWS services (ECS, S3, CloudFront, Lambda, RDS).
- Familiarity with CI/CD pipelines (GitHub Actions), automated testing (Jest, Playwright), and security best practices.
- Excellent communication skills, agile teamwork, and a passion for clean, maintainable architecture.

Preferred Qualifications:
- Experience with real-time financial data streaming (WebSockets, Kafka).
- Contributions to open-source software and knowledge of modern CSS/Tailwind architectures.`,
    originalCvText: `ALEX RIVERA
San Francisco, CA | (555) 382-9104 | alex.rivera@email.com | linkedin.com/in/alex-rivera-dev | github.com/arivera-code

PROFESSIONAL SUMMARY
Experienced software engineer with 4 years building web applications using JavaScript, React, and Node.js. Passionate about user-friendly interfaces, performance tuning, and scalable backend services.

TECHNICAL SKILLS
Languages: TypeScript, JavaScript (ES6+), Python, SQL, HTML5, CSS3
Frameworks & Libraries: React, Next.js, Redux Toolkit, Node.js, Express, Jest, React Testing Library
Databases & Cloud: PostgreSQL, MongoDB, Redis, AWS (S3, EC2), Docker
Tools: Git, GitHub Actions, Webpack, Postman, Linux

WORK EXPERIENCE
Software Engineer | CloudScale Systems, San Francisco, CA | July 2022 – Present
- Developed customer-facing analytics dashboards using Next.js, React, and TypeScript serving 120,000 monthly active users.
- Reduced initial page load times by 42% through image optimization, dynamic imports, and Next.js server components.
- Built RESTful microservices in Node.js and Express with PostgreSQL and Prisma, handling over 2.5 million daily requests.
- Integrated Redis caching layer, decreasing database query latency by 60%.
- Configured GitHub Actions CI/CD pipeline, reducing manual release cycle time from 4 hours to 15 minutes.
- Collaborated in an agile scrum team of 8 engineers and conducted regular code reviews.

Junior Full-Stack Developer | DevSphere Studios, Austin, TX | June 2020 – June 2022
- Built responsive client web portals using React, Redux, and Node.js.
- Implemented automated unit and integration tests using Jest and Supertest, raising test coverage to 85%.
- Maintained PostgreSQL database migrations and optimized slow queries.
- Containerized development environments using Docker and Docker Compose.

EDUCATION
Bachelor of Science in Computer Science | University of Texas at Austin | 2016 – 2020 | GPA: 3.8 / 4.0

PROJECTS
TradePulse - Real-time Portfolio Tracker
- Built a portfolio tracking web app with Next.js, TypeScript, and WebSockets for real-time price feeds.
- Deployed on AWS ECS with automated SSL and CloudFront CDN distribution.

CERTIFICATIONS
- AWS Certified Developer - Associate (2023)`,
    precomputedTailored: {
      contact: {
        fullName: 'Alex Rivera',
        email: 'alex.rivera@email.com',
        phone: '(555) 382-9104',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/alex-rivera-dev',
        github: 'github.com/arivera-code',
      },
      targetRole: 'Senior Full-Stack Engineer (Next.js & Cloud)',
      professionalSummary: 'Senior Full-Stack Engineer with 4+ years of hands-on expertise architecting high-throughput web applications with Next.js (App Router), TypeScript, React, and Node.js. Proven track record optimizing web performance by 42%, scaling microservices handling 2.5M+ daily requests, and orchestrating AWS cloud deployments with automated CI/CD pipelines.',
      skills: [
        {
          categoryName: 'Core Technologies & Frontend',
          skills: ['Next.js (App Router / SSR / Server Components)', 'React', 'TypeScript', 'JavaScript (ES6+)', 'Web Performance & Core Web Vitals', 'HTML5 & CSS3']
        },
        {
          categoryName: 'Backend & Databases',
          skills: ['Node.js & Express microservices', 'PostgreSQL', 'Prisma ORM', 'Redis Caching', 'REST APIs', 'WebSockets']
        },
        {
          categoryName: 'Cloud & DevOps',
          skills: ['AWS (ECS, S3, CloudFront, EC2)', 'Docker & Containerization', 'GitHub Actions CI/CD', 'Linux']
        },
        {
          categoryName: 'Testing & Engineering Practices',
          skills: ['Jest', 'React Testing Library', 'Supertest', 'Agile / Scrum', 'Code Review & Architecture']
        }
      ],
      experience: [
        {
          company: 'CloudScale Systems',
          role: 'Full-Stack Software Engineer',
          location: 'San Francisco, CA',
          startDate: 'July 2022',
          endDate: 'Present',
          isCurrent: true,
          bulletPoints: [
            'Architected and delivered high-throughput analytics dashboards using Next.js, React, and TypeScript for 120,000+ monthly active enterprise users.',
            'Engineered Next.js Server Components and dynamic import strategies, slashing initial page load latency by 42% and achieving top Core Web Vitals.',
            'Constructed resilient Node.js microservices backed by PostgreSQL and Prisma ORM, seamlessly handling 2,500,000+ daily financial and analytical transactions.',
            'Implemented an in-memory Redis caching architecture, mitigating database query load and reducing p95 latency by 60%.',
            'Designed and maintained GitHub Actions CI/CD pipelines that reduced release cycle duration from 4 hours down to 15 minutes.'
          ]
        },
        {
          company: 'DevSphere Studios',
          role: 'Full-Stack Developer',
          location: 'Austin, TX',
          startDate: 'June 2020',
          endDate: 'June 2022',
          isCurrent: false,
          bulletPoints: [
            'Engineered full-stack client web portals utilizing React, TypeScript, and Node.js REST services with strict adherence to responsive design.',
            'Spearheaded automated unit and integration testing suite utilizing Jest and Supertest, driving overall code test coverage to 85%.',
            'Maintained relational database schema migrations with PostgreSQL, profiling query plans to eliminate bottlenecks.',
            'Standardized reproducible developer environments across distributed teams utilizing Docker and Docker Compose.'
          ]
        }
      ],
      projects: [
        {
          title: 'TradePulse - Real-time Portfolio Tracker',
          technologies: ['Next.js', 'TypeScript', 'WebSockets', 'AWS ECS', 'CloudFront', 'Redis'],
          description: 'Production financial web app delivering live streaming portfolio metrics and equity pricing.',
          bulletPoints: [
            'Engineered sub-second real-time streaming market data updates utilizing WebSockets and Next.js frontend state synchronization.',
            'Automated infrastructure deployment on AWS ECS with CloudFront edge caching, SSL termination, and Docker containers.'
          ]
        }
      ],
      education: [
        {
          institution: 'University of Texas at Austin',
          degree: 'Bachelor of Science in Computer Science',
          fieldOfStudy: 'Computer Science',
          startDate: '2016',
          endDate: '2020',
          gpa: '3.8 / 4.0',
          highlights: ['Graduated with Honors', 'Focus in Distributed Systems & Software Engineering']
        }
      ],
      certifications: [
        {
          name: 'AWS Certified Developer - Associate',
          issuer: 'Amazon Web Services',
          issueDate: '2023'
        }
      ],
      achievements: [
        'Reduced release deployment cycle by 93% via automated GitHub Actions pipeline.',
        'Scaled Node.js/PostgreSQL infrastructure to sustain 2.5 million daily requests at sub-50ms latency.'
      ]
    },
    precomputedJdAnalysis: {
      targetRole: 'Senior Full-Stack Engineer (Next.js & Cloud)',
      seniorityLevel: 'Senior (4+ Years)',
      companyName: 'Apex FinTech Labs',
      requiredSkills: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma', 'Redis', 'AWS', 'Docker', 'Jest'],
      preferredSkills: ['WebSockets', 'Kafka', 'Playwright', 'Financial Systems', 'Core Web Vitals'],
      keyResponsibilities: [
        'Architect responsive Next.js web applications and financial dashboards',
        'Design high-throughput Node.js microservices and database schemas',
        'Deploy and manage scalable cloud services on AWS',
        'Maintain automated CI/CD pipelines and unit testing suites'
      ],
      importantKeywords: ['Next.js', 'App Router', 'TypeScript', 'Node.js', 'AWS', 'Docker', 'PostgreSQL', 'Prisma', 'Redis', 'CI/CD', 'WebSockets'],
      atsFocusAreas: ['Next.js production scalability', 'AWS deployment', 'Microservices latency reduction', 'TypeScript proficiency']
    },
    precomputedGap: {
      matchScore: 92,
      matchedSkills: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma', 'Redis', 'AWS (S3, ECS)', 'Docker', 'Jest', 'WebSockets', 'GitHub Actions'],
      missingSkills: ['Playwright (E2E Testing)', 'Apache Kafka', 'AWS Lambda (Serverless)'],
      strengths: [
        '4 years of verified production experience in Next.js, TypeScript, and Node.js microservices.',
        'Documented performance optimization (42% speedup) directly aligning with Core Web Vitals criteria.',
        'Existing AWS Certified Developer certification verifying cloud architecture competence.'
      ],
      improvementSuggestions: [
        'Consider highlighting any automated end-to-end testing with Playwright or Cypress in project descriptions.',
        'Mention experience with event-driven message queues (such as Kafka or RabbitMQ) if applicable.'
      ],
      atsKeywordFrequencyMatches: [
        { keyword: 'Next.js', matchedInResume: true },
        { keyword: 'TypeScript', matchedInResume: true },
        { keyword: 'React', matchedInResume: true },
        { keyword: 'Node.js', matchedInResume: true },
        { keyword: 'PostgreSQL', matchedInResume: true },
        { keyword: 'Prisma', matchedInResume: true },
        { keyword: 'Redis', matchedInResume: true },
        { keyword: 'AWS', matchedInResume: true },
        { keyword: 'Docker', matchedInResume: true },
        { keyword: 'WebSockets', matchedInResume: true },
        { keyword: 'Kafka', matchedInResume: false },
        { keyword: 'Playwright', matchedInResume: false }
      ]
    }
  },
  {
    id: 'case-2-datascientist',
    title: 'Test Case 2: AI / ML Engineer',
    role: 'Machine Learning & AI Engineer',
    shortDesc: 'Data Scientist CV tailored for GenAI / LLM Application Developer role',
    jobDescription: `Job Title: AI / Machine Learning Applications Engineer
Company: CognitiveHealth AI
Location: Boston, MA / Hybrid

Role Overview:
CognitiveHealth AI is seeking an AI / ML Applications Engineer to integrate Large Language Models (LLMs) and computer vision pipelines into our clinical decision support system. You will fine-tune open-source models, build RAG (Retrieval-Augmented Generation) pipelines, and deploy secure inference microservices.

Requirements:
- 3+ years experience with Python, PyTorch, Hugging Face, and LangChain / LlamaIndex.
- Strong practical knowledge of Retrieval-Augmented Generation (RAG), vector databases (Pinecone, ChromaDB, Milvus), and embeddings.
- Experience with LLM prompt engineering, fine-tuning (LoRA, QLoRA), and model evaluation (BLEU, ROUGE, BERTScore).
- Proficiency deploying AI models using FastAPI, Docker, and Kubernetes on GCP or AWS.
- Background in processing structured and unstructured clinical/textual datasets (Pandas, NumPy, Scikit-learn).
- Master’s or Bachelor’s in Computer Science, Data Science, or related STEM field.

Bonus:
- Experience with HIPAA/healthcare privacy standards.
- Published research or open-source LLM benchmarking tools.`,
    originalCvText: `PRIYA SHARMA
Boston, MA | (617) 555-0192 | priya.sharma@mlmail.com | linkedin.com/in/priya-sharma-ai | github.com/psharma-ai

SUMMARY
Machine Learning Engineer with 3 years of experience developing deep learning models, NLP pipelines, and data analytics solutions. Skilled in Python, PyTorch, LLMs, and cloud deployments.

TECHNICAL SKILLS
- Programming: Python, SQL, C++, Bash
- ML & AI: PyTorch, TensorFlow, Hugging Face Transformers, Scikit-Learn, Pandas, NumPy, OpenCV
- NLP & LLM: LangChain, RAG architectures, Prompt Engineering, OpenAI API, LoRA fine-tuning
- Vector DBs & Search: ChromaDB, FAISS, Pinecone
- Cloud & MLOps: FastAPI, Docker, AWS (SageMaker, S3), Git, MLflow

EXPERIENCE
Machine Learning Engineer | Apex HealthTech, Boston, MA | March 2023 – Present
- Designed and deployed an automated biomedical question-answering system using Hugging Face Transformers and LangChain with RAG.
- Indexed 500,000+ medical journals into ChromaDB vector database, enabling sub-200ms semantic search.
- Fine-tuned Llama-2 models using LoRA techniques on 40,000 domain-specific records, improving diagnostic summary accuracy by 28%.
- Built inference REST endpoints using FastAPI and Docker, deployed on AWS SageMaker with 99.9% uptime.
- Tracked experiments, model artifacts, and hyperparameters using MLflow.

Data Science Associate | DataGenix Solutions, Cambridge, MA | August 2021 – February 2023
- Developed predictive models using Scikit-Learn and PyTorch for customer churn and healthcare patient readmission.
- Cleaned and preprocessed tabular and unstructured clinical text datasets exceeding 2M records with Pandas and NumPy.
- Implemented BERT-based sentiment analysis and text classification models with 89% F1-score.
- Conducted model evaluation using cross-validation, ROC-AUC, and precision-recall metrics.

EDUCATION
Master of Science in Data Science | Boston University | 2019 – 2021 | GPA: 3.9 / 4.0
Bachelor of Technology in Computer Science | Delhi Technological University | 2015 – 2019

PROJECTS
MedRAG - Open-Source Clinical Document Assistant
- Built a LangChain RAG pipeline querying clinical trial PDFs with hybrid keyword-vector search (FAISS) and citation generation.
- Implemented automated evaluation using ROUGE and BERTScore.`,
    precomputedTailored: {
      contact: {
        fullName: 'Priya Sharma',
        email: 'priya.sharma@mlmail.com',
        phone: '(617) 555-0192',
        location: 'Boston, MA',
        linkedin: 'linkedin.com/in/priya-sharma-ai',
        github: 'github.com/psharma-ai'
      },
      targetRole: 'AI / Machine Learning Applications Engineer',
      professionalSummary: 'Machine Learning & AI Applications Engineer with 3+ years developing state-of-the-art NLP pipelines, Retrieval-Augmented Generation (RAG) systems, and fine-tuned LLM architectures in clinical and healthtech domains. Proven expertise deploying scalable FastAPI microservices on AWS, optimizing vector search across 500k+ records, and fine-tuning open-source models with LoRA.',
      skills: [
        {
          categoryName: 'Generative AI & LLMs',
          skills: ['Retrieval-Augmented Generation (RAG)', 'LangChain', 'Hugging Face Transformers', 'LoRA / QLoRA Fine-Tuning', 'Prompt Engineering', 'Model Evaluation (ROUGE, BERTScore)']
        },
        {
          categoryName: 'Machine Learning & Core Python',
          skills: ['Python', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'TensorFlow', 'OpenCV']
        },
        {
          categoryName: 'Vector Databases & Search',
          skills: ['ChromaDB', 'Pinecone', 'FAISS', 'Embeddings', 'Semantic Search']
        },
        {
          categoryName: 'MLOps, APIs & Cloud',
          skills: ['FastAPI', 'Docker', 'AWS SageMaker & S3', 'MLflow', 'Git', 'Linux']
        }
      ],
      experience: [
        {
          company: 'Apex HealthTech',
          role: 'Machine Learning Engineer (NLP & GenAI)',
          location: 'Boston, MA',
          startDate: 'March 2023',
          endDate: 'Present',
          isCurrent: true,
          bulletPoints: [
            'Architected and deployed an enterprise clinical document assistant utilizing LangChain and Hugging Face Transformers with hybrid RAG retrieval.',
            'Vectorized and indexed 500,000+ peer-reviewed medical publications into ChromaDB, sustaining sub-200ms latency queries.',
            'Fine-tuned open-source LLMs (Llama-2) via parameter-efficient LoRA on 40,000 biomedical notes, boosting clinical summary precision by 28%.',
            'Engineered low-latency FastAPI inference microservices packaged in Docker and managed on AWS SageMaker with 99.9% uptime SLA.',
            'Standardized end-to-end model evaluation, tracking experiment metrics and model registry artifacts using MLflow.'
          ]
        },
        {
          company: 'DataGenix Solutions',
          role: 'Data Science Associate',
          location: 'Cambridge, MA',
          startDate: 'August 2021',
          endDate: 'February 2023',
          isCurrent: false,
          bulletPoints: [
            'Formulated predictive deep learning and NLP architectures in PyTorch and Scikit-learn for clinical patient readmission predictions.',
            'Processed and sanitized multi-modal clinical text and tabular datasets comprising 2,000,000+ records via Pandas and NumPy.',
            'Engineered BERT-based domain text classification pipelines scoring 89% F1-score across specialized medical terminology.',
            'Evaluated algorithmic bias and performance using ROC-AUC, precision-recall, and cross-validation protocols.'
          ]
        }
      ],
      projects: [
        {
          title: 'MedRAG - Clinical Document Intelligence',
          technologies: ['LangChain', 'ChromaDB / FAISS', 'FastAPI', 'PyTorch', 'BERTScore'],
          description: 'RAG architecture extracting evidence-based clinical insights from medical PDFs with source verification.',
          bulletPoints: [
            'Engineered hybrid dense-sparse vector search using FAISS and cross-encoder re-ranking for clinical trial reports.',
            'Automated synthetic benchmark testing using ROUGE-1/2 and BERTScore metrics to quantify factual grounding.'
          ]
        }
      ],
      education: [
        {
          institution: 'Boston University',
          degree: 'Master of Science in Data Science',
          fieldOfStudy: 'Data Science & Machine Learning',
          startDate: '2019',
          endDate: '2021',
          gpa: '3.9 / 4.0',
          highlights: ['Focused on Natural Language Processing and Deep Learning Systems']
        },
        {
          institution: 'Delhi Technological University',
          degree: 'Bachelor of Technology in Computer Science',
          fieldOfStudy: 'Computer Science',
          startDate: '2015',
          endDate: '2019'
        }
      ],
      achievements: [
        'Boosted clinical summarization accuracy by 28% through custom LoRA fine-tuning on healthcare corpus.',
        'Scaled vector search index over 500k documents with under 200ms response time.'
      ]
    },
    precomputedJdAnalysis: {
      targetRole: 'AI / Machine Learning Applications Engineer',
      seniorityLevel: 'Mid-to-Senior (3+ Years)',
      companyName: 'CognitiveHealth AI',
      requiredSkills: ['Python', 'PyTorch', 'Hugging Face', 'LangChain', 'RAG', 'Vector Databases', 'LoRA Fine-tuning', 'FastAPI', 'Docker', 'AWS/GCP'],
      preferredSkills: ['Kubernetes', 'HIPAA Compliance', 'LlamaIndex', 'Milvus', 'Clinical decision systems'],
      keyResponsibilities: [
        'Build and maintain RAG pipelines for clinical decision support',
        'Fine-tune open-source LLMs using parameter-efficient methods (LoRA/QLoRA)',
        'Deploy resilient API microservices with FastAPI and Docker',
        'Evaluate LLM generation quality and factual alignment'
      ],
      importantKeywords: ['Python', 'PyTorch', 'Hugging Face', 'LangChain', 'RAG', 'Pinecone', 'ChromaDB', 'FastAPI', 'Docker', 'LoRA', 'ROUGE', 'BERTScore'],
      atsFocusAreas: ['RAG architecture expertise', 'Hands-on LLM fine-tuning experience', 'FastAPI production deployments', 'Healthcare text domain experience']
    },
    precomputedGap: {
      matchScore: 94,
      matchedSkills: ['Python', 'PyTorch', 'Hugging Face', 'LangChain', 'RAG', 'ChromaDB', 'Pinecone', 'LoRA', 'FastAPI', 'Docker', 'BERTScore', 'ROUGE', 'AWS'],
      missingSkills: ['Kubernetes (K8s orchestration)', 'LlamaIndex', 'Milvus vector engine'],
      strengths: [
        'Direct experience building clinical RAG pipelines with Hugging Face and LangChain.',
        'Proven LoRA fine-tuning on 40k domain records with measurable accuracy uplift (28%).',
        'Master’s degree in Data Science from Boston University perfectly matching academic criteria.'
      ],
      improvementSuggestions: [
        'Explicitly mention familiarity with container orchestration tools like Kubernetes if experienced with container deployments.',
        'Emphasize data confidentiality practices adhering to healthcare regulations like HIPAA.'
      ],
      atsKeywordFrequencyMatches: [
        { keyword: 'Python', matchedInResume: true },
        { keyword: 'PyTorch', matchedInResume: true },
        { keyword: 'LangChain', matchedInResume: true },
        { keyword: 'Hugging Face', matchedInResume: true },
        { keyword: 'RAG', matchedInResume: true },
        { keyword: 'ChromaDB', matchedInResume: true },
        { keyword: 'FastAPI', matchedInResume: true },
        { keyword: 'Docker', matchedInResume: true },
        { keyword: 'LoRA', matchedInResume: true },
        { keyword: 'Kubernetes', matchedInResume: false },
        { keyword: 'LlamaIndex', matchedInResume: false }
      ]
    }
  },
  {
    id: 'case-3-productmanager',
    title: 'Test Case 3: Technical Product Manager',
    role: 'Senior Product Manager',
    shortDesc: 'Product Manager CV tailored for B2B SaaS Growth & API Platform role',
    jobDescription: `Job Title: Senior Technical Product Manager (API & Developer Platform)
Company: Starlight Software
Location: San Francisco, CA / Hybrid

Role Overview:
Starlight Software is seeking a Senior Technical Product Manager to lead our Core API and Developer Ecosystem. You will define product vision, manage developer documentation, partner with engineering leaders, and drive adoption across 10,000+ developer accounts.

Responsibilities:
- Own the product roadmap for developer-facing APIs, SDKs, and webhook infrastructure.
- Translate complex technical customer needs into PRDs, user stories, and acceptance criteria.
- Conduct user research, developer interviews, and data-driven prioritization using SQL, Amplitude, and Mixpanel.
- Partner with engineering, developer relations, and sales to launch high-impact developer products.
- Monitor product metrics: API latency, developer activation rate, churn, and NPS.

Requirements:
- 4+ years of product management experience in B2B SaaS, developer tools, or API platforms.
- Background working closely with engineering teams; computer science degree or equivalent technical foundation.
- Strong proficiency in SQL, Jira, Agile/Scrum, and product analytics tools.
- Proven track record launching products that increased revenue or user retention.`,
    originalCvText: `MARCUS CHEN
San Francisco, CA | (415) 555-0814 | marcus.chen@pmcareer.com | linkedin.com/in/marcus-chen-pm

PROFESSIONAL SUMMARY
Product Manager with 4+ years leading developer-centric SaaS products, API platforms, and partner integrations. Skilled in user research, PRD authoring, SQL analytics, and cross-functional agile leadership.

CORE COMPETENCIES
- Product Strategy: Product Roadmap, PRDs, MVP Definition, User Journey Mapping, Developer Experience (DX)
- Analytics & Tools: SQL, Amplitude, Mixpanel, Jira, Confluence, Figma, Google Analytics, Postman
- Methodologies: Agile Scrum, Sprint Planning, A/B Testing, User Interviews, Backlog Grooming

EXPERIENCE
Product Manager | NexaCloud API Platform, San Francisco, CA | 2022 – Present
- Led the developer platform product squad (6 engineers, 1 designer), delivering REST and GraphQL APIs used by 8,500 active developers.
- Authored 25+ detailed PRDs and technical specs for webhook notifications and OAuth 2.0 authentication flows.
- Increased developer activation rate by 34% within 90 days by revamping interactive API documentation and quickstart guides.
- Queried user retention cohorts and event funnels using SQL and Amplitude, identifying and removing a 20% drop-off point in onboarding.
- Conducted 40+ user interviews with CTOs and developer leads to shape the quarterly roadmap.

Associate Product Manager | DataBridge Inc., Seattle, WA | 2020 – 2022
- Managed feature backlog and sprint ceremonies for B2B data synchronization connectors.
- Defined acceptance criteria and tracked velocity across 14 consecutive two-week agile sprints.
- Implemented in-app feedback surveys that increased product CSAT from 74% to 88%.

EDUCATION
B.S. in Management Information Systems & Computer Science | University of Washington | 2016 – 2020`,
    precomputedTailored: {
      contact: {
        fullName: 'Marcus Chen',
        email: 'marcus.chen@pmcareer.com',
        phone: '(415) 555-0814',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/marcus-chen-pm'
      },
      targetRole: 'Senior Technical Product Manager (API & Developer Platform)',
      professionalSummary: 'Senior Technical Product Manager with 4+ years specializing in developer platforms, API products, and B2B SaaS ecosystems. Proven success leading technical roadmaps for 8,500+ active developers, increasing developer activation by 34%, and translating complex engineering requirements into high-converting developer experiences using SQL and Amplitude.',
      skills: [
        {
          categoryName: 'Product Leadership & Strategy',
          skills: ['API Product Roadmaps', 'Technical PRD Authoring', 'Developer Experience (DX)', 'MVP Scoping', 'Go-To-Market (GTM)']
        },
        {
          categoryName: 'Technical & Platform Acumen',
          skills: ['REST & GraphQL APIs', 'Webhooks', 'OAuth 2.0 Security', 'SDKs', 'Postman']
        },
        {
          categoryName: 'Data Analytics & Tools',
          skills: ['SQL (Cohort & Funnel Analysis)', 'Amplitude', 'Mixpanel', 'Jira & Confluence', 'Figma']
        },
        {
          categoryName: 'Agile & Execution',
          skills: ['Agile / Scrum Ceremonies', 'User Interviews & Discovery', 'A/B Testing', 'Sprint Planning']
        }
      ],
      experience: [
        {
          company: 'NexaCloud API Platform',
          role: 'Technical Product Manager (Core API)',
          location: 'San Francisco, CA',
          startDate: '2022',
          endDate: 'Present',
          isCurrent: true,
          bulletPoints: [
            'Orchestrated technical product strategy and quarterly roadmaps for REST and GraphQL API services serving 8,500+ active developers.',
            'Authored 25+ comprehensive PRDs, sequence diagrams, and acceptance criteria for webhook delivery systems and OAuth 2.0 authorization.',
            'Drove a 34% surge in developer activation rate within 90 days by redesigning interactive API documentation and code samples.',
            'Conducted SQL cohort analysis and Amplitude event telemetry to eliminate onboarding friction, recapturing 20% lost conversion.',
            'Interviewed 40+ engineering executives and developers to build data-backed feature prioritizations with high engineering buy-in.'
          ]
        },
        {
          company: 'DataBridge Inc.',
          role: 'Associate Product Manager',
          location: 'Seattle, WA',
          startDate: '2020',
          endDate: '2022',
          isCurrent: false,
          bulletPoints: [
            'Spearheaded feature specifications and bi-weekly sprint ceremonies for B2B cloud synchronization connectors.',
            'Maintained prioritized product backlogs and sprint burndowns across 14 consecutive engineering cycles.',
            'Introduced qualitative feedback loops and CSAT measurement, escalating customer satisfaction from 74% to 88%.'
          ]
        }
      ],
      projects: [
        {
          title: 'Developer Portal 2.0 Redesign',
          technologies: ['Postman Collections', 'OpenAPI / Swagger', 'Amplitude', 'SQL'],
          description: 'Comprehensive redesign of interactive API documentation and developer playground.',
          bulletPoints: [
            'Decreased time-to-first-API-call (TTFAC) from 18 minutes to 4 minutes.',
            'Generated 45% increase in self-serve developer registrations.'
          ]
        }
      ],
      education: [
        {
          institution: 'University of Washington',
          degree: 'B.S. in Management Information Systems & Computer Science',
          fieldOfStudy: 'Information Systems & Computer Science',
          startDate: '2016',
          endDate: '2020',
          highlights: ['Dual concentration in Software Architecture & Product Management']
        }
      ],
      achievements: [
        'Elevated developer activation rate by 34% through developer-first documentation redesign.',
        'Maintained 100% on-time sprint velocity across 14 consecutive product release cycles.'
      ]
    },
    precomputedJdAnalysis: {
      targetRole: 'Senior Technical Product Manager (API & Developer Platform)',
      seniorityLevel: 'Senior (4+ Years)',
      companyName: 'Starlight Software',
      requiredSkills: ['API Management', 'PRD Writing', 'Developer Experience (DX)', 'SQL', 'Amplitude', 'Agile/Scrum', 'SDKs & Webhooks'],
      preferredSkills: ['B2B SaaS Growth', 'OpenAPI / Swagger', 'Developer Relations', 'Churn Reduction'],
      keyResponsibilities: [
        'Own developer platform roadmap and API feature lifecycle',
        'Write technical PRDs and user stories for engineering squads',
        'Analyze developer telemetry funnels with SQL and Amplitude',
        'Conduct developer interviews to discover unfulfilled workflows'
      ],
      importantKeywords: ['API', 'Developer Platform', 'PRD', 'SQL', 'Amplitude', 'Webhooks', 'Agile', 'B2B SaaS', 'Roadmap'],
      atsFocusAreas: ['Developer platform leadership', 'Data-driven decision making (SQL/Amplitude)', 'API & SDK ecosystem familiarity']
    },
    precomputedGap: {
      matchScore: 91,
      matchedSkills: ['API Platform', 'PRD Writing', 'Developer Experience (DX)', 'SQL', 'Amplitude', 'Jira', 'Agile/Scrum', 'Webhooks', 'OAuth 2.0'],
      missingSkills: ['Mixpanel deep integration', 'Developer Relations community talks'],
      strengths: [
        'Demonstrated 34% lift in developer activation metrics directly relevant to developer platform goals.',
        'Dual academic background in Computer Science and Information Systems providing strong technical empathy.',
        'Authored 25+ technical PRDs for distributed webhook and authentication services.'
      ],
      improvementSuggestions: [
        'Mention experience coordinating with Developer Relations or DevRel community programs if applicable.',
        'Highlight any API governance or OpenAPI schema automation experience.'
      ],
      atsKeywordFrequencyMatches: [
        { keyword: 'API', matchedInResume: true },
        { keyword: 'PRD', matchedInResume: true },
        { keyword: 'Developer Platform', matchedInResume: true },
        { keyword: 'SQL', matchedInResume: true },
        { keyword: 'Amplitude', matchedInResume: true },
        { keyword: 'Webhooks', matchedInResume: true },
        { keyword: 'Agile', matchedInResume: true },
        { keyword: 'Mixpanel', matchedInResume: false }
      ]
    }
  }
];
