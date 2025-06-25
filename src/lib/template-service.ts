import { pageData } from '@/types/types';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  styles: pageData['styles'];
  elements: pageData['elements'];
}

export default class TemplateService {
  private static templates: Template[] = [];

  static async loadTemplates(): Promise<Template[]> {
    if (this.templates.length > 0) {
      return this.templates;
    }

    try {
      // In a real app, this would be an API call
      // For now, we'll import the templates statically
      const restaurantTemplate = await import('@/shared/templates/restaurant.json');
      const techStartupTemplate = await import('@/shared/templates/tech-startup.json');

      this.templates = [
        restaurantTemplate.default,
        techStartupTemplate.default
      ];

      return this.templates;
    } catch (error) {
      console.error('Error loading templates:', error);
      return [];
    }
  }

  static async getTemplateById(id: string): Promise<Template | null> {
    const templates = await this.loadTemplates();
    return templates.find(template => template.id === id) || null;
  }

  static async getTemplatesByCategory(category: string): Promise<Template[]> {
    const templates = await this.loadTemplates();
    return templates.filter(template => template.category === category);
  }

  static async getCategories(): Promise<string[]> {
    const templates = await this.loadTemplates();
    const categories = new Set(templates.map(template => template.category));
    return Array.from(categories);
  }

  static async searchTemplates(query: string): Promise<Template[]> {
    const templates = await this.loadTemplates();
    const lowercaseQuery = query.toLowerCase();
    
    return templates.filter(template => 
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  static async createCustomTemplate(data: Omit<Template, 'id'>): Promise<Template> {
    const newTemplate: Template = {
      ...data,
      id: `custom-${Date.now()}`
    };

    // In a real app, this would save to a database
    this.templates.push(newTemplate);
    return newTemplate;
  }

  static async updateTemplate(id: string, updates: Partial<Template>): Promise<Template | null> {
    const templateIndex = this.templates.findIndex(template => template.id === id);
    
    if (templateIndex === -1) {
      return null;
    }

    this.templates[templateIndex] = {
      ...this.templates[templateIndex],
      ...updates
    };

    return this.templates[templateIndex];
  }

  static async deleteTemplate(id: string): Promise<boolean> {
    const templateIndex = this.templates.findIndex(template => template.id === id);
    
    if (templateIndex === -1) {
      return false;
    }

    this.templates.splice(templateIndex, 1);
    return true;
  }

  static getDefaultTemplate(): pageData {
    return {
      styles: {
        primaryColor: "#3b82f6",
        secondaryColor: "#dbeafe"
      },
      elements: {
        navbar: {
          logo: { src: "" },
          links: [],
          actions: []
        },
        header: {
          heading: "Welcome to Your Landing Page",
          description: "Create something amazing with our landing page builder.",
          image: "",
          ctaButton: {
            label: "Get Started",
            link: "#"
          }
        },
        services: {
          header: {
            title: "Our Services",
            description: "What we offer"
          },
          section: []
        },
        footer: {
          logo: { src: "" },
          section: {
            main: {
              title: "Your Company",
              description: "Your company description",
              ctaButton: {
                label: "Contact Us",
                link: "#"
              },
              copyright: "© 2024 Your Company. All rights reserved.",
              privacyAndPolicy: {
                label: "Privacy Policy",
                link: "/privacy"
              }
            },
            contact: {
              mail: "contact@yourcompany.com",
              phone: "+1 (555) 123-4567",
              address: "123 Main St, City, State 12345"
            },
            social: [],
            services: []
          }
        }
      }
    };
  }
} 