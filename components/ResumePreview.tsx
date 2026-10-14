'use client';

import React, { useState, useRef } from 'react';
import { TailoredResumeData } from '@/types/resume';
import {
  Download,
  Printer,
  Copy,
  Check,
  Edit3,
  Eye,
  FileCode,
  Sparkles,
  Layout,
  Mail,
  Phone,
  MapPin,
  Link as LinkIcon,
  Code,
  Globe,
  Plus,
  Trash2,
  ShieldCheck,
  Award,
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResumePreviewProps {
  initialResume: TailoredResumeData;
  onUpdate?: (updated: TailoredResumeData) => void;
}

type TemplateStyle = 'modern' | 'executive' | 'minimalist';

export function ResumePreview({ initialResume, onUpdate }: ResumePreviewProps) {
  const [resume, setResume] = useState<TailoredResumeData>(initialResume);
  const [template, setTemplate] = useState<TemplateStyle>('modern');
  const [isEditing, setIsEditing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const resumeContainerRef = useRef<HTMLDivElement>(null);

  // Update internal resume when prop changes
  React.useEffect(() => {
    setResume(initialResume);
  }, [initialResume]);

  const notifyChange = (updated: TailoredResumeData) => {
    setResume(updated);
    if (onUpdate) onUpdate(updated);
  };

  // PDF Download via html2canvas & jsPDF
  const handleDownloadPdf = async () => {
    if (!resumeContainerRef.current) return;
    setIsDownloading(true);

    try {
      const element = resumeContainerRef.current;
      
      // Temporarily ensure high contrast background for canvas capture
      const canvas = await html2canvas(element, {
        scale: 2, // 2x resolution for high-DPI crisp print
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const safeName = (resume.contact.fullName || 'Tailored_Resume')
        .replace(/[^a-zA-Z0-9_-]/g, '_');
      pdf.save(`${safeName}_Tailored_Resume.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      // Fallback to window.print()
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  // High-fidelity Browser Print
  const handlePrint = () => {
    window.print();
  };

  // Copy Plain Text for ATS job forms
  const handleCopyText = () => {
    let text = `${resume.contact.fullName.toUpperCase()}\n`;
    text += `${resume.contact.email} | ${resume.contact.phone} | ${resume.contact.location}\n`;
    if (resume.contact.linkedin) text += `LinkedIn: ${resume.contact.linkedin}\n`;
    if (resume.contact.github) text += `GitHub: ${resume.contact.github}\n`;
    text += `\nTARGET ROLE: ${resume.targetRole}\n\n`;
    text += `PROFESSIONAL SUMMARY\n${resume.professionalSummary}\n\n`;

    text += `TECHNICAL SKILLS\n`;
    resume.skills.forEach((cat) => {
      text += `${cat.categoryName}: ${cat.skills.join(', ')}\n`;
    });
    text += `\nEXPERIENCE\n`;
    resume.experience.forEach((exp) => {
      text += `${exp.role} - ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})\n`;
      exp.bulletPoints.forEach((b) => {
        text += `• ${b}\n`;
      });
      text += `\n`;
    });
    if (resume.projects && resume.projects.length > 0) {
      text += `PROJECTS\n`;
      resume.projects.forEach((proj) => {
        text += `${proj.title}${proj.technologies ? ` (${proj.technologies.join(', ')})` : ''}\n`;
        proj.bulletPoints.forEach((b) => {
          text += `• ${b}\n`;
        });
        text += `\n`;
      });
    }
    if (resume.education && resume.education.length > 0) {
      text += `EDUCATION\n`;
      resume.education.forEach((edu) => {
        text += `${edu.degree} - ${edu.institution} (${edu.startDate || ''} - ${edu.endDate || ''})\n`;
      });
      text += `\n`;
    }
    if (resume.certifications && resume.certifications.length > 0) {
      text += `CERTIFICATIONS & CREDENTIALS\n`;
      resume.certifications.forEach((cert) => {
        text += `${cert.name} - ${cert.issuer}${cert.issueDate ? ` (${cert.issueDate})` : ''}${
          cert.credentialId ? ` [Credential ID: ${cert.credentialId}]` : ''
        }${cert.isLinkedInVerified ? ' [LinkedIn Verified]' : ''}\n`;
      });
      text += `\n`;
    }

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Export JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resume, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${resume.contact.fullName || 'resume'}_structured.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Edit Handlers
  const handleUpdateContact = (field: keyof typeof resume.contact, value: string) => {
    const updated = {
      ...resume,
      contact: {
        ...resume.contact,
        [field]: value,
      },
    };
    notifyChange(updated);
  };

  const handleUpdateSummary = (val: string) => {
    notifyChange({ ...resume, professionalSummary: val });
  };

  const handleUpdateExpBullet = (expIndex: number, bulletIndex: number, val: string) => {
    const newExp = [...resume.experience];
    newExp[expIndex].bulletPoints[bulletIndex] = val;
    notifyChange({ ...resume, experience: newExp });
  };

  const handleAddExpBullet = (expIndex: number) => {
    const newExp = [...resume.experience];
    newExp[expIndex].bulletPoints.push('Delivered measurable impact aligned with core objectives.');
    notifyChange({ ...resume, experience: newExp });
  };

  const handleDeleteExpBullet = (expIndex: number, bulletIndex: number) => {
    const newExp = [...resume.experience];
    newExp[expIndex].bulletPoints.splice(bulletIndex, 1);
    notifyChange({ ...resume, experience: newExp });
  };

  const handleUpdateCert = (certIdx: number, field: string, val: string) => {
    const newCerts = [...(resume.certifications || [])];
    newCerts[certIdx] = { ...newCerts[certIdx], [field]: val };
    notifyChange({ ...resume, certifications: newCerts });
  };

  const handleAddCert = () => {
    const newCerts = [...(resume.certifications || [])];
    newCerts.push({
      name: 'New Professional Certification',
      issuer: 'Certification Authority',
      issueDate: '2024',
    });
    notifyChange({ ...resume, certifications: newCerts });
  };

  const handleDeleteCert = (certIdx: number) => {
    const newCerts = [...(resume.certifications || [])];
    newCerts.splice(certIdx, 1);
    notifyChange({ ...resume, certifications: newCerts });
  };

  return (
    <div className="resume-preview-wrapper">
      {/* Control Toolbar */}
      <div className="resume-toolbar no-print">
        <div className="toolbar-left">
          {/* Template Switcher */}
          <div className="template-picker">
            <span className="toolbar-label">
              <Layout size={14} className="inline-icon" /> Template:
            </span>
            <button
              type="button"
              className={`btn-toggle ${template === 'modern' ? 'active' : ''}`}
              onClick={() => setTemplate('modern')}
            >
              Modern ATS
            </button>
            <button
              type="button"
              className={`btn-toggle ${template === 'executive' ? 'active' : ''}`}
              onClick={() => setTemplate('executive')}
            >
              Executive
            </button>
            <button
              type="button"
              className={`btn-toggle ${template === 'minimalist' ? 'active' : ''}`}
              onClick={() => setTemplate('minimalist')}
            >
              Minimalist
            </button>
          </div>

          {/* Edit Mode Toggle */}
          <button
            type="button"
            className={`btn-mode-toggle ${isEditing ? 'active' : ''}`}
            onClick={() => setIsEditing(!isEditing)}
            title="Toggle inline editing"
          >
            {isEditing ? (
              <>
                <Eye size={14} /> Preview Mode
              </>
            ) : (
              <>
                <Edit3 size={14} /> Edit Mode
              </>
            )}
          </button>
        </div>

        <div className="toolbar-right">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleCopyText}
            title="Copy plain text formatted for job application forms"
          >
            {copiedText ? (
              <>
                <Check size={14} /> Copied!
              </>
            ) : (
              <>
                <Copy size={14} /> Copy Text
              </>
            )}
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleExportJson}
            title="Export resume structured JSON"
          >
            <FileCode size={14} /> JSON
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handlePrint}
            title="Open browser print dialog for high-res vector PDF"
          >
            <Printer size={14} /> Print
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm btn-download"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            id="download-resume-pdf-btn"
          >
            {isDownloading ? (
              <>
                <span className="spinner-border spinner-border-sm" /> Exporting...
              </>
            ) : (
              <>
                <Download size={14} /> Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="edit-mode-banner no-print">
          <Sparkles size={16} />
          <span>Inline Edit Mode is active. Click on fields below to customize any text, bullets, or headers.</span>
        </div>
      )}

      {/* Printable / Renderable Resume Sheet */}
      <div className="resume-sheet-container">
        <div
          ref={resumeContainerRef}
          className={`resume-paper template-${template}`}
          id="printable-resume-paper"
        >
          {/* Header & Contact */}
          <header className="resume-header">
            {isEditing ? (
              <input
                className="edit-input edit-name"
                value={resume.contact.fullName}
                onChange={(e) => handleUpdateContact('fullName', e.target.value)}
                placeholder="Candidate Full Name"
              />
            ) : (
              <h1 className="candidate-name">{resume.contact.fullName}</h1>
            )}

            <div className="candidate-target-role">
              {isEditing ? (
                <input
                  className="edit-input edit-target-role"
                  value={resume.targetRole}
                  onChange={(e) => notifyChange({ ...resume, targetRole: e.target.value })}
                  placeholder="Target Role"
                />
              ) : (
                <span>{resume.targetRole}</span>
              )}
            </div>

            <div className="candidate-contact-bar">
              {isEditing ? (
                <div className="edit-contact-grid">
                  <input
                    className="edit-input-sm"
                    value={resume.contact.email}
                    onChange={(e) => handleUpdateContact('email', e.target.value)}
                    placeholder="Email"
                  />
                  <input
                    className="edit-input-sm"
                    value={resume.contact.phone}
                    onChange={(e) => handleUpdateContact('phone', e.target.value)}
                    placeholder="Phone"
                  />
                  <input
                    className="edit-input-sm"
                    value={resume.contact.location}
                    onChange={(e) => handleUpdateContact('location', e.target.value)}
                    placeholder="Location"
                  />
                  <input
                    className="edit-input-sm"
                    value={resume.contact.linkedin || ''}
                    onChange={(e) => handleUpdateContact('linkedin', e.target.value)}
                    placeholder="LinkedIn URL"
                  />
                  <input
                    className="edit-input-sm"
                    value={resume.contact.github || ''}
                    onChange={(e) => handleUpdateContact('github', e.target.value)}
                    placeholder="GitHub URL"
                  />
                </div>
              ) : (
                <>
                  {resume.contact.email && (
                    <span className="contact-item">
                      <Mail size={12} className="resume-icon" /> {resume.contact.email}
                    </span>
                  )}
                  {resume.contact.phone && (
                    <span className="contact-item">
                      <Phone size={12} className="resume-icon" /> {resume.contact.phone}
                    </span>
                  )}
                  {resume.contact.location && (
                    <span className="contact-item">
                      <MapPin size={12} className="resume-icon" /> {resume.contact.location}
                    </span>
                  )}
                  {resume.contact.linkedin && (
                    <span className="contact-item">
                      <LinkIcon size={12} className="resume-icon" /> {resume.contact.linkedin}
                    </span>
                  )}
                  {resume.contact.github && (
                    <span className="contact-item">
                      <Code size={12} className="resume-icon" /> {resume.contact.github}
                    </span>
                  )}
                  {resume.contact.portfolio && (
                    <span className="contact-item">
                      <Globe size={12} className="resume-icon" /> {resume.contact.portfolio}
                    </span>
                  )}
                </>
              )}
            </div>
          </header>

          {/* Professional Summary */}
          {resume.professionalSummary && (
            <section className="resume-section">
              <h2 className="section-title">Professional Summary</h2>
              {isEditing ? (
                <textarea
                  className="edit-textarea"
                  value={resume.professionalSummary}
                  onChange={(e) => handleUpdateSummary(e.target.value)}
                  rows={3}
                />
              ) : (
                <p className="summary-paragraph">{resume.professionalSummary}</p>
              )}
            </section>
          )}

          {/* Technical Skills */}
          {resume.skills && resume.skills.length > 0 && (
            <section className="resume-section">
              <h2 className="section-title">Technical Skills &amp; Competencies</h2>
              <div className="skills-category-list">
                {resume.skills.map((category, catIdx) => (
                  <div key={catIdx} className="skills-category-row">
                    <span className="skills-category-name">{category.categoryName}:</span>{' '}
                    <span className="skills-items-text">{category.skills.join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Professional Experience */}
          {resume.experience && resume.experience.length > 0 && (
            <section className="resume-section">
              <h2 className="section-title">Professional Experience</h2>
              <div className="experience-list">
                {resume.experience.map((exp, expIdx) => (
                  <div key={expIdx} className="experience-item">
                    <div className="experience-header-row">
                      <div className="exp-left">
                        <strong className="exp-role">{exp.role}</strong>
                        <span className="exp-company-sep">|</span>
                        <span className="exp-company">{exp.company}</span>
                        {exp.location && <span className="exp-location">({exp.location})</span>}
                      </div>
                      <div className="exp-right">
                        <span className="exp-dates">
                          {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate || 'Present'}
                        </span>
                      </div>
                    </div>

                    <ul className="bullet-points-list">
                      {exp.bulletPoints.map((bullet, bIdx) => (
                        <li key={bIdx} className="bullet-item">
                          {isEditing ? (
                            <div className="edit-bullet-row">
                              <input
                                className="edit-input-bullet"
                                value={bullet}
                                onChange={(e) =>
                                  handleUpdateExpBullet(expIdx, bIdx, e.target.value)
                                }
                              />
                              <button
                                type="button"
                                className="btn-icon-danger"
                                onClick={() => handleDeleteExpBullet(expIdx, bIdx)}
                                title="Remove bullet point"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ) : (
                            <span className="bullet-text">{bullet}</span>
                          )}
                        </li>
                      ))}
                    </ul>

                    {isEditing && (
                      <button
                        type="button"
                        className="btn-add-bullet"
                        onClick={() => handleAddExpBullet(expIdx)}
                      >
                        <Plus size={12} /> Add Achievement Bullet
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Notable Projects */}
          {resume.projects && resume.projects.length > 0 && (
            <section className="resume-section">
              <h2 className="section-title">Key Projects &amp; Solutions</h2>
              <div className="projects-list">
                {resume.projects.map((proj, pIdx) => (
                  <div key={pIdx} className="project-item">
                    <div className="project-header-row">
                      <strong className="proj-title">{proj.title}</strong>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <span className="proj-technologies">
                          [{proj.technologies.join(', ')}]
                        </span>
                      )}
                    </div>
                    {proj.description && (
                      <p className="proj-description">{proj.description}</p>
                    )}
                    {proj.bulletPoints && proj.bulletPoints.length > 0 && (
                      <ul className="bullet-points-list">
                        {proj.bulletPoints.map((bullet, bIdx) => (
                          <li key={bIdx} className="bullet-item">
                            <span className="bullet-text">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {resume.education && resume.education.length > 0 && (
            <section className="resume-section">
              <h2 className="section-title">Education</h2>
              <div className="education-list">
                {resume.education.map((edu, eduIdx) => (
                  <div key={eduIdx} className="education-item">
                    <div className="education-header-row">
                      <div className="edu-left">
                        <strong className="edu-degree">{edu.degree}</strong>
                        {edu.fieldOfStudy && (
                          <span className="edu-field"> in {edu.fieldOfStudy}</span>
                        )}
                        <span className="edu-sep">|</span>
                        <span className="edu-institution">{edu.institution}</span>
                      </div>
                      <div className="edu-right">
                        <span className="edu-dates">
                          {edu.startDate ? `${edu.startDate} – ` : ''}
                          {edu.endDate || ''}
                        </span>
                        {edu.gpa && <span className="edu-gpa">GPA: {edu.gpa}</span>}
                      </div>
                    </div>
                    {edu.highlights && edu.highlights.length > 0 && (
                      <div className="edu-highlights">
                        {edu.highlights.join(' • ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {resume.certifications && resume.certifications.length > 0 && (
            <section className="resume-section">
              <h2 className="section-title">Certifications &amp; Credentials</h2>
              <div className="certifications-list">
                {resume.certifications.map((cert, cIdx) => (
                  <div key={cIdx} className="certification-item">
                    {isEditing ? (
                      <div className="edit-cert-row">
                        <input
                          className="edit-input-sm"
                          value={cert.name}
                          onChange={(e) => handleUpdateCert(cIdx, 'name', e.target.value)}
                          placeholder="Certification Name"
                        />
                        <input
                          className="edit-input-sm"
                          value={cert.issuer}
                          onChange={(e) => handleUpdateCert(cIdx, 'issuer', e.target.value)}
                          placeholder="Issuer"
                        />
                        <input
                          className="edit-input-sm"
                          style={{ maxWidth: '120px' }}
                          value={cert.issueDate || ''}
                          onChange={(e) => handleUpdateCert(cIdx, 'issueDate', e.target.value)}
                          placeholder="Date"
                        />
                        <button
                          type="button"
                          className="btn-icon-danger"
                          onClick={() => handleDeleteCert(cIdx)}
                          title="Remove certification"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="cert-display-line">
                        <div className="cert-title-wrap">
                          <strong className="cert-name">{cert.name}</strong>
                          <span className="cert-sep">–</span>
                          <span className="cert-issuer">{cert.issuer}</span>
                          {cert.issueDate && <span className="cert-date"> ({cert.issueDate})</span>}
                          {cert.credentialId && (
                            <span className="cert-credential-id"> [ID: {cert.credentialId}]</span>
                          )}
                        </div>
                        {cert.isLinkedInVerified && (
                          <span className="cert-badge-verified" title="Verified via LinkedIn Profile">
                            <ShieldCheck size={11} /> LinkedIn Verified
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {isEditing && (
                <button
                  type="button"
                  className="btn-add-bullet"
                  onClick={handleAddCert}
                  style={{ marginTop: '8px' }}
                >
                  <Plus size={12} /> Add Certification
                </button>
              )}
            </section>
          )}

          {/* Key Achievements */}
          {resume.achievements && resume.achievements.length > 0 && (
            <section className="resume-section">
              <h2 className="section-title">Honors &amp; Achievements</h2>
              <ul className="bullet-points-list">
                {resume.achievements.map((ach, aIdx) => (
                  <li key={aIdx} className="bullet-item">
                    <span className="bullet-text">{ach}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
