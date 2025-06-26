import { pageData } from '@/types/types';
import { z } from 'zod';

// Enhanced interfaces and types
export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  isCustom: boolean;
  isPremium: boolean;
  usageCount: number;
  rating: number;
  thumbnail?: string;
  previewUrl?: string;
}

export interface Template extends TemplateMetadata {
  styles: pageData['styles'];
  elements: pageData['elements'];
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
  templateCount: number;
}

export interface SearchFilters {
  category?: string;
  tags?: string[];
  isPremium?: boolean;
  isCustom?: boolean;
  rating?: number;
  sortBy?: 'name' | 'createdAt' | 'usageCount' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface TemplateStats {
  totalTemplates: number;
  categoriesCount: number;
  customTemplates: number;
  premiumTemplates: number;
  averageRating: number;
}

// Validation schemas
const TemplateStylesSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
});

const TemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(100, 'Name too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).max(10, 'Too many tags'),
  styles: TemplateStylesSchema,
  elements: z.any(), // You might want to create a more specific schema for elements
});

// Custom errors
export class TemplateError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'TemplateError';
  }
}

export class TemplateNotFoundError extends TemplateError {
  constructor(id: string) {
    super(`Template with id "${id}" not found`, 'TEMPLATE_NOT_FOUND');
  }
}

export class TemplateValidationError extends TemplateError {
  constructor(message: string) {
    super(message, 'TEMPLATE_VALIDATION_ERROR');
  }
}

// Event system for template changes
type TemplateEventType = 'created' | 'updated' | 'deleted' | 'used';

interface TemplateEvent {
  type: TemplateEventType;
  templateId: string;
  timestamp: Date;
  metadata?: any;
}

class TemplateEventEmitter {
  private listeners: Map<TemplateEventType, ((event: TemplateEvent) => void)[]> = new Map();

  on(event: TemplateEventType, callback: (event: TemplateEvent) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  emit(event: TemplateEvent) {
    const callbacks = this.listeners.get(event.type) || [];
    callbacks.forEach(callback => callback(event));
  }
}

export default class TemplateService {
  private static templates: Map<string, Template> = new Map();
  private static categories: Map<string, TemplateCategory> = new Map();
  private static isLoaded = false;
  private static loadPromise: Promise<void> | null = null;
  private static eventEmitter = new TemplateEventEmitter();

  // Cache configuration
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private static lastCacheUpdate = 0;

  /**
   * Load templates with caching and error handling
   */
  static async loadTemplates(force = false): Promise<Template[]> {
    const now = Date.now();
    const isCacheExpired = now - this.lastCacheUpdate > this.CACHE_TTL;

    if (!force && this.isLoaded && !isCacheExpired) {
      return Array.from(this.templates.values());
    }

    // Prevent multiple concurrent loads
    if (this.loadPromise) {
      await this.loadPromise;
      return Array.from(this.templates.values());
    }

    this.loadPromise = this._loadTemplatesFromSource();
    
    try {
      await this.loadPromise;
      this.isLoaded = true;
      this.lastCacheUpdate = now;
      return Array.from(this.templates.values());
    } finally {
      this.loadPromise = null;
    }
  }

  private static async _loadTemplatesFromSource(): Promise<void> {
    try {
      // Load built-in templates
      const builtInTemplates = await this._loadBuiltInTemplates();
      
      // Load custom templates (in a real app, this would be from an API)
      const customTemplates = await this._loadCustomTemplates();

      // Merge and validate templates
      const allTemplates = [...builtInTemplates, ...customTemplates];
      
      this.templates.clear();
      this.categories.clear();

      for (const template of allTemplates) {
        this._validateTemplate(template);
        this.templates.set(template.id, template);
        this._updateCategoryCount(template.category);
      }

    } catch (error) {
      console.error('Error loading templates:', error);
      throw new TemplateError('Failed to load templates', 'LOAD_ERROR');
    }
  }

