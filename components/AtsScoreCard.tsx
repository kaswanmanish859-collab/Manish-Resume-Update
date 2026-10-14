'use client';

import React, { useState } from 'react';
import { JDAnalysis, SkillGapAnalysis } from '@/types/resume';
import {
  CheckCircle2,
  AlertTriangle,
  Award,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Cpu,
  Hash,
} from 'lucide-react';

interface AtsScoreCardProps {
  jdAnalysis: JDAnalysis;
  skillGap: SkillGapAnalysis;
  sourceType: 'gemini' | 'intelligent_fallback';
  modelUsed?: string;
  processingTimeMs?: number;
  engineNotice?: string;
}

export function AtsScoreCard({
  jdAnalysis,
  skillGap,
  sourceType,
  modelUsed,
  processingTimeMs,
  engineNotice,
}: AtsScoreCardProps) {
  const [showAllKeywords, setShowAllKeywords] = useState(false);
  const score = skillGap.matchScore;

  // Determine score color
  const getScoreColor = (val: number) => {
    if (val >= 85) return 'score-high';
    if (val >= 70) return 'score-medium';
    return 'score-low';
  };

  const getScoreLabel = (val: number) => {
    if (val >= 90) return 'Exceptional Match';
    if (val >= 80) return 'Strong Match';
    if (val >= 70) return 'Good Alignment';
    return 'Moderate Alignment';
  };

  const displayedKeywords = showAllKeywords
    ? skillGap.atsKeywordFrequencyMatches
    : skillGap.atsKeywordFrequencyMatches.slice(0, 10);

  const formatModelBadge = () => {
    if (sourceType === 'gemini') {
      if (modelUsed) return `Gemini (${modelUsed.replace('gemini-', '')})`;
      return 'Google Gemini AI';
    }
    return modelUsed || 'Intelligent ATS Engine';
  };

  return (
    <div className="ats-scorecard-card">
      {engineNotice && (
        <div
          style={{
            marginBottom: '16px',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            color: '#60a5fa',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Lightbulb size={16} />
          <span>{engineNotice}</span>
        </div>
      )}

      <div className="ats-scorecard-header">
        <div>
          <div className="ats-badge-row">
            <span className="badge badge-accent">
              <Cpu size={12} className="inline-icon" /> {formatModelBadge()}
            </span>
            <span className="badge badge-neutral">
              Target: {jdAnalysis.targetRole || 'Identified Role'}
            </span>
            {jdAnalysis.seniorityLevel && (
              <span className="badge badge-neutral">{jdAnalysis.seniorityLevel}</span>
            )}
            {processingTimeMs && (
              <span className="text-muted text-xs">{(processingTimeMs / 1000).toFixed(2)}s</span>
            )}
          </div>
          <h2 className="ats-card-title">ATS Keyword &amp; Skill Gap Analysis</h2>
          <p className="ats-card-subtitle">
            Evaluated against job requirements. Qualifications preserved without hallucination.
          </p>
        </div>

        {/* Circular / Gauge Score */}
        <div className={`score-gauge-box ${getScoreColor(score)}`}>
          <div className="score-value">{score}%</div>
          <div className="score-label">{getScoreLabel(score)}</div>
        </div>
      </div>

      <div className="ats-grid">
        {/* Matched Skills */}
        <div className="ats-panel">
          <div className="panel-title-row text-success">
            <CheckCircle2 size={18} />
            <span className="panel-title">
              Matched Skills ({skillGap.matchedSkills.length})
            </span>
          </div>
          <p className="panel-description">
            Skills present in candidate CV and emphasized in the tailored resume:
          </p>
          <div className="chips-container">
            {skillGap.matchedSkills.map((skill, idx) => (
              <span key={idx} className="chip chip-success">
                <CheckCircle2 size={12} className="inline-icon" /> {skill}
              </span>
            ))}
            {skillGap.matchedSkills.length === 0 && (
              <span className="text-muted text-sm">No direct technical skill matches identified.</span>
            )}
          </div>
        </div>

        {/* Missing Skills from JD */}
        <div className="ats-panel">
          <div className="panel-title-row text-warning">
            <AlertTriangle size={18} />
            <span className="panel-title">
              Missing from CV ({skillGap.missingSkills.length})
            </span>
          </div>
          <p className="panel-description">
            Job requirements not found in candidate CV (honestly flagged, NOT fabricated):
          </p>
          <div className="chips-container">
            {skillGap.missingSkills.map((skill, idx) => (
              <span key={idx} className="chip chip-warning">
                <AlertTriangle size={12} className="inline-icon" /> {skill}
              </span>
            ))}
            {skillGap.missingSkills.length === 0 && (
              <span className="chip chip-success">All prominent JD skills matched!</span>
            )}
          </div>
        </div>
      </div>

      {/* Strengths & Improvement Suggestions */}
      <div className="ats-insights-row">
        {skillGap.strengths && skillGap.strengths.length > 0 && (
          <div className="insight-box insight-box-strengths">
            <div className="insight-header">
              <Award size={16} className="text-primary" />
              <span>Key Strengths Highlighted</span>
            </div>
            <ul className="insight-list">
              {skillGap.strengths.map((str, idx) => (
                <li key={idx}>{str}</li>
              ))}
            </ul>
          </div>
        )}

        {skillGap.improvementSuggestions && skillGap.improvementSuggestions.length > 0 && (
          <div className="insight-box insight-box-suggestions">
            <div className="insight-header">
              <Lightbulb size={16} className="text-warning" />
              <span>Actionable Recommendations</span>
            </div>
            <ul className="insight-list">
              {skillGap.improvementSuggestions.map((sug, idx) => (
                <li key={idx}>{sug}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ATS Keyword Checklist */}
      {skillGap.atsKeywordFrequencyMatches && skillGap.atsKeywordFrequencyMatches.length > 0 && (
        <div className="keyword-checklist-wrap">
          <div
            className="keyword-checklist-header"
            onClick={() => setShowAllKeywords(!showAllKeywords)}
          >
            <div className="keyword-checklist-title">
              <Hash size={16} className="text-primary" />
              <span>ATS Keyword Match Checklist</span>
              <span className="badge badge-sm badge-neutral">
                {skillGap.atsKeywordFrequencyMatches.filter((k) => k.matchedInResume).length} /{' '}
                {skillGap.atsKeywordFrequencyMatches.length} Found
              </span>
            </div>
            <button
              type="button"
              className="btn-text-action"
              aria-label="Toggle keyword checklist"
            >
              {showAllKeywords ? (
                <>
                  Show Less <ChevronUp size={14} />
                </>
              ) : (
                <>
                  View All ({skillGap.atsKeywordFrequencyMatches.length}) <ChevronDown size={14} />
                </>
              )}
            </button>
          </div>

          <div className="keyword-checklist-chips">
            {displayedKeywords.map((item, idx) => (
              <span
                key={idx}
                className={`keyword-status-chip ${item.matchedInResume ? 'matched' : 'missing'}`}
              >
                {item.matchedInResume ? '✓' : '✗'} {item.keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
