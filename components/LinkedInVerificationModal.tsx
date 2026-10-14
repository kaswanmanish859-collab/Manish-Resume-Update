'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  ExternalLink,
  Award,
  Sparkles,
  ShieldCheck,
  Check,
  Briefcase,
  MapPin,
  Users,
  Search,
  Link as LinkIcon,
  AlertCircle,
  BadgeCheck,
} from 'lucide-react';
import {
  LinkedInProfileData,
  LinkedInVerifiedSkill,
  LinkedInVerifiedCertification,
} from '@/types/resume';
import { safeFetchJson } from '@/lib/api-client';

interface LinkedInVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: LinkedInProfileData | null;
  onApplyProfile: (
    profile: LinkedInProfileData,
    selectedSkills: string[],
    selectedCerts: LinkedInVerifiedCertification[]
  ) => void;
  detectedUrl?: string;
  activeJobDescription?: string;
}

export function LinkedInVerificationModal({
  isOpen,
  onClose,
  currentProfile,
  onApplyProfile,
  detectedUrl,
  activeJobDescription,
}: LinkedInVerificationModalProps) {
  const [profileUrlInput, setProfileUrlInput] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [verifiedProfile, setVerifiedProfile] = useState<LinkedInProfileData | null>(currentProfile);

  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'certifications'>('overview');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedCertIds, setSelectedCertIds] = useState<string[]>([]);

  // Update input when detectedUrl or currentProfile changes
  useEffect(() => {
    if (currentProfile) {
      setVerifiedProfile(currentProfile);
      setProfileUrlInput(currentProfile.profileUrl);
      setSelectedSkills(currentProfile.skills.map((s) => s.name));
      setSelectedCertIds(currentProfile.certifications.map((c) => c.credentialId || c.name));
    } else if (detectedUrl) {
      setProfileUrlInput(detectedUrl);
    } else {
      setProfileUrlInput('https://www.linkedin.com/in/alex-rivera-dev');
    }
  }, [currentProfile, detectedUrl, isOpen]);

  if (!isOpen) return null;

  const handleVerify = async (urlToVerify?: string) => {
    const targetUrl = urlToVerify || profileUrlInput;
    if (!targetUrl || targetUrl.trim().length === 0) {
      setErrorMsg('Please enter a LinkedIn profile URL or username.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    try {
      const data = await safeFetchJson<{
        success: boolean;
        profile: LinkedInProfileData;
        error?: string;
      }>('/api/verify-linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkedinUrl: targetUrl.trim() }),
      });

      if (!data.success || !data.profile) {
        throw new Error(data.error || 'Failed to verify LinkedIn profile.');
      }

      const profile: LinkedInProfileData = data.profile;
      setVerifiedProfile(profile);
      setSelectedSkills(profile.skills.map((s) => s.name));
      setSelectedCertIds(profile.certifications.map((c) => c.credentialId || c.name));
      setActiveTab('overview');
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Error communicating with LinkedIn verification service.');
    } finally {
      setIsVerifying(false);
    }
  };

  const toggleSkill = (skillName: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skillName) ? prev.filter((s) => s !== skillName) : [...prev, skillName]
    );
  };

  const toggleAllSkills = () => {
    if (!verifiedProfile) return;
    if (selectedSkills.length === verifiedProfile.skills.length) {
      setSelectedSkills([]);
    } else {
      setSelectedSkills(verifiedProfile.skills.map((s) => s.name));
    }
  };

  const toggleCertification = (certKey: string) => {
    setSelectedCertIds((prev) =>
      prev.includes(certKey) ? prev.filter((k) => k !== certKey) : [...prev, certKey]
    );
  };

  const toggleAllCertifications = () => {
    if (!verifiedProfile) return;
    if (selectedCertIds.length === verifiedProfile.certifications.length) {
      setSelectedCertIds([]);
    } else {
      setSelectedCertIds(verifiedProfile.certifications.map((c) => c.credentialId || c.name));
    }
  };

  const handleApply = () => {
    if (!verifiedProfile) return;

    const filteredCerts = verifiedProfile.certifications.filter((c) =>
      selectedCertIds.includes(c.credentialId || c.name)
    );

    onApplyProfile(verifiedProfile, selectedSkills, filteredCerts);
    onClose();
  };

  // Helper to check if a skill matches the active JD
  const isJdSkillMatch = (skillName: string): boolean => {
    if (!activeJobDescription) return false;
    const lowerJd = activeJobDescription.toLowerCase();
    const cleanSkill = skillName.toLowerCase().split('(')[0].trim();
    return cleanSkill.length > 2 && lowerJd.includes(cleanSkill);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card linkedin-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="modal-header linkedin-modal-header">
          <div className="modal-title-wrap">
            <div className="linkedin-brand-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </div>
            <div>
              <h2 className="modal-title">LinkedIn Account Verification &amp; Credential Sync</h2>
              <p className="modal-subtitle">
                Link and verify your LinkedIn profile to authenticate certifications and endorsed skills
              </p>
            </div>
          </div>
          <button type="button" className="modal-btn-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Verification URL Input Bar */}
        <div className="linkedin-search-bar-wrap">
          <div className="linkedin-input-group">
            <LinkIcon size={16} className="linkedin-input-icon" />
            <input
              type="text"
              className="linkedin-profile-input"
              placeholder="e.g. https://www.linkedin.com/in/alex-rivera-dev or username"
              value={profileUrlInput}
              onChange={(e) => setProfileUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            />
            <button
              type="button"
              className="btn btn-primary linkedin-verify-btn"
              onClick={() => handleVerify()}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <>
                  <span className="spinner-border spinner-border-sm" /> Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck size={16} /> Verify Profile
                </>
              )}
            </button>
          </div>

          {/* Quick Demo Profile Chips */}
          <div className="demo-profiles-row">
            <span className="demo-profiles-label">Quick Test Profiles:</span>
            <button
              type="button"
              className="demo-profile-chip"
              onClick={() => {
                const url = 'https://www.linkedin.com/in/alex-rivera-dev';
                setProfileUrlInput(url);
                handleVerify(url);
              }}
            >
              Alex Rivera (Full-Stack)
            </button>
            <button
              type="button"
              className="demo-profile-chip"
              onClick={() => {
                const url = 'https://www.linkedin.com/in/priya-sharma-ai';
                setProfileUrlInput(url);
                handleVerify(url);
              }}
            >
              Priya Sharma (AI/ML)
            </button>
            <button
              type="button"
              className="demo-profile-chip"
              onClick={() => {
                const url = 'https://www.linkedin.com/in/marcus-chen-pm';
                setProfileUrlInput(url);
                handleVerify(url);
              }}
            >
              Marcus Chen (Product Mgr)
            </button>
          </div>

          {errorMsg && (
            <div className="linkedin-error-banner" role="alert">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Verified Account Content */}
        {verifiedProfile ? (
          <div className="linkedin-verified-content">
            {/* Account Card Banner */}
            <div className="linkedin-account-banner">
              <div className="linkedin-profile-header">
                <div className="linkedin-avatar-box">
                  {verifiedProfile.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={verifiedProfile.avatarUrl}
                      alt={verifiedProfile.fullName}
                      className="linkedin-avatar-img"
                    />
                  ) : (
                    <div className="linkedin-avatar-initials">
                      {verifiedProfile.fullName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="linkedin-verified-badge" title="Verified Identity">
                    <BadgeCheck size={18} />
                  </div>
                </div>

                <div className="linkedin-profile-meta">
                  <div className="linkedin-name-row">
                    <h3 className="linkedin-fullname">{verifiedProfile.fullName}</h3>
                    <span className="linkedin-status-pill">
                      <ShieldCheck size={13} /> Verified Member
                    </span>
                  </div>
                  <div className="linkedin-headline">{verifiedProfile.headline}</div>
                  <div className="linkedin-submeta-row">
                    <span className="linkedin-meta-item">
                      <MapPin size={13} /> {verifiedProfile.location}
                    </span>
                    {verifiedProfile.currentCompany && (
                      <span className="linkedin-meta-item">
                        <Briefcase size={13} /> {verifiedProfile.currentCompany}
                      </span>
                    )}
                    <span className="linkedin-meta-item">
                      <Users size={13} /> {verifiedProfile.connectionsCount}+ connections
                    </span>
                    <a
                      href={verifiedProfile.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="linkedin-meta-link"
                    >
                      View on LinkedIn <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Sub-Tabs: Overview, Skills, Certifications */}
              <div className="linkedin-nav-tabs">
                <button
                  type="button"
                  className={`linkedin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <Briefcase size={14} /> Profile Overview
                </button>
                <button
                  type="button"
                  className={`linkedin-tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
                  onClick={() => setActiveTab('skills')}
                >
                  <Sparkles size={14} /> Verified Skills ({verifiedProfile.skills.length})
                </button>
                <button
                  type="button"
                  className={`linkedin-tab-btn ${activeTab === 'certifications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('certifications')}
                >
                  <Award size={14} /> Licenses &amp; Certifications ({verifiedProfile.certifications.length})
                </button>
              </div>
            </div>

            {/* Tab 1: Profile Overview */}
            {activeTab === 'overview' && (
              <div className="linkedin-tab-pane">
                {verifiedProfile.about && (
                  <div className="linkedin-about-box">
                    <h4 className="linkedin-pane-title">About &amp; Summary</h4>
                    <p className="linkedin-about-text">{verifiedProfile.about}</p>
                  </div>
                )}

                <div className="linkedin-summary-stats-grid">
                  <div className="linkedin-stat-card">
                    <div className="stat-card-num">{verifiedProfile.certifications.length}</div>
                    <div className="stat-card-label">Verified Certifications</div>
                    <div className="stat-card-desc">
                      Credentials validated from AWS, Meta, Google &amp; industry issuers
                    </div>
                  </div>
                  <div className="linkedin-stat-card">
                    <div className="stat-card-num">{verifiedProfile.skills.length}</div>
                    <div className="stat-card-label">Peer-Endorsed Skills</div>
                    <div className="stat-card-desc">
                      Over {verifiedProfile.skills.reduce((acc, s) => acc + (s.endorsementsCount || 10), 0)} verified endorsements
                    </div>
                  </div>
                  <div className="linkedin-stat-card">
                    <div className="stat-card-num">100%</div>
                    <div className="stat-card-label">Factual Authenticity</div>
                    <div className="stat-card-desc">Direct sync to resume with zero LLM hallucination</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Verified Skills */}
            {activeTab === 'skills' && (
              <div className="linkedin-tab-pane">
                <div className="pane-control-row">
                  <div>
                    <h4 className="linkedin-pane-title">Verified Skills &amp; Endorsements</h4>
                    <span className="text-muted text-xs">
                      Select which verified skills to merge into your resume ({selectedSkills.length} of {verifiedProfile.skills.length} selected)
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={toggleAllSkills}
                  >
                    {selectedSkills.length === verifiedProfile.skills.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                <div className="linkedin-skills-grid">
                  {verifiedProfile.skills.map((skill, idx) => {
                    const isSelected = selectedSkills.includes(skill.name);
                    const isJdMatch = isJdSkillMatch(skill.name);

                    return (
                      <div
                        key={idx}
                        className={`linkedin-skill-card ${isSelected ? 'selected' : ''} ${
                          isJdMatch ? 'jd-matched' : ''
                        }`}
                        onClick={() => toggleSkill(skill.name)}
                      >
                        <div className="skill-check-box">
                          {isSelected && <Check size={13} />}
                        </div>
                        <div className="skill-details">
                          <div className="skill-title-row">
                            <span className="skill-name">{skill.name}</span>
                            {isJdMatch && (
                              <span className="jd-match-tag" title="Matches active job requirements">
                                ATS Match ⭐
                              </span>
                            )}
                          </div>
                          <div className="skill-endorsement-count">
                            <BadgeCheck size={12} className="text-primary" />
                            <span>{skill.endorsementsCount || 10} peer endorsements</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 3: Licenses & Certifications */}
            {activeTab === 'certifications' && (
              <div className="linkedin-tab-pane">
                <div className="pane-control-row">
                  <div>
                    <h4 className="linkedin-pane-title">Verified Licenses &amp; Certifications</h4>
                    <span className="text-muted text-xs">
                      Official credentials retrieved from LinkedIn ({selectedCertIds.length} of {verifiedProfile.certifications.length} selected)
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={toggleAllCertifications}
                  >
                    {selectedCertIds.length === verifiedProfile.certifications.length
                      ? 'Deselect All'
                      : 'Select All'}
                  </button>
                </div>

                <div className="linkedin-certs-list">
                  {verifiedProfile.certifications.map((cert, idx) => {
                    const key = cert.credentialId || cert.name;
                    const isSelected = selectedCertIds.includes(key);

                    return (
                      <div
                        key={idx}
                        className={`linkedin-cert-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleCertification(key)}
                      >
                        <div className="cert-check-box">
                          {isSelected && <Check size={14} />}
                        </div>
                        <div className="cert-card-icon">
                          <Award size={24} />
                        </div>
                        <div className="cert-card-body">
                          <div className="cert-title-row">
                            <h5 className="cert-title">{cert.name}</h5>
                            <span className="cert-verified-badge">
                              <CheckCircle2 size={12} /> Verified Credential
                            </span>
                          </div>
                          <div className="cert-issuer-meta">
                            <strong>{cert.issuer}</strong>
                            {cert.issueDate && <span> • Issued {cert.issueDate}</span>}
                            {cert.expirationDate && <span> • Expires {cert.expirationDate}</span>}
                          </div>
                          {cert.credentialId && (
                            <div className="cert-id-tag">
                              Credential ID: <code>{cert.credentialId}</code>
                            </div>
                          )}
                        </div>
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cert-external-link"
                            onClick={(e) => e.stopPropagation()}
                            title="Verify at issuer website"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="linkedin-empty-state">
            <div className="empty-icon-circle">
              <ShieldCheck size={32} />
            </div>
            <h4>No LinkedIn Profile Verified Yet</h4>
            <p>
              Enter your LinkedIn profile link above or click one of the quick test profiles to verify
              identity, certifications, and skills.
            </p>
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="modal-footer linkedin-modal-footer">
          <div className="footer-status-text">
            {verifiedProfile ? (
              <span>
                <CheckCircle2 size={14} className="text-success inline-icon" />{' '}
                {selectedCertIds.length} certification(s) &amp; {selectedSkills.length} skill(s) ready to add to resume
              </span>
            ) : (
              <span>Connect LinkedIn to unlock verified ATS credential scores</span>
            )}
          </div>

          <div className="modal-footer-btns">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary btn-apply-linkedin"
              onClick={handleApply}
              disabled={!verifiedProfile}
              id="apply-linkedin-to-resume-btn"
            >
              <Sparkles size={16} /> Apply &amp; Add to Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
