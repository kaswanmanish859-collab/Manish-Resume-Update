# ResumePilot AI — AI-Powered Resume Tailoring & ATS Optimization Engine

> **Project Assignment:** AI-Powered Resume Updater  
> **Duration:** 2–4 Days  
> **Framework:** Next.js (App Router, TypeScript)  
> **LLM Engine:** Google Gemini API (`gemini-3.5-flash`, `gemini-3.8-flash`) + Built-in Intelligent ATS Engine  
> **Styling:** Custom Vanilla CSS Design System (Glassmorphic Dark Mode, Responsive, Dedicated Print-to-PDF Stylesheet)

---

## 1. Project Objective

**ResumePilot AI** is an intelligent web application designed to automatically update, reorganize, and tailor an existing candidate resume to directly match any target Job Description (JD).

### The Two-Input Core Design
As mandated by the project requirements, the user interface features **only two core input fields**:
1. **Job Description:** A high-capacity text area where the user enters the target job description or pastes requirements.
2. **Upload Existing CV:** A multi-format file upload area accepting **PDF**, **DOCX**, and plain text documents with drag-and-drop support.

---

## 2. Core Features & Architecture

- **Automatic Resume Parsing:** Multi-format document parser extracting contact information, work experience, education, skills, projects, certifications, and achievements from PDF (via `pdf-parse`) and DOCX (via `mammoth`).
- **Deep JD Analysis:** Identifies the target role, seniority level, core competencies, preferred qualifications, and critical ATS keywords.
- **AI Resume Tailoring with Zero Hallucination:** Uses Google Gemini API with strict prompt engineering.
  > **Strict Factual Guardrail:** The system **preserves the candidate's actual qualifications, degrees, employers, timelines, and skills**. It **never invents or fabricates** qualifications. Missing job requirements are explicitly highlighted in the Skill Gap Analysis.
- **ATS Keyword & Skill Gap Analysis Card:**
  - **Match Score Gauge (0–100%):** Visual match rating based on job keyword frequency and candidate alignment.
  - **Matched Skills Chips:** Highlights candidate skills directly applicable to the job role.
  - **Missing Skills Chips:** Honest identification of desired JD requirements not present in the CV.
  - **Key Strengths & Tailoring Recommendations:** Actionable guidance to help the applicant stand out.
  - **Keyword Match Checklist:** Interactive item-by-item breakdown of terms found vs. missing.
- **Interactive Resume Sheet & Live Editor:**
  - **3 ATS Resume Templates:** Modern ATS, Executive, and Tech Minimalist.
  - **Inline Edit Mode:** Edit any header, summary, date, or bullet point directly on the resume before export.
  - **Add/Remove Bullet Points:** Customize achievements on the fly.
- **Multi-Format Export:**
  - **Download PDF:** Client-side vector PDF generation using `jsPDF` and `html2canvas`.
  - **Print / Save as PDF:** High-resolution native browser vector print with custom `@media print` CSS rules.
  - **Copy Plain Text:** One-click copy for online ATS application forms.
  - **Export JSON:** Portable structured data export.
- **LinkedIn Account Verification & Credential Sync:**
  - **Verify & Authenticate Profile:** Link any LinkedIn URL/username to authenticate candidate identity with a verified checkmark shield.
  - **Review All Account Details:** Inspect headline, location, current company, connections, and full summary directly in the verification modal.
  - **Peer-Endorsed Skills Review:** Review all verified LinkedIn skills, endorsement counts, and view real-time **ATS Match ⭐** badges for skills aligning with the target Job Description.
  - **Verified Certifications & Licenses:** Validates credentials from AWS, Google Cloud, Meta, Scrum Alliance, etc. with official Credential IDs and verification URLs.
  - **Seamless Resume Merge:** Automatically places verified certifications under the resume's Certifications section (with LinkedIn Verified badges), merges skills into core competencies, and updates contact links.
- **One-Click Pre-Loaded Test Cases:** 3 real-world test cases ready for immediate evaluation without needing to upload files.
- **Resilient Fallback Mode:** Works seamlessly out of the box with or without a Gemini API key. Users can optionally enter their personal Gemini key in the settings modal.

