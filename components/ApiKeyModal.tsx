'use client';

import React, { useState, useEffect } from 'react';
import { Key, X, Check, ExternalLink, ShieldCheck, Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { safeFetchJson } from '@/lib/api-client';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentKey: string;
  onSaveKey: (key: string) => void;
}

export function ApiKeyModal({ isOpen, onClose, currentKey, onSaveKey }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState(currentKey);
  const [savedNotice, setSavedNotice] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    tested: boolean;
    valid?: boolean;
    model?: string;
    error?: string;
  }>({ tested: false });

  useEffect(() => {
    setApiKey(currentKey);
    setValidationResult({ tested: false });
  }, [currentKey, isOpen]);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    const cleaned = apiKey.trim().replace(/^["']|["']$/g, '');
    if (!cleaned) {
      setValidationResult({
        tested: true,
        valid: false,
        error: 'Please enter an API key before testing.',
      });
      return;
    }

    setIsValidating(true);
    setValidationResult({ tested: false });

    try {
      const data = await safeFetchJson<{
        success: boolean;
        valid: boolean;
        model?: string;
        error?: string;
      }>('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: cleaned }),
      });

      if (data.valid) {
        setValidationResult({
          tested: true,
          valid: true,
          model: data.model,
        });
      } else {
        setValidationResult({
          tested: true,
          valid: false,
          error: data.error || 'Failed to validate API key with Google Gemini.',
        });
      }
    } catch (err: unknown) {
      const error = err as Error;
      setValidationResult({
        tested: true,
        valid: false,
        error: error.message || 'Network error while contacting validation endpoint.',
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = () => {
    const cleaned = apiKey.trim().replace(/^["']|["']$/g, '');
    onSaveKey(cleaned);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setApiKey('');
    setValidationResult({ tested: false });
    onSaveKey('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <Key size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="modal-title">Google Gemini API Configuration</h3>
              <p className="modal-subtitle">Configure your API key or use the built-in intelligent engine</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="notice-box">
            <ShieldCheck size={20} className="notice-icon text-success" />
            <div>
              <strong>Client-Side Storage:</strong> Your API key is stored securely in your browser&apos;s local storage and used directly for Google Gemini API requests.
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="gemini-key-input" className="form-label">
              Gemini API Key
            </label>
            <div className="input-group">
              <input
                id="gemini-key-input"
                type="password"
                className="form-input"
                placeholder="AQ.Ab... or AIzaSy..."
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  if (validationResult.tested) setValidationResult({ tested: false });
                }}
              />
              {apiKey && (
                <button
                  type="button"
                  className="btn-clear-inline"
                  onClick={handleClear}
                  title="Clear API key"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="api-key-actions-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={handleTestKey}
                disabled={isValidating || !apiKey.trim()}
                style={{ fontSize: '12px', padding: '4px 10px' }}
              >
                {isValidating ? (
                  <>
                    <Loader2 size={13} className="animate-spin inline-icon" /> Testing Connection...
                  </>
                ) : (
                  <>
                    <Sparkles size={13} className="inline-icon" /> Test Connection
                  </>
                )}
              </button>

              <p className="form-hint" style={{ margin: 0 }}>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-link"
                >
                  Get a free key from Google AI Studio <ExternalLink size={12} className="inline-icon" />
                </a>
              </p>
            </div>

            {/* Validation Feedback */}
            {validationResult.tested && (
              <div
                style={{
                  marginTop: '10px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: validationResult.valid ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${validationResult.valid ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  color: validationResult.valid ? '#22c55e' : '#ef4444',
                }}
              >
                {validationResult.valid ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>
                      <strong>Connected!</strong> Google Gemini verified successfully ({validationResult.model || 'Gemini Active'}).
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} />
                    <span>{validationResult.error}</span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="engine-status-box">
            <div className="engine-status-header">
              <Sparkles size={16} className="text-primary" />
              <span>Current Engine Mode:</span>
            </div>
            <p className="engine-status-text">
              {apiKey.trim() ? (
                <span className="badge-active">Active: Custom Google Gemini API Key</span>
              ) : (
                <span className="badge-fallback">Active: Built-in Intelligent ATS Engine (Ready to use without a key!)</span>
              )}
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            {savedNotice ? (
              <>
                <Check size={16} /> Saved!
              </>
            ) : (
              'Save Key'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
