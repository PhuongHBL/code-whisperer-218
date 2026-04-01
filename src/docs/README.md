# Documentation Index

This directory contains comprehensive documentation for the Lau Choy Seng e-commerce frontend project. The documentation is organized to help developers understand the project architecture, conventions, and patterns used throughout the codebase.

## Documentation Overview

### [01. Project Overview & Architecture](./01-project-overview.md)

**Essential foundation knowledge**

- Project summary and tech stack
- Architecture patterns and modular structure
- Build & deployment configuration
- TypeScript configuration and environment setup

### [02. Styling & UI Library Conventions](./02-styling-ui-conventions.md)

**Design system and styling guidelines**

- Tailwind CSS and HeroUI theme configuration
- Component styling patterns and variants
- Global CSS conventions and responsive design
- Asset management and animation patterns

### [03. API Architecture & Data Flow](./03-api-data-flow.md)

**Data management and API integration**

- API client architecture and patterns
- TanStack Query implementation
- Error handling and state management
- Authentication flow and URL state management

### [04. Component Patterns & Conventions](./04-component-patterns.md)

**Component development guidelines**

- Component organization and naming conventions
- Base component extension patterns
- Screen component structure and form patterns
- Custom hooks and layout component patterns

### [05. Routing & Page Structure](./05-routing-page-structure.md)

**Navigation and page organization**

- Next.js Page Router architecture
- Route configuration and navigation patterns
- Layout system and static export considerations
- Authentication and protected routes

### [06. Project Setup & Development Guidelines](./06-development-setup.md)

**Getting started and development workflow**

- Quick start guide and installation
- Project creation template
- Development workflow and code quality standards
- Deployment configuration and testing strategy

### [07. AI Workflow Integration Guidelines](./07-ai-workflow-integration.md)

**AI-assisted development framework**

- AI code generation rules and patterns
- Component and API client generation templates
- Error handling and performance optimization for AI
- Code review checklist and documentation standards

## Templates

### [Input Processing Template](./templates/input-processing-template.md)

**Structured requirement processing**

- User story processing template with technical breakdown
- API specification processing with implementation tasks
- Feature requirements planning with component architecture
- Development workflow and quality checklist

## How to Use This Documentation

### For New Developers

1. Start with **Project Overview** to understand the architecture
2. Review **Styling Conventions** to understand the design system
3. Study **Component Patterns** to learn development conventions
4. Reference other sections as needed for specific features

### For AI Systems

1. Read **AI Workflow Integration** for generation guidelines
2. Reference all sections for pattern understanding
3. Use the templates and conventions consistently
4. Follow the established naming and structure patterns

### For Project Templates

This documentation serves as a complete template for:

- Setting up new Next.js e-commerce projects
- Establishing consistent development patterns
- Implementing scalable architecture
- Maintaining code quality and conventions

## Key Conventions Summary

### Naming Patterns

- **Components**: PascalCase with descriptive suffixes (`HomeIndexScreen`, `ProductCard`)
- **Files**: PascalCase for components, camelCase for utilities
- **API Clients**: `useQuery[Entity]` and `useMutation[Action]` pattern (domain implicit from filename)
- **Routes**: kebab-case URLs with meaningful structure
- **Functions**: Avoid creating unless absolutely necessary (YAGNI principle)

### Directory Structure

```
src/
├── modules/         # Business logic and reusable code
│   ├── _api/       # API clients and data fetching
│   ├── common/     # Shared components and utilities
│   ├── pages/      # Screen components (business logic)
│   └── config/     # Configuration and constants
└── pages/          # Next.js routing (presentation only)
```

### Technology Choices

- **UI Framework**: HeroUI with Tailwind CSS
- **State Management**: TanStack Query + React Context
- **Form Handling**: React Hook Form + Zod validation
- **Internationalization**: i18next
- **Build Target**: Static export for CDN deployment

## Contributing Guidelines

When adding new documentation:

1. Follow the established structure and formatting
2. Include practical examples and code snippets
3. Update this index file if adding new sections
4. Ensure consistency with existing patterns
5. Consider AI workflow implications for new patterns

## Pattern Recognition for AI

This documentation is structured to enable AI systems to:

- **Understand context** through comprehensive architecture overview
- **Recognize patterns** through consistent examples and templates
- **Generate code** following established conventions
- **Maintain quality** through clear guidelines and checklists
- **Evolve appropriately** while preserving core patterns

The patterns documented here represent battle-tested approaches for building scalable, maintainable Next.js applications with modern development practices.