  private static async _loadBuiltInTemplates(): Promise<Template[]> {
    const templateModules = [
      () => import('@/shared/templates/restaurant.json'),
      () => import('@/shared/templates/tech-startup.json'),
      () => import('@/shared/templates/agency.json'),
      () => import('@/shared/templates/portfolio.json'),
      () => import('@/shared/templates/ecommerce.json'),
    ];

    const templates: Template[] = [];

    for (const loadTemplate of templateModules) {
      try {
        const module = await loadTemplate();
        const templateData = module.default;
        
        // Enhance with metadata
        const enhancedTemplate: Template = {
          ...templateData,
          isCustom: false,
          createdAt: new Date(templateData.createdAt || Date.now()),
          updatedAt: new Date(templateData.updatedAt || Date.now()),
          usageCount: templateData.usageCount || 0,
          rating: templateData.rating || 5,
          tags: templateData.tags || [],
          author: templateData.author || 'System',
          version: templateData.version || '1.0.0',
          isPremium: templateData.isPremium || false,
        };

        templates.push(enhancedTemplate);
      } catch (error) {
        console.warn('Failed to load template:', error);
      }
    }

    return templates;
  }

  private static async _loadCustomTemplates(): Promise<Template[]> {
    // In a real app, this would fetch from your API
    // For now, return empty array
    return [];
  }

  private static _validateTemplate(template: any): void {
    try {
      TemplateSchema.parse(template);
    } catch (error) {
      throw new TemplateValidationError(`Invalid template: ${error}`);
    }
  }

  private static _updateCategoryCount(categoryId: string): void {
    if (!this.categories.has(categoryId)) {
      this.categories.set(categoryId, {
        id: categoryId,
        name: this._formatCategoryName(categoryId),
        description: `Templates for ${categoryId}`,
        templateCount: 0,
      });
    }

    const category = this.categories.get(categoryId)!;
    category.templateCount++;
  }

  private static _formatCategoryName(categoryId: string): string {
    return categoryId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Get template by ID with usage tracking
   */
  static async getTemplateById(id: string, trackUsage = true): Promise<Template> {
    await this.loadTemplates();
    
    const template = this.templates.get(id);
    if (!template) {
      throw new TemplateNotFoundError(id);
    }

    if (trackUsage) {
      template.usageCount++;
      this.eventEmitter.emit({
        type: 'used',
        templateId: id,
        timestamp: new Date(),
      });
    }

    return { ...template }; // Return a copy to prevent mutations
  }

  /**
   * Search templates with advanced filtering
   */
  static async searchTemplates(
    query?: string, 
    filters: SearchFilters = {}
  ): Promise<Template[]> {
    await this.loadTemplates();
    
    let results = Array.from(this.templates.values());

    // Text search
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      results = results.filter(template => 
        template.name.toLowerCase().includes(lowercaseQuery) ||
        template.description.toLowerCase().includes(lowercaseQuery) ||
        template.category.toLowerCase().includes(lowercaseQuery) ||
        template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
        template.author.toLowerCase().includes(lowercaseQuery)
      );
    }

    // Apply filters
    if (filters.category) {
      results = results.filter(template => template.category === filters.category);
    }

    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(template => 
        filters.tags!.some(tag => template.tags.includes(tag))
      );
    }

    if (filters.isPremium !== undefined) {
      results = results.filter(template => template.isPremium === filters.isPremium);
    }

    if (filters.isCustom !== undefined) {
      results = results.filter(template => template.isCustom === filters.isCustom);
    }

    if (filters.rating) {
      results = results.filter(template => template.rating >= filters.rating!);
    }

    // Sorting
    const sortBy = filters.sortBy || 'name';
    const sortOrder = filters.sortOrder || 'asc';

    results.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'createdAt':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'usageCount':
          comparison = a.usageCount - b.usageCount;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return results;
  }

  /**
   * Get templates by category
   */
  static async getTemplatesByCategory(category: string): Promise<Template[]> {
    return this.searchTemplates(undefined, { category });
  }

