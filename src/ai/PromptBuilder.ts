import { SketchContext } from './AIAdapter';

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  category: 'code' | 'analysis' | 'explanation' | 'custom';
  variables?: string[];
}

export class PromptBuilder {
  private templates: Map<string, PromptTemplate> = new Map();

  constructor() {
    this.initializeDefaultTemplates();
  }

  private initializeDefaultTemplates(): void {
    const defaultTemplates: PromptTemplate[] = [
      {
        id: 'react-component',
        name: 'React Component',
        description: 'Convert UI sketch to React component',
        template: `Convert this UI sketch into a React component. 
Include:
- Proper component structure
- Modern React practices (hooks, functional components)
- Appropriate props and state management
- Clean, readable code with comments
- Responsive design considerations

Please provide the complete component code with necessary imports.`,
        category: 'code',
      },
      {
        id: 'html-css',
        name: 'HTML/CSS',
        description: 'Generate HTML and CSS from layout',
        template: `Convert this layout sketch into HTML and CSS.
Include:
- Semantic HTML structure
- Modern CSS (flexbox/grid where appropriate)
- Responsive design
- Clean, organized code
- Accessibility considerations

Please provide both HTML and CSS code.`,
        category: 'code',
      },
      {
        id: 'ui-analysis',
        name: 'UI Analysis',
        description: 'Analyze UI design and provide feedback',
        template: `Analyze this UI design and provide feedback on:
- User experience and usability
- Visual hierarchy and layout
- Accessibility considerations
- Design consistency and patterns
- Potential improvements

Please provide specific, actionable recommendations.`,
        category: 'analysis',
      },
      {
        id: 'architecture-diagram',
        name: 'Architecture Analysis',
        description: 'Analyze system architecture diagram',
        template: `Analyze this system architecture diagram and provide insights on:
- System components and their relationships
- Data flow and communication patterns
- Potential bottlenecks or issues
- Scalability considerations
- Best practices and recommendations

Please provide a detailed analysis with specific suggestions.`,
        category: 'analysis',
      },
      {
        id: 'code-explanation',
        name: 'Code Explanation',
        description: 'Explain code logic or flow',
        template: `Explain this code diagram or flowchart:
- What does this code/logic do?
- How do the components interact?
- What are the key functions or processes?
- Are there any potential issues or improvements?

Please provide a clear, detailed explanation suitable for documentation.`,
        category: 'explanation',
      },
      {
        id: 'database-schema',
        name: 'Database Schema',
        description: 'Generate database schema from diagram',
        template: `Convert this database design diagram into a SQL schema.
Include:
- CREATE TABLE statements
- Appropriate data types
- Primary and foreign key constraints
- Indexes where beneficial
- Comments explaining relationships

Please provide complete SQL DDL statements.`,
        category: 'code',
      },
    ];

    defaultTemplates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  getTemplate(id: string): PromptTemplate | undefined {
    return this.templates.get(id);
  }

  getTemplatesByCategory(category: string): PromptTemplate[] {
    return Array.from(this.templates.values())
      .filter(template => template.category === category);
  }

  getAllTemplates(): PromptTemplate[] {
    return Array.from(this.templates.values());
  }

  addTemplate(template: PromptTemplate): void {
    this.templates.set(template.id, template);
  }

  removeTemplate(id: string): boolean {
    return this.templates.delete(id);
  }

  buildPrompt(
    templateId: string,
    customPrompt?: string,
    context?: SketchContext,
    variables?: Record<string, string>
  ): string {
    const template = this.getTemplate(templateId);
    
    if (!template) {
      return customPrompt || 'Please analyze this sketch and provide insights.';
    }

    let prompt = template.template;

    // Replace variables if provided
    if (variables && template.variables) {
      template.variables.forEach(variable => {
        if (variables[variable]) {
          prompt = prompt.replace(new RegExp(`{{${variable}}}`, 'g'), variables[variable]);
        }
      });
    }

    // Add custom prompt if provided
    if (customPrompt) {
      prompt += `\n\nAdditional requirements: ${customPrompt}`;
    }

    // Add context information
    if (context) {
      prompt += this.buildContextString(context);
    }

    return prompt;
  }

  private buildContextString(context: SketchContext): string {
    let contextString = '\n\nContext:';
    
    if (context.canvasSize) {
      contextString += `\n- Canvas dimensions: ${context.canvasSize.width}x${context.canvasSize.height}px`;
    }
    
    if (context.selectedElements && context.selectedElements.length > 0) {
      contextString += `\n- Selected elements: ${context.selectedElements.length} items`;
    }
    
    if (context.projectType) {
      contextString += `\n- Project type: ${context.projectType}`;
    }
    
    if (context.additionalContext) {
      contextString += `\n- Additional context: ${context.additionalContext}`;
    }

    return contextString;
  }

  searchTemplates(query: string): PromptTemplate[] {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.templates.values())
      .filter(template => 
        template.name.toLowerCase().includes(lowercaseQuery) ||
        template.description.toLowerCase().includes(lowercaseQuery) ||
        template.template.toLowerCase().includes(lowercaseQuery)
      );
  }

  getQuickPrompts(): string[] {
    return [
      'Convert this to React component',
      'Generate HTML/CSS for this layout',
      'Analyze this UI design',
      'Explain this architecture',
      'Create database schema',
      'Generate TypeScript interfaces',
      'Convert to Vue component',
      'Create API endpoints from this diagram',
    ];
  }
}