---

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| **Core Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **Language** | TypeScript |
| **Styling** | Custom Vanilla CSS (Zero CSS framework overhead, glassmorphism, responsive) |
| **AI / LLM** | [Google Gemini API](https://ai.google.dev/) (`@google/generative-ai`) |
| **Document Parsing** | `pdf-parse` (PDF extraction) & `mammoth` (DOCX extraction) |
| **PDF Generation** | `jspdf`, `html2canvas`, and native browser `@media print` CSS |
| **Icons** | `lucide-react` |

---

## 4. Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or higher, v20+ recommended)
- `npm` or `yarn`

### Installation

1. **Clone or Navigate to the Repository:**
   ```bash
   cd "ResumePilot AI"
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **(Optional) Configure Gemini API Key:**
   Create a `.env.local` file in the project root:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```
   *Note: If no API key is provided in `.env.local`, you can enter one directly in the UI via the "Configure Gemini Key" button in the top navigation, or use the built-in ATS engine which works out-of-the-box!*

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

6. **Create a Production Build:**
   ```bash
   npm run build
   npm run start
   ```

7. **Run Automated Test Cases & Generate Sample PDF:**
   ```bash
   npm run test:cases       # Runs all 3 test cases against the tailoring API
   npm run generate:pdf     # Generates the sample ATS resume PDF
   ```

---

## 5. Pre-Loaded Test Cases (Included in Repository)

The application includes 3 complete, realistic test cases ready to test with 1-click in the UI, or by uploading the text files from the `test-cases/` directory:

### Test Case 1: Senior Full-Stack Engineer
- **CV File:** `test-cases/case1-fullstack-cv.txt` (Candidate: Alex Rivera, 4 years experience with React, Next.js, Node.js, AWS)
- **Job Description File:** `test-cases/case1-job-description.txt` (Senior Next.js & Cloud Engineer at Apex FinTech Labs)
- **ATS Match Score:** ~92%
- **Key Matched Skills:** Next.js, React, TypeScript, Node.js, PostgreSQL, Prisma, Redis, AWS, Docker, Jest, WebSockets
- **Missing Skills Identified:** Playwright (E2E), Apache Kafka

### Test Case 2: AI / Machine Learning Applications Engineer
- **CV File:** `test-cases/case2-ai-engineer-cv.txt` (Candidate: Priya Sharma, 3 years experience with Python, PyTorch, LangChain, RAG, LoRA)
- **Job Description File:** `test-cases/case2-job-description.txt` (AI/ML Engineer at CognitiveHealth AI)
- **ATS Match Score:** ~94%
- **Key Matched Skills:** Python, PyTorch, LangChain, Hugging Face, RAG, ChromaDB, FastAPI, Docker, LoRA fine-tuning
- **Missing Skills Identified:** Kubernetes (K8s), LlamaIndex

### Test Case 3: Technical Product Manager (API & Platform)
- **CV File:** `test-cases/case3-product-manager-cv.txt` (Candidate: Marcus Chen, 4 years leading developer platforms, REST/GraphQL APIs, PRDs, SQL)
- **Job Description File:** `test-cases/case3-job-description.txt` (Senior Technical Product Manager at Starlight Software)
- **ATS Match Score:** ~91%
- **Key Matched Skills:** API Platform, PRD Writing, Developer Experience (DX), SQL, Amplitude, Jira, Agile/Scrum, Webhooks
- **Missing Skills Identified:** Mixpanel deep integration

---

## 6. User Flow Walkthrough

```mermaid
graph TD
    A[Step 1: Open ResumePilot AI] --> B[Step 2: Enter Job Description or Load Sample]
    B --> C[Step 3: Upload Existing CV (PDF / DOCX / TXT)]
    C --> D[Step 4: Click 'Generate Updated Resume']
    D --> E[Step 5: Document Parsed & JD Analyzed]
    E --> F[Step 6: LLM Generates Tailored Resume & Keyword Gap Analysis]
    F --> G[Step 7: View ATS Scorecard & Interactive Resume]
    G --> H[Step 8: Switch Templates / Edit Inline]
    H --> I[Step 9: Download PDF / Print Vector Resume]
```

1. **Step 1:** Open the application in the browser at `http://localhost:3000`.
2. **Step 2:** Paste your target job description into Field 1 (or click one of the pre-loaded test case buttons).
3. **Step 3:** Drag-and-drop or select your existing resume in PDF, DOCX, or text format into Field 2.
4. **Step 4:** Click **"Generate Updated Resume"**.
5. **Step 5:** Review your **ATS Keyword & Skill Gap Analysis** (match score, matched skills, missing skills, recommendations).
6. **Step 6:** Preview your tailored resume in **Modern ATS**, **Executive**, or **Minimalist** template styles.
7. **Step 7:** Optionally toggle **Edit Mode** to make quick tweaks or additions.
8. **Step 8:** Click **Download PDF** or **Print** to export your new ATS-optimized resume.

---

## 7. Zero-Hallucination & Factual Integrity Policy

A common failure mode of generic LLM resume generators is inventing qualifications (e.g. adding years of experience or degrees the candidate does not have). ResumePilot AI adheres to strict prompt constraints:
- **Preserves Authenticity:** Only candidate credentials, verified roles, projects, and educational institutions present in the uploaded CV are used.
- **Honest Gap Identification:** Requirements in the Job Description not found in the CV are displayed in the "Missing from CV" section so the candidate is aware of potential gaps without misrepresenting themselves.
- **Active Verbs & Impact:** Re-phrases existing bullet points to align with job responsibilities using metrics and strong action verbs.

---

## 8. GitHub Push Instructions

To upload this repository to GitHub:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: complete ResumePilot AI application with Next.js, Gemini API, and ATS tailoring"

# Link to your remote GitHub repository
git remote add origin https://github.com/your-username/resumepilot-ai.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 9. Deploying to Vercel (Zero-Config & Zero-Error)

ResumePilot AI is fully optimized for **Vercel**:

### Option A: Import from GitHub (Recommended)
1. Push this project to your GitHub repository.
2. Go to [vercel.com](https://vercel.com/) and click **"Add New..."** > **"Project"**.
3. Select your `resumepilot-ai` repository.
4. **Environment Variables (Optional):**
   - Key: `GEMINI_API_KEY`
   - Value: `your_gemini_api_key` (from [Google AI Studio](https://aistudio.google.com/app/apikey))
   > **Note:** Even if you do **not** provide `GEMINI_API_KEY` in Vercel, the website will **never throw an error or crash**. It will automatically operate using its built-in Intelligent ATS Heuristic Engine! Users can also enter their own key via the UI settings modal anytime.
5. Click **"Deploy"**. Vercel will build and deploy the application in under 60 seconds.

### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
vercel
```

---

## 10. License

This project is licensed under the ISC License.
