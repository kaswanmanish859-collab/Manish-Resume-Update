'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Upload,
  FileText,
  Key,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Trash2,
  RotateCcw,
  Bot,
  Zap,
  ArrowRight,
  ClipboardPaste,
  ShieldCheck,
} from 'lucide-react';
import { SAMPLE_TEST_CASES, SampleTestCase } from '@/data/sampleData';
import {
  TailorResponse,
  TailoredResumeData,
  LinkedInProfileData,
  LinkedInVerifiedCertification,
} from '@/types/resume';
import { applyLinkedInProfileData } from '@/lib/gemini';
import { AtsScoreCard } from '@/components/AtsScoreCard';
import { ResumePreview } from '@/components/ResumePreview';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { LinkedInVerificationModal } from '@/components/LinkedInVerificationModal';
import { safeFetchJson } from '@/lib/api-client';
import { extractPdfTextInBrowser } from '@/lib/pdf-client';

export default function HomePage() {
  // Core Input State (Two Inputs)
  const [jobDescription, setJobDescription] = useState<string>('');
  const [cvText, setCvText] = useState<string>('');
  const [cvFileName, setCvFileName] = useState<string>('');
  const [isParsingCv, setIsParsingCv] = useState<boolean>(false);
  const [showExtractedText, setShowExtractedText] = useState<boolean>(false);
  const [isCvPasteMode, setIsCvPasteMode] = useState<boolean>(false);

  // Active Test Case (if any)
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string | null>(null);

  // LinkedIn Verification State
  const [linkedInProfile, setLinkedInProfile] = useState<LinkedInProfileData | null>(null);
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState<boolean>(false);
  const [detectedLinkedInUrl, setDetectedLinkedInUrl] = useState<string>('');

  // App Settings & API Key
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);

  // Tailoring Process State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tailorResult, setTailorResult] = useState<TailorResponse | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Load API key from localStorage on mount (safe for Brave & strict privacy modes)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedKey = localStorage.getItem('resumepilot_gemini_key');
        if (savedKey) setGeminiApiKey(savedKey);
      }
    } catch (e) {
      console.warn('localStorage not accessible (Brave Shields or strict mode enabled):', e);
    }
  }, []);

  // Detect LinkedIn URL in CV content
  useEffect(() => {
    if (cvText && cvText.trim().length > 0) {
      const match = cvText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/i);
      if (match) {
        setDetectedLinkedInUrl(match[0].startsWith('http') ? match[0] : `https://${match[0]}`);
      } else {
        setDetectedLinkedInUrl('');
      }
    } else {
      setDetectedLinkedInUrl('');
      setLinkedInProfile(null);
    }
  }, [cvText]);

  const handleSaveApiKey = (key: string) => {
    setGeminiApiKey(key);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('resumepilot_gemini_key', key);
      }
    } catch (e) {
      console.warn('Could not save key to localStorage:', e);
    }
  };

  const handleApplyLinkedInProfile = (
    profile: LinkedInProfileData,
    selectedSkills: string[],
    selectedCerts: LinkedInVerifiedCertification[]
  ) => {
    const sanitizedProfile: LinkedInProfileData = {
      ...profile,
      skills: profile.skills.filter((s) => selectedSkills.includes(s.name)),
      certifications: selectedCerts,
    };

    setLinkedInProfile(sanitizedProfile);

    // If a tailored resume already exists, merge the verified credentials immediately
    if (tailorResult) {
      const updatedResume: TailoredResumeData = JSON.parse(
        JSON.stringify(tailorResult.tailoredResume)
      );
      const updatedGap = JSON.parse(JSON.stringify(tailorResult.skillGap));

      applyLinkedInProfileData(updatedResume, updatedGap, sanitizedProfile);

      setTailorResult({
        ...tailorResult,
        tailoredResume: updatedResume,
        skillGap: updatedGap,
      });
    }
  };

  // Load pre-built Test Cases
  const handleSelectTestCase = (testCase: SampleTestCase) => {
    setSelectedTestCaseId(testCase.id);
    setJobDescription(testCase.jobDescription);
    setCvText(testCase.originalCvText);
    setCvFileName(`${testCase.title} (Pre-loaded CV)`);
    setErrorMessage(null);
    setTailorResult(null);
  };

  // Handle File Upload & Parsing
  const handleFileUpload = async (file: File) => {
    setIsParsingCv(true);
    setErrorMessage(null);

    // Fast-path client reading for plain text / markdown files (0ms, 100% reliable)
    const lowerName = file.name.toLowerCase();
    if (lowerName.endsWith('.txt') || lowerName.endsWith('.md') || file.type.startsWith('text/')) {
      try {
        const text = await file.text();
        if (text && text.trim().length >= 20) {
          setCvText(text.trim());
          setCvFileName(file.name);
          setSelectedTestCaseId(null);
          setIsParsingCv(false);
          return;
        }
      } catch (readErr) {
        console.warn('Direct file read failed, falling back to server parse:', readErr);
      }
    }

    // Fast-path client reading for PDFs (<50ms, zero network latency)
    if (lowerName.endsWith('.pdf') || file.type.includes('pdf')) {
      try {
        const clientPdfText = await extractPdfTextInBrowser(file);
        if (clientPdfText && clientPdfText.length >= 80) {
          setCvText(clientPdfText);
          setCvFileName(file.name);
          setSelectedTestCaseId(null);
          setIsParsingCv(false);
          return;
        }
      } catch (clientErr) {
        console.warn('Client-side PDF parse bypassed to server:', clientErr);
      }
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const data = await safeFetchJson<{
        success: boolean;
        text: string;
        fileName: string;
        error?: string;
      }>('/api/parse-cv', {
        method: 'POST',
        body: formData,
      });

      if (!data.success || !data.text) {
        throw new Error(data.error || 'Failed to extract text from file.');
      }

      setCvText(data.text);
      setCvFileName(data.fileName || file.name);
      setSelectedTestCaseId(null);
    } catch (err: unknown) {
      // Last-chance fallback: Try client extraction if server fails
      if (lowerName.endsWith('.pdf') || file.type.includes('pdf')) {
        try {
          const fallbackClientText = await extractPdfTextInBrowser(file);
          if (fallbackClientText && fallbackClientText.length >= 30) {
            setCvText(fallbackClientText);
            setCvFileName(file.name);
            setSelectedTestCaseId(null);
            setIsParsingCv(false);
            return;
          }
        } catch {}
      }

      const error = err as Error;
      setErrorMessage(
        error.message ||
          'File upload failed. You can also paste your resume text directly using the "Paste Text" button.'
      );
    } finally {
      setIsParsingCv(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleClearCv = () => {
    setCvText('');
    setCvFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePasteJd = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setJobDescription(text);
    } catch {
      // Fallback
    }
  };

  // Generation Handler
  const handleGenerate = async () => {
    // Input validation
    if (!jobDescription.trim()) {
      setErrorMessage('Please enter or paste the target Job Description in Field 1.');
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    if (!cvText.trim()) {
      setErrorMessage('Please upload your existing CV (PDF/DOCX) or select a sample resume in Field 2.');
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);
    setCurrentStep('Extracting qualifications & parsing job requirements...');

    try {
      // Simulation step indicator for UX
      setTimeout(() => {
        setCurrentStep('Analyzing job keywords & identifying match criteria...');
      }, 700);

      setTimeout(() => {
        setCurrentStep('Tailoring bullet points & preserving factual qualifications...');
      }, 1500);

      const result = await safeFetchJson<{
        success: boolean;
        data: TailorResponse;
        error?: string;
      }>('/api/tailor-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvText,
          jobDescription,
          apiKey: geminiApiKey.trim() || undefined,
          linkedInProfile: linkedInProfile || undefined,
        }),
      });

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to tailor resume.');
      }

      setTailorResult(result.data);

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || 'Error occurred while communicating with tailoring service.');
    } finally {
      setIsGenerating(false);
      setCurrentStep('');
    }
  };

  const handleReset = () => {
    setJobDescription('');
    setCvText('');
    setCvFileName('');
    setSelectedTestCaseId(null);
    setLinkedInProfile(null);
    setDetectedLinkedInUrl('');
    setTailorResult(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpdateResume = (updated: TailoredResumeData) => {
    if (tailorResult) {
      setTailorResult({
        ...tailorResult,
        tailoredResume: updated,
      });
    }
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <nav className="app-navbar no-print">
        <div className="brand-wrap">
          <div className="brand-icon-box">
            <Sparkles size={22} />
          </div>
          <div>
            <div className="brand-title">
              ResumePilot AI <span className="brand-badge">Gemini Powered</span>
            </div>
            <div className="brand-subtitle">AI Resume Tailoring &amp; ATS Optimization Engine</div>
          </div>
        </div>

        <div className="nav-actions">
          {/* LinkedIn Verified Status / Trigger */}
          <button
            type="button"
            className={`btn btn-sm ${
              linkedInProfile ? 'btn-linkedin-verified' : 'btn-secondary'
            }`}
            onClick={() => setIsLinkedInModalOpen(true)}
            id="open-linkedin-modal-btn"
            title="Link and verify LinkedIn profile credentials"
          >
            {linkedInProfile ? (
              <>
                <ShieldCheck size={14} className="text-primary-bright" />
                <span>LinkedIn: {linkedInProfile.fullName} ✓</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span>Verify LinkedIn</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setIsKeyModalOpen(true)}
            id="open-api-key-modal-btn"
          >
            <Key size={14} />
            {geminiApiKey ? 'API Key Configured' : 'Configure Gemini Key'}
          </button>

          {(jobDescription || cvText || tailorResult) && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleReset}
              title="Reset all inputs and resume"
            >
              <RotateCcw size={14} /> Reset
            </button>
          )}
        </div>
      </nav>

      {/* Hero Header */}
      <header className="hero-header no-print">
        <div className="hero-pill">
          <Bot size={14} /> 100% Factual Integrity — Preserves Real Experience &amp; Zero Hallucinations
        </div>
        <h1 className="hero-title">Tailor Your Resume to Any Job Description</h1>
        <p className="hero-description">
          Enter the target job description and upload your existing CV. ResumePilot extracts your authentic
          career achievements, reorganizes bullet points with high-impact keywords, and generates a clean,
          ATS-friendly PDF.
        </p>
      </header>

      {/* Quick Test Cases Carousel / One-Click Selectors */}
      <section className="test-cases-banner no-print">
        <div className="test-cases-header">
          <div className="test-cases-title">
            <Zap size={14} className="text-primary" /> One-Click Test Cases (Pre-Loaded Demo Scenarios)
          </div>
          <span className="text-muted text-xs">Click to test instantly without uploading files</span>
        </div>

        <div className="test-cases-grid">
          {SAMPLE_TEST_CASES.map((tc) => (
            <button
              key={tc.id}
              type="button"
              className={`test-case-btn ${selectedTestCaseId === tc.id ? 'active' : ''}`}
              onClick={() => handleSelectTestCase(tc)}
            >
              <div className="test-case-role">
                <span>{tc.title}</span>
                <ArrowRight size={14} />
              </div>
              <div className="test-case-desc">{tc.shortDesc}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Error Message Banner */}
      {errorMessage && (
        <div className="error-banner no-print" role="alert">
          <AlertCircle size={20} />
          <div>{errorMessage}</div>
        </div>
      )}

      {/* Core Dual Inputs (Strictly 2 Input Fields as Requested) */}
      <main className="inputs-container no-print">
        {/* INPUT 1: Job Description */}
        <div className="input-panel-card">
          <div className="panel-header-row">
            <div className="panel-step-badge">
              <span className="step-num">1</span>
              <h2 className="step-title">Job Description</h2>
            </div>
            <div className="nav-actions">
              <button
                type="button"
                className="panel-helper-btn"
                onClick={handlePasteJd}
                title="Paste from clipboard"
              >
                <ClipboardPaste size={14} /> Paste
              </button>
              {jobDescription && (
                <button
                  type="button"
                  className="panel-helper-btn"
                  onClick={() => setJobDescription('')}
                  title="Clear text"
                >
                  <Trash2 size={14} /> Clear
                </button>
              )}
            </div>
          </div>

          <div className="jd-textarea-wrap">
            <textarea
              className="jd-textarea"
              placeholder="Paste the target Job Description (role title, requirements, qualifications, responsibilities)..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              id="job-description-input"
            />
            <div className="textarea-footer">
              <span>Enter full job post for highest ATS keyword precision</span>
              <span>{jobDescription.length} characters</span>
            </div>
          </div>
        </div>

        {/* INPUT 2: Upload Existing CV */}
        <div className="input-panel-card">
          <div className="panel-header-row">
            <div className="panel-step-badge">
              <span className="step-num">2</span>
              <h2 className="step-title">Upload Existing CV</h2>
            </div>
            <div className="nav-actions">
              <button
                type="button"
                className="panel-helper-btn"
                onClick={() => setIsCvPasteMode(!isCvPasteMode)}
                title={isCvPasteMode ? 'Switch to file upload mode' : 'Switch to direct text paste mode'}
              >
                {isCvPasteMode ? <Upload size={14} /> : <ClipboardPaste size={14} />}
                {isCvPasteMode ? 'Upload File' : 'Paste Text'}
              </button>
              {cvText && (
                <button
                  type="button"
                  className="panel-helper-btn"
                  onClick={() => setShowExtractedText(!showExtractedText)}
                >
                  <FileText size={14} /> {showExtractedText ? 'Hide Text' : 'View Text'}
                </button>
              )}
            </div>
          </div>

          {isCvPasteMode ? (
            <div className="jd-textarea-wrap">
              <textarea
                className="jd-textarea"
                placeholder="Paste your existing CV or resume content here (name, contact, summary, skills, work experience, projects, education)..."
                value={cvText}
                onChange={(e) => {
                  setCvText(e.target.value);
                  if (e.target.value.trim().length > 0) {
                    setCvFileName('Direct Resume Input');
                    setSelectedTestCaseId(null);
                  } else {
                    setCvFileName('');
                  }
                }}
                id="cv-direct-textarea"
                rows={7}
              />
              <div className="textarea-footer">
                <span>Direct text mode • Instant processing with zero upload delay</span>
                <span>{cvText.length} characters</span>
              </div>
            </div>
          ) : cvFileName ? (
            <div className="file-uploaded-card">
              <div className="file-info-group">
                <div className="file-type-icon">
                  <FileCheck size={20} />
                </div>
                <div>
                  <div className="file-name">{cvFileName}</div>
                  <div className="file-meta">
                    {cvText.length} characters extracted • Ready for AI tailoring
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn-remove-file"
                onClick={handleClearCv}
                title="Remove uploaded CV"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <div
              className={`upload-dropzone ${isDragOver ? 'drag-active' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              id="cv-upload-dropzone"
            >
              <div className="upload-icon-circle">
                <Upload size={24} />
              </div>
              <div>
                <div className="upload-primary-text">
                  {isParsingCv ? 'Parsing CV document...' : 'Click or drag & drop existing CV'}
                </div>
                <div className="upload-hint-text">
                  Accepts PDF, DOCX, TXT documents or any resume format
                </div>
              </div>

              <div className="format-tags">
                <span className="format-tag">.PDF</span>
                <span className="format-tag">.DOCX</span>
                <span className="format-tag">.TXT</span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                className="file-input-hidden"
                accept=".pdf,.docx,.doc,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
            </div>
          )}

          {/* LinkedIn Account Verification & Sync Bar inside Field 2 */}
          {linkedInProfile ? (
            <div className="linkedin-sync-card">
              <div className="linkedin-sync-info">
                <div className="linkedin-sync-badge">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div className="linkedin-sync-title">
                    <span>LinkedIn Verified: {linkedInProfile.fullName}</span>
                    <span className="badge-verified-inline">Identity &amp; Credentials Authenticated</span>
                  </div>
                  <div className="linkedin-sync-meta">
                    {linkedInProfile.certifications.length} verified certification(s) •{' '}
                    {linkedInProfile.skills.length} endorsed skill(s) linked
                  </div>
                </div>
              </div>
              <div className="linkedin-sync-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-xs"
                  onClick={() => setIsLinkedInModalOpen(true)}
                >
                  Review Details
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-xs"
                  onClick={() => setLinkedInProfile(null)}
                  title="Disconnect LinkedIn profile"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ) : detectedLinkedInUrl ? (
            <div className="linkedin-detected-bar">
              <div className="linkedin-detected-text">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span>LinkedIn Detected in CV: <code>{detectedLinkedInUrl}</code></span>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-xs"
                onClick={() => setIsLinkedInModalOpen(true)}
              >
                <ShieldCheck size={13} /> Verify &amp; Review Credentials
              </button>
            </div>
          ) : (
            <div className="linkedin-prompt-bar">
              <button
                type="button"
                className="linkedin-prompt-btn"
                onClick={() => setIsLinkedInModalOpen(true)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span>Connect &amp; verify LinkedIn account to sync authenticated certifications &amp; skills</span>
              </button>
            </div>
          )}

          {/* Extracted raw text preview modal/accordion */}
          {showExtractedText && cvText && (
            <div className="jd-textarea-wrap">
              <textarea
                className="jd-textarea"
                style={{ minHeight: '140px', fontSize: '12px' }}
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Raw extracted resume text..."
              />
            </div>
          )}
        </div>
      </main>

      {/* Action Button */}
      <div className="action-trigger-bar no-print">
        <button
          type="button"
          className="btn-generate"
          onClick={handleGenerate}
          disabled={isGenerating || isParsingCv}
          id="generate-updated-resume-btn"
        >
          {isGenerating ? (
            <>
              <span className="spinner-border spinner-border-sm" /> Tailoring with AI...
            </>
          ) : (
            <>
              <Sparkles size={20} /> Generate Updated Resume
            </>
          )}
        </button>

        {isGenerating && (
          <div className="action-status-note">
            <Bot size={16} className="text-primary" /> {currentStep}
          </div>
        )}
      </div>

      {/* Results View */}
      {tailorResult && (
        <div ref={resultsRef} id="tailored-results-section">
          {/* Step 1: ATS & Skill Gap Scorecard */}
          <AtsScoreCard
            jdAnalysis={tailorResult.jdAnalysis}
            skillGap={tailorResult.skillGap}
            sourceType={tailorResult.sourceType}
            modelUsed={tailorResult.modelUsed}
            processingTimeMs={tailorResult.processingTimeMs}
            engineNotice={tailorResult.engineNotice}
          />

          {/* Step 2: Tailored Resume Document Preview & Export */}
          <ResumePreview
            initialResume={tailorResult.tailoredResume}
            onUpdate={handleUpdateResume}
          />
        </div>
      )}

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        currentKey={geminiApiKey}
        onSaveKey={handleSaveApiKey}
      />

      {/* LinkedIn Verification Modal */}
      <LinkedInVerificationModal
        isOpen={isLinkedInModalOpen}
        onClose={() => setIsLinkedInModalOpen(false)}
        currentProfile={linkedInProfile}
        onApplyProfile={handleApplyLinkedInProfile}
        detectedUrl={detectedLinkedInUrl}
        activeJobDescription={jobDescription}
      />
    </div>
  );
}