  /**
   * Get all categories with metadata
   */
  static async getCategories(): Promise<TemplateCategory[]> {
    await this.loadTemplates();
    return Array.from(this.categories.values())
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Create a custom template
   */
  static async createCustomTemplate(data: Omit<Template, 'id' | 'isCustom' | 'createdAt' | 'updatedAt' | 'usageCount'>): Promise<Template> {
    this._validateTemplate(data);

    const now = new Date();
    const newTemplate: Template = {
      ...data,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      isCustom: true,
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
    };

    this.templates.set(newTemplate.id, newTemplate);
    this._updateCategoryCount(newTemplate.category);

    this.eventEmitter.emit({
      type: 'created',
      templateId: newTemplate.id,
      timestamp: now,
      metadata: { isCustom: true },
    });

    // In a real app, save to database here
    await this._saveToDatabase(newTemplate);

    return { ...newTemplate };
  }

  /**
   * Clone an existing template
   */
  static async cloneTemplate(
    id: string, 
    overrides: Partial<Pick<Template, 'name' | 'description' | 'category' | 'tags'>> = {}
  ): Promise<Template> {
    const originalTemplate = await this.getTemplateById(id, false);
    
    const clonedData = {
      ...originalTemplate,
      ...overrides,
      name: overrides.name || `${originalTemplate.name} (Copy)`,
      author: 'User', // Set to current user in real app
      version: '1.0.0',
      rating: 0,
    };

    // Remove fields that should not be copied
    const { id: _, isCustom, createdAt, updatedAt, usageCount, ...dataToClone } = clonedData;

    return this.createCustomTemplate(dataToClone);
  }

  /**
   * Update template
   */
  static async updateTemplate(id: string, updates: Partial<Template>): Promise<Template> {
    const template = this.templates.get(id);
    if (!template) {
      throw new TemplateNotFoundError(id);
    }

    // Only allow updating custom templates
    if (!template.isCustom) {
      throw new TemplateError('Cannot update built-in templates', 'CANNOT_UPDATE_BUILTIN');
    }

    const updatedTemplate: Template = {
      ...template,
      ...updates,
      id: template.id, // Ensure ID cannot be changed
      updatedAt: new Date(),
    };

    this._validateTemplate(updatedTemplate);
    this.templates.set(id, updatedTemplate);

    this.eventEmitter.emit({
      type: 'updated',
      templateId: id,
      timestamp: new Date(),
    });

    // In a real app, save to database here
    await this._saveToDatabase(updatedTemplate);

    return { ...updatedTemplate };
  }

  /**
   * Delete template
   */
  static async deleteTemplate(id: string): Promise<boolean> {
    const template = this.templates.get(id);
    if (!template) {
      return false;
    }

    // Only allow deleting custom templates
    if (!template.isCustom) {
      throw new TemplateError('Cannot delete built-in templates', 'CANNOT_DELETE_BUILTIN');
    }

    this.templates.delete(id);

    this.eventEmitter.emit({
      type: 'deleted',
      templateId: id,
      timestamp: new Date(),
    });

    // In a real app, delete from database here
    await this._deleteFromDatabase(id);

    return true;
  }

  /**
   * Get template statistics
   */
  static async getStats(): Promise<TemplateStats> {
    await this.loadTemplates();
    
    const templates = Array.from(this.templates.values());
    
    return {
      totalTemplates: templates.length,
            categoriesCount: this.categories.size,
      customTemplates: templates.filter(t => t.isCustom).length,
      premiumTemplates: templates.filter(t => t.isPremium).length,
      averageRating: templates.reduce((sum, t) => sum + t.rating, 0) / templates.length || 0,
    };
  }

  /**
   * Get popular templates based on usage
   */
  static async getPopularTemplates(limit = 10): Promise<Template[]> {
    const templates = await this.searchTemplates(undefined, { 
      sortBy: 'usageCount', 
      sortOrder: 'desc' 
    });
    return templates.slice(0, limit);
  }

  /**
   * Get recently added templates
   */
  static async getRecentTemplates(limit = 10): Promise<Template[]> {
    const templates = await this.searchTemplates(undefined, { 
      sortBy: 'createdAt', 
      sortOrder: 'desc' 
    });
    return templates.slice(0, limit);
  }

  /**
   * Get recommended templates based on user usage patterns
   */
  static async getRecommendedTemplates(
    userCategories: string[] = [], 
    userTags: string[] = [], 
    limit = 5
  ): Promise<Template[]> {
    await this.loadTemplates();
    
    let templates = Array.from(this.templates.values());
    
    // Score templates based on user preferences
    const scoredTemplates = templates.map(template => {
      let score = 0;
      
      // Category match
      if (userCategories.includes(template.category)) {
        score += 10;
      }
      
      // Tag matches
      const tagMatches = template.tags.filter(tag => userTags.includes(tag)).length;
      score += tagMatches * 5;
      
      // Usage popularity
      score += Math.log(template.usageCount + 1);
      
      // Rating bonus
      score += template.rating;
      
      return { template, score };
    });
    
    // Sort by score and return top templates
    return scoredTemplates
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.template);
  }

