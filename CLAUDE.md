# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Upstart SDK is a monorepo for building website templates using standard web technologies (HTML, CSS, JS). It provides React components, utilities, and tools for creating responsive, accessible, and customizable templates. The project uses TypeScript, React 19, and is organized as a pnpm workspace with three main packages.

## Core Architecture

### Package Structure
- **@upstart.gg/sdk**: Core SDK functionality, utilities, and shared components
- **@upstart.gg/components**: React components for both editor interface and shared template components
- **@upstart.gg/style-system**: TailwindCSS setup with Twind runtime, Radix UI themes, and custom styling system

### Key Technologies
- **Build System**: Turbo (monorepo orchestration), Vite (components), tsup (SDK/style-system)
- **Styling**: Twind (runtime TailwindCSS), Radix UI Themes, CSS-in-JS with runtime compilation
- **State Management**: Zustand with undo/redo via Zundo, Immer for immutable updates
- **UI Framework**: React 19 with modern concurrent features, Motion for animations
- **AI Integration**: Vercel AI SDK for chat/generation features in editor components
- **Testing**: Vitest for unit testing
- **Code Quality**: Biome for linting/formatting (replaces ESLint/Prettier)

## Development Commands

### Primary Commands
```bash
# Development (watch mode for all packages)
pnpm dev

# Build all packages
pnpm build

# Build with file watching
pnpm build:watch

# Run tests
pnpm test

# Lint and format code
pnpm lint

# Lint only affected files (CI)
pnpm ci:lint

# Clean install (removes all node_modules)
pnpm clean
```

### Package-Specific Commands
```bash
# Components package
cd packages/components
pnpm build        # Production build
pnpm dev         # Development build with watch
pnpm lint        # Biome check + TypeScript

# SDK package
cd packages/sdk
pnpm build       # Build with tsup
pnpm dev         # Watch mode
pnpm test        # Run vitest tests
pnpm lint        # Biome + TypeScript check

# Style System package
cd packages/style-system
pnpm build       # Build CSS and utilities
pnpm dev         # Watch mode
```

### Documentation
```bash
# Serve documentation locally
pnpm docs:dev

# Build documentation
pnpm docs:build

# Preview built documentation
pnpm docs:preview
```

## Code Organization Patterns

### Component Architecture
- **Editor Components**: Located in `packages/components/src/editor/` - components for the website builder interface
- **Shared Components**: Located in `packages/components/src/shared/` - reusable template components and "bricks"
- **Bricks System**: Template building blocks (hero, navbar, forms, etc.) in `packages/components/src/shared/bricks/`

### State Management Patterns
- **Zustand Stores**: Used for global state with undo/redo capabilities via Zundo
- **Draft System**: Page editing uses draft state with helpers in `packages/components/src/editor/hooks/use-page-data.ts`
- **Data Records**: Defined in SDK for structured data handling

### Styling Approach
- **Twind**: Runtime TailwindCSS compilation - use `tx()` for conditional classes, `css()` for custom styles
- **Theme System**: Radix UI themes integrated with custom color system
- **CSS Variables**: Extensive use of CSS custom properties for theming

### AI Integration
- Editor includes chat functionality using Vercel AI SDK
- AI tools and types defined in `@upstart.gg/sdk/shared/ai/types`
- Chat components support streaming responses and tool calling

## TypeScript Configuration

The project uses TypeScript 5.9+ with strict settings. Key configuration:
- Path mapping configured for package imports (`@upstart.gg/*`)
- Shared tsconfig.json at root with package-specific extensions
- Type-only imports preferred where possible

## Development Workflow

1. Use `pnpm dev` to start development across all packages
2. Turbo handles package dependencies and parallel execution
3. All code must pass Biome linting before commit
4. TypeScript strict mode is enforced - no `any` types in production code
5. Use Changeset for version management: `pnpm changeset`

## Package Dependencies

- **Workspace Dependencies**: Packages reference each other via `workspace:*`
- **React 19**: Latest version with concurrent features
- **Node.js 22+**: Required minimum version
- **pnpm 10.8+**: Required package manager

## Key Patterns to Follow

- Use workspace references for internal packages
- Prefer runtime CSS compilation (Twind) over static CSS
- Implement undo/redo for any state mutations in editor
- Use TypeBox for runtime schema validation
- Follow existing component patterns in bricks system
- Lazy load heavy components to improve performance