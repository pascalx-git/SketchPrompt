import React, { useState, useCallback, useRef } from 'react';

interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  category: 'code' | 'analysis' | 'explanation' | 'custom';
}

interface PromptInputProps {
  onSubmit: (request: { prompt: string; templateId?: string; useSelection?: boolean }) => void;
  disabled?: boolean;
  placeholder?: string;
}

const DEFAULT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'react-component',
    name: 'React Component',
    description: 'Convert UI sketch to React component',
    template: 'Convert this UI sketch into a React component with proper structure and modern practices.',
    category: 'code',
  },
  {
    id: 'html-css',
    name: 'HTML/CSS',
    description: 'Generate HTML and CSS from layout',
    template: 'Convert this layout sketch into HTML and CSS with responsive design.',
    category: 'code',
  },
  {
    id: 'ui-analysis',
    name: 'UI Analysis',
    description: 'Analyze UI design and provide feedback',
    template: 'Analyze this UI design and provide feedback on usability, accessibility, and improvements.',
    category: 'analysis',
  },
  {
    id: 'code-explanation',
    name: 'Code Explanation',
    description: 'Explain code logic or flow',
    template: 'Explain this code diagram or flowchart in detail.',
    category: 'explanation',
  },
];

export const PromptInput: React.FC<PromptInputProps> = ({
  onSubmit,
  disabled = false,
  placeholder = 'Enter your prompt...',
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [useSelection, setUseSelection] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim() && !selectedTemplate) {
      return;
    }

    const finalPrompt = selectedTemplate 
      ? DEFAULT_TEMPLATES.find(t => t.id === selectedTemplate)?.template || prompt
      : prompt;

    onSubmit({
      prompt: finalPrompt,
      templateId: selectedTemplate || undefined,
      useSelection,
    });

    if (!selectedTemplate) {
      setPrompt('');
    }
  }, [prompt, selectedTemplate, useSelection, onSubmit]);

  const handleTemplateSelect = useCallback((templateId: string) => {
    setSelectedTemplate(templateId);
    const template = DEFAULT_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setPrompt(template.template);
    }
    setShowTemplates(false);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  return (
    <div className="prompt-input">
      <div className="prompt-input-header">
        <div className="template-selector">
          <button
            type="button"
            onClick={() => setShowTemplates(!showTemplates)}
            className="template-button"
            disabled={disabled}
          >
            📋 Templates
          </button>
          
          {showTemplates && (
            <div className="template-dropdown">
              <div className="template-dropdown-header">
                <span>Select a template</span>
                <button onClick={() => setShowTemplates(false)}>×</button>
              </div>
              <div className="template-list">
                {DEFAULT_TEMPLATES.map((template) => (
                  <div
                    key={template.id}
                    className={`template-item ${selectedTemplate === template.id ? 'selected' : ''}`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <div className="template-name">{template.name}</div>
                    <div className="template-description">{template.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="selection-toggle">
          <label>
            <input
              type="checkbox"
              checked={useSelection}
              onChange={(e) => setUseSelection(e.target.checked)}
              disabled={disabled}
            />
            Use selected area
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="prompt-form">
        <div className="prompt-textarea-container">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="prompt-textarea"
            rows={3}
          />
          
          {selectedTemplate && (
            <div className="selected-template-indicator">
              <span className="template-name">
                {DEFAULT_TEMPLATES.find(t => t.id === selectedTemplate)?.name}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedTemplate('');
                  setPrompt('');
                }}
                className="clear-template"
              >
                ×
              </button>
            </div>
          )}
        </div>

        <div className="prompt-actions">
          <div className="quick-actions">
            <button
              type="button"
              onClick={() => handleTemplateSelect('react-component')}
              className="quick-action"
              disabled={disabled}
            >
              React
            </button>
            <button
              type="button"
              onClick={() => handleTemplateSelect('html-css')}
              className="quick-action"
              disabled={disabled}
            >
              HTML/CSS
            </button>
            <button
              type="button"
              onClick={() => handleTemplateSelect('ui-analysis')}
              className="quick-action"
              disabled={disabled}
            >
              Analyze
            </button>
          </div>

          <button
            type="submit"
            disabled={disabled || (!prompt.trim() && !selectedTemplate)}
            className="submit-button"
          >
            {disabled ? 'Processing...' : 'Generate'}
          </button>
        </div>
      </form>
    </div>
  );
};