  /**
   * Import template from external source
   */
  static async importTemplate(templateData: any, source: string): Promise<Template> {
    try {
      // Validate and transform external template data
      const transformedData = this._transformExternalTemplate(templateData, source);
      
      // Create as custom template
      return await this.createCustomTemplate({
        ...transformedData,
        tags: [...transformedData.tags, `imported-${source}`],
        author: `Imported from ${source}`,
      });
    } catch (error) {
      throw new TemplateError(`Failed to import template: ${error}`, 'IMPORT_ERROR');
    }
  }

  private static _transformExternalTemplate(data: any, source: string): Omit<Template, 'id' | 'isCustom' | 'createdAt' | 'updatedAt' | 'usageCount'> {
    // Transform external template format to internal format
    // This would vary based on the source format
    switch (source) {
      case 'figma':
        return this._transformFigmaTemplate(data);
      case 'sketch':
        return this._transformSketchTemplate(data);
      default:
        return this._transformGenericTemplate(data);
    }
  }

  private static _transformFigmaTemplate(data: any): any {
    // Transform Figma template format
    return {
      name: data.name || 'Imported Figma Template',
      description: data.description || 'Template imported from Figma',
      category: data.category || 'imported',
      tags: data.tags || ['figma'],
      author: 'Figma Import',
      version: '1.0.0',
      isPremium: false,
      rating: 0,
      styles: data.styles || this.getDefaultTemplate().styles,
      elements: data.elements || this.getDefaultTemplate().elements,
    };
  }

  private static _transformSketchTemplate(data: any): any {
    // Transform Sketch template format
    return {
      name: data.name || 'Imported Sketch Template',
      description: data.description || 'Template imported from Sketch',
      category: data.category || 'imported',
      tags: data.tags || ['sketch'],
      author: 'Sketch Import',
      version: '1.0.0',
      isPremium: false,
      rating: 0,
      styles: data.styles || this.getDefaultTemplate().styles,
      elements: data.elements || this.getDefaultTemplate().elements,
    };
  }

  private static _transformGenericTemplate(data: any): any {
    // Transform generic template format
    return {
      name: data.name || 'Imported Template',
      description: data.description || 'Imported template',
      category: data.category || 'imported',
      tags: data.tags || ['imported'],
      author: data.author || 'Unknown',
      version: data.version || '1.0.0',
      isPremium: data.isPremium || false,
      rating: data.rating || 0,
      styles: data.styles || this.getDefaultTemplate().styles,
      elements: data.elements || this.getDefaultTemplate().elements,
    };
  }

