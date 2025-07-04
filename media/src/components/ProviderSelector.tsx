import React, { useState, useCallback } from 'react';

interface Provider {
  id: string;
  name: string;
  description: string;
  isConfigured: boolean;
  supportsVision: boolean;
  icon: string;
}

interface ProviderSelectorProps {
  selectedProvider: string;
  onProviderChange: (providerId: string) => void;
  disabled?: boolean;
}

const AVAILABLE_PROVIDERS: Provider[] = [
  {
    id: 'openai',
    name: 'OpenAI GPT-4',
    description: 'GPT-4 Vision with advanced code generation',
    isConfigured: true, // This will be determined dynamically
    supportsVision: true,
    icon: '🤖',
  },
  {
    id: 'claude',
    name: 'Claude 3.5 Sonnet',
    description: 'Anthropic Claude with vision capabilities',
    isConfigured: false,
    supportsVision: true,
    icon: '🧠',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Google Gemini Vision model',
    isConfigured: false,
    supportsVision: true,
    icon: '✨',
  },
];

export const ProviderSelector: React.FC<ProviderSelectorProps> = ({
  selectedProvider,
  onProviderChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedProviderData = AVAILABLE_PROVIDERS.find(p => p.id === selectedProvider);

  const handleProviderSelect = useCallback((providerId: string) => {
    onProviderChange(providerId);
    setIsOpen(false);
  }, [onProviderChange]);

  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  }, [disabled, isOpen]);

  return (
    <div className="provider-selector">
      <button
        className={`provider-button ${isOpen ? 'open' : ''}`}
        onClick={handleToggle}
        disabled={disabled}
      >
        <span className="provider-icon">{selectedProviderData?.icon}</span>
        <span className="provider-name">{selectedProviderData?.name}</span>
        <span className="dropdown-arrow">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && (
        <div className="provider-dropdown">
          <div className="provider-dropdown-header">
            <span>Select AI Provider</span>
            <button
              className="close-button"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>
          
          <div className="provider-list">
            {AVAILABLE_PROVIDERS.map((provider) => (
              <div
                key={provider.id}
                className={`provider-item ${
                  selectedProvider === provider.id ? 'selected' : ''
                } ${!provider.isConfigured ? 'disabled' : ''}`}
                onClick={() => provider.isConfigured && handleProviderSelect(provider.id)}
              >
                <div className="provider-info">
                  <div className="provider-header">
                    <span className="provider-icon">{provider.icon}</span>
                    <span className="provider-name">{provider.name}</span>
                    {provider.isConfigured ? (
                      <span className="status-badge configured">✓</span>
                    ) : (
                      <span className="status-badge not-configured">⚠️</span>
                    )}
                  </div>
                  <div className="provider-description">{provider.description}</div>
                  <div className="provider-capabilities">
                    {provider.supportsVision && (
                      <span className="capability-badge">👁️ Vision</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="provider-dropdown-footer">
            <button 
              className="config-button"
              onClick={() => {
                setIsOpen(false);
                // This would open configuration dialog
              }}
            >
              ⚙️ Configure Providers
            </button>
          </div>
        </div>
      )}
    </div>
  );
};