  /**
   * Export template for sharing
   */
  static async exportTemplate(id: string, format: 'json' | 'zip' = 'json'): Promise<Blob> {
    const template = await this.getTemplateById(id, false);
    
    switch (format) {
      case 'json':
        return this._exportAsJSON(template);
      case 'zip':
        return this._exportAsZip(template);
      default:
        throw new TemplateError('Unsupported export format', 'INVALID_FORMAT');
    }
  }

  private static _exportAsJSON(template: Template): Blob {
    const exportData = {
      ...template,
      exportedAt: new Date().toISOString(),
      exportVersion: '1.0',
    };
    
    return new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
  }

  private static async _exportAsZip(template: Template): Promise<Blob> {
    // In a real implementation, you'd use a library like JSZip
    // For now, return JSON blob
    return this._exportAsJSON(template);
  }

  /**
   * Validate template compatibility
   */
  static validateCompatibility(template: Template, targetVersion: string): boolean {
    // Check if template is compatible with target version
    const templateVersion = template.version;
    
    // Simple version comparison (in real app, use semver library)
    const isCompatible = this._compareVersions(templateVersion, targetVersion) >= 0;
    
    return isCompatible;
  }

  private static _compareVersions(version1: string, version2: string): number {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] || 0;
      const v2Part = v2Parts[i] || 0;
      
      if (v1Part > v2Part) return 1;
      if (v1Part < v2Part) return -1;
    }
    
    return 0;
  }

  /**
   * Database operations (placeholder for real implementation)
   */
  private static async _saveToDatabase(template: Template): Promise<void> {
    // In a real app, this would save to your database
    console.log('Saving template to database:', template.id);
  }

  private static async _deleteFromDatabase(id: string): Promise<void> {
    // In a real app, this would delete from your database
    console.log('Deleting template from database:', id);
  }

  /**
   * Event system methods
   */
  static onTemplateEvent(event: TemplateEventType, callback: (event: TemplateEvent) => void): void {
    this.eventEmitter.on(event, callback);
  }

  /**
   * Cache management
   */
  static clearCache(): void {
    this.templates.clear();
    this.categories.clear();
    this.isLoaded = false;
    this.lastCacheUpdate = 0;
  }

  static getCacheStats(): { size: number; lastUpdate: Date; isExpired: boolean } {
    const now = Date.now();
    const isExpired = now - this.lastCacheUpdate > this.CACHE_TTL;
    
    return {
      size: this.templates.size,
      lastUpdate: new Date(this.lastCacheUpdate),
      isExpired,
    };
  }

  /**
   * Enhanced default template with more sections
   */
  static getDefaultTemplate(): pageData {
    return {
      styles: {
        primaryColor: "#3b82f6",
        secondaryColor: "#dbeafe",
        accentColor: "#f59e0b",
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        fontFamily: "Inter, sans-serif",
        borderRadius: "8px",
        spacing: "16px",
      },
      elements: {
        navbar: {
          logo: { src: "", alt: "Logo" },
          links: [
            { label: "Home", link: "#home" },
            { label: "About", link: "#about" },
            { label: "Services", link: "#services" },
            { label: "Contact", link: "#contact" },
          ],
          actions: [
            { label: "Get Started", link: "#signup", type: "primary" }
          ],
          sticky: true,
          transparent: false,
        },
        header: {
          heading: "Build Amazing Landing Pages",
          subheading: "Professional Templates",
          description: "Create stunning landing pages in minutes with our drag-and-drop builder and professionally designed templates.",
          image: "",
          backgroundImage: "",
          overlay: false,
          alignment: "center",
          ctaButton: {
            label: "Start Building",
            link: "#get-started",
            style: "primary"
          },
          secondaryButton: {
            label: "Watch Demo",
            link: "#demo",
            style: "secondary"
          }
        },
        features: {
          header: {
            title: "Why Choose Our Platform",
            description: "Everything you need to create professional landing pages"
          },
          items: [
            {
              icon: "🚀",
              title: "Fast Setup",
              description: "Get your landing page live in minutes, not hours"
            },
            {
              icon: "🎨",
              title: "Beautiful Design",
              description: "Professional templates designed by experts"
            },
            {
              icon: "📱",
              title: "Mobile Responsive",
              description: "Looks perfect on all devices and screen sizes"
            }
          ]
        },
        services: {
          header: {
            title: "Our Services",
            description: "Comprehensive solutions for your business needs"
          },
          section: []
        },
        testimonials: {
          header: {
            title: "What Our Customers Say",
            description: "Don't just take our word for it"
          },
          items: []
        },
        pricing: {
          header: {
            title: "Simple, Transparent Pricing",
            description: "Choose the plan that works for you"
          },
          plans: []
        },
        cta: {
          title: "Ready to Get Started?",
          description: "Join thousands of satisfied customers today",
          button: {
            label: "Start Your Free Trial",
            link: "#signup"
          },
          backgroundImage: "",
          overlay: true
        },
        footer: {
          logo: { src: "", alt: "Logo" },
          section: {
            main: {
              title: "Your Company",
              description: "Building the future, one landing page at a time.",
              ctaButton: {
                label: "Get Started",
                link: "#signup"
              },
                            copyright: "© 2024 Your Company. All rights reserved.",
              privacyAndPolicy: {
                label: "Privacy Policy",
                link: "/privacy"
              },
              termsOfService: {
                label: "Terms of Service",
                link: "/terms"
              }
            },
            contact: {
              mail: "hello@yourcompany.com",
              phone: "+1 (555) 123-4567",
              address: "123 Innovation Street, Tech City, TC 12345",
              hours: "Mon-Fri 9AM-6PM EST",
            },
            social: [
              { label: "Twitter", link: "https://twitter.com/yourcompany", icon: "twitter" },
              { label: "LinkedIn", link: "https://linkedin.com/company/yourcompany", icon: "linkedin" },
              { label: "Facebook", link: "https://facebook.com/yourcompany", icon: "facebook" },
              { label: "Instagram", link: "https://instagram.com/yourcompany", icon: "instagram" }
            ],
            services: [
              { label: "Web Design", link: "/services/web-design" },
              { label: "Development", link: "/services/development" },
              { label: "SEO", link: "/services/seo" },
              { label: "Marketing", link: "/services/marketing" }
            ],
            quickLinks: [
              { label: "About Us", link: "/about" },
              { label: "Blog", link: "/blog" },
              { label: "Careers", link: "/careers" },
              { label: "Support", link: "/support" }
            ]
          },
          newsletter: {
            title: "Stay Updated",
            description: "Get the latest news and updates delivered to your inbox.",
            placeholder: "Enter your email",
            buttonText: "Subscribe",
            privacyText: "We respect your privacy. Unsubscribe at any time."
          }
        }
      }
    };
  }

  /**
   * Get template variations/themes
   */
  static async getTemplateVariations(baseTemplateId: string): Promise<Template[]> {
    await this.loadTemplates();
    
    const baseTemplate = this.templates.get(baseTemplateId);
    if (!baseTemplate) {
      throw new TemplateNotFoundError(baseTemplateId);
    }

    // Find templates with similar structure but different styling
    const variations = Array.from(this.templates.values()).filter(template => 
      template.id !== baseTemplateId &&
      template.category === baseTemplate.category &&
      this._areStructurallySimilar(template, baseTemplate)
    );

    return variations;
  }

  private static _areStructurallySimilar(template1: Template, template2: Template): boolean {
    // Simple structural similarity check
    const t1Sections = Object.keys(template1.elements);
    const t2Sections = Object.keys(template2.elements);
    
    const commonSections = t1Sections.filter(section => t2Sections.includes(section));
    const similarity = commonSections.length / Math.max(t1Sections.length, t2Sections.length);
    
    return similarity >= 0.7; // 70% similarity threshold
  }

  /**
   * Bulk operations
   */
  static async bulkUpdateTemplates(
    templateIds: string[], 
    updates: Partial<Template>
  ): Promise<{ updated: Template[]; failed: string[] }> {
    const results = { updated: [] as Template[], failed: [] as string[] };

    for (const id of templateIds) {
      try {
        const updated = await this.updateTemplate(id, updates);
        results.updated.push(updated);
      } catch (error) {
        results.failed.push(id);
        console.error(`Failed to update template ${id}:`, error);
      }
    }

    return results;
  }

  static async bulkDeleteTemplates(templateIds: string[]): Promise<{ deleted: string[]; failed: string[] }> {
    const results = { deleted: [] as string[], failed: [] as string[] };

    for (const id of templateIds) {
      try {
        const success = await this.deleteTemplate(id);
        if (success) {
          results.deleted.push(id);
        } else {
          results.failed.push(id);
        }
      } catch (error) {
        results.failed.push(id);
        console.error(`Failed to delete template ${id}:`, error);
      }
    }

    return results;
  }

  /**
   * Template backup and restore
   */
  static async backupTemplates(): Promise<Blob> {
    await this.loadTemplates();
    
    const backup = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      templates: Array.from(this.templates.values()),
      categories: Array.from(this.categories.values()),
    };

    return new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
  }

  static async restoreFromBackup(backupFile: File): Promise<{ restored: number; failed: number }> {
    try {
      const backupText = await backupFile.text();
      const backup = JSON.parse(backupText);

      if (!backup.version || !backup.templates) {
        throw new TemplateError('Invalid backup file format', 'INVALID_BACKUP');
      }

      let restored = 0;
      let failed = 0;

      for (const templateData of backup.templates) {
        try {
          if (templateData.isCustom) {
            // Only restore custom templates
            const { id, createdAt, updatedAt, usageCount, ...restoreData } = templateData;
            await this.createCustomTemplate(restoreData);
            restored++;
          }
        } catch (error) {
          failed++;
          console.error('Failed to restore template:', error);
        }
      }

      return { restored, failed };
    } catch (error) {
      throw new TemplateError('Failed to restore backup', 'RESTORE_ERROR');
    }
  }

  /**
   * Template analytics and insights
   */
  static async getTemplateAnalytics(templateId: string): Promise<{
    usageCount: number;
    usageHistory: { date: string; count: number }[];
    popularElements: string[];
    conversionRate?: number;
  }> {
    const template = await this.getTemplateById(templateId, false);
    
    // In a real app, this would fetch from analytics service
    return {
      usageCount: template.usageCount,
      usageHistory: this._generateMockUsageHistory(template.usageCount),
      popularElements: Object.keys(template.elements),
      conversionRate: Math.random() * 0.15 + 0.05, // Mock conversion rate 5-20%
    };
  }

  private static _generateMockUsageHistory(totalUsage: number): { date: string; count: number }[] {
    const history = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const count = Math.floor(Math.random() * (totalUsage / 30)) || 0;
      history.push({
        date: date.toISOString().split('T')[0],
        count
      });
    }
    
    return history;
  }

  /**
   * A/B Testing support
   */
  static async createTemplateVariant(
    baseTemplateId: string,
    variantName: string,
    modifications: Partial<pageData>
  ): Promise<Template> {
    const baseTemplate = await this.getTemplateById(baseTemplateId, false);
    
    const variantData = {
      ...baseTemplate,
      name: `${baseTemplate.name} - ${variantName}`,
      description: `${baseTemplate.description} (Variant: ${variantName})`,
      tags: [...baseTemplate.tags, 'variant', `variant-of-${baseTemplateId}`],
      styles: { ...baseTemplate.styles, ...modifications.styles },
      elements: { ...baseTemplate.elements, ...modifications.elements },
    };

    const { id, isCustom, createdAt, updatedAt, usageCount, ...createData } = variantData;
    
    return this.createCustomTemplate(createData);
  }

  /**
   * Template marketplace features
   */
  static async publishTemplate(templateId: string, marketplaceData: {
    price?: number;
    description: string;
    tags: string[];
  }): Promise<void> {
    const template = await this.getTemplateById(templateId, false);
    
    if (!template.isCustom) {
      throw new TemplateError('Can only publish custom templates', 'CANNOT_PUBLISH_BUILTIN');
    }

    // In a real app, this would publish to marketplace API
    await this.updateTemplate(templateId, {
      isPremium: marketplaceData.price ? marketplaceData.price > 0 : false,
      description: marketplaceData.description,
      tags: [...template.tags, ...marketplaceData.tags, 'marketplace'],
    });

    console.log(`Template ${templateId} published to marketplace`);
  }

  /**
   * Template performance monitoring
   */
  static async getPerformanceMetrics(): Promise<{
    totalLoadTime: number;
    cacheHitRate: number;
    errorRate: number;
    popularCategories: { category: string; count: number }[];
  }> {
    await this.loadTemplates();
    
    const templates = Array.from(this.templates.values());
    const categoryCount = new Map<string, number>();
    
    templates.forEach(template => {
      const count = categoryCount.get(template.category) || 0;
      categoryCount.set(template.category, count + 1);
    });

    const popularCategories = Array.from(categoryCount.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalLoadTime: Math.random() * 1000 + 200, // Mock load time
      cacheHitRate: this.isLoaded ? 0.95 : 0.0,
      errorRate: 0.01, // Mock 1% error rate
      popularCategories,
    };
  }

  /**
   * Utility methods for template management
   */
  static generateTemplatePreview(template: Template): string {
    // Generate a preview URL for the template
    // In a real app, this might trigger a service to generate a screenshot
    return `/api/templates/${template.id}/preview`;
  }

  static async validateTemplateIntegrity(templateId: string): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const template = await this.getTemplateById(templateId, false);
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required fields
    if (!template.name) errors.push('Template name is required');
    if (!template.description) errors.push('Template description is required');
    if (!template.category) errors.push('Template category is required');

    // Check styles
    if (!template.styles.primaryColor) errors.push('Primary color is required');
    if (!template.styles.secondaryColor) errors.push('Secondary color is required');

    // Check elements structure
    if (!template.elements.navbar) warnings.push('No navbar element found');
    if (!template.elements.header) errors.push('Header element is required');
    if (!template.elements.footer) warnings.push('No footer element found');

    // Validate colors
    const colorRegex = /^#[0-9A-F]{6}$/i;
    if (template.styles.primaryColor && !colorRegex.test(template.styles.primaryColor)) {
      errors.push('Invalid primary color format');
    }
    if (template.styles.secondaryColor && !colorRegex.test(template.styles.secondaryColor)) {
      errors.push('Invalid secondary color format');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

// Export additional utilities
export const TemplateUtils = {
  /**
   * Generate template thumbnail
   */
  generateThumbnail: async (template: Template): Promise<string> => {
    // In a real app, this would generate an actual thumbnail
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${template.styles.primaryColor}"/>
        <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="16">${template.name}</text>
      </svg>
    `)}`;
  },

  /**
   * Compare two templates
   */
  compareTemplates: (template1: Template, template2: Template) => {
    return {
      nameMatch: template1.name === template2.name,
      categoryMatch: template1.category === template2.category,
      stylesMatch: JSON.stringify(template1.styles) === JSON.stringify(template2.styles),
      elementsMatch: JSON.stringify(template1.elements) === JSON.stringify(template2.elements),
      tagsOverlap: template1.tags.filter(tag => template2.tags.includes(tag)),
    };
  },

  /**
   * Extract template metadata
   */
  extractMetadata: (template: Template) => {
    const elementCount = Object.keys(template.elements).length;
    const hasImages = JSON.stringify(template.elements).includes('"src"');
    const hasLinks = JSON.stringify(template.elements).includes('"link"');
    
    return {
      elementCount,
      hasImages,
      hasLinks,
      complexity: elementCount > 5 ? 'high' : elementCount > 3 ? 'medium' : 'low',
      estimatedBuildTime: elementCount * 5, // minutes
    };
  },
};