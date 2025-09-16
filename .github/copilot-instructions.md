# GitHub Copilot Instructions for Upstart Monorepo

## Project Overview
This is a monorepo for the Upstart project. Please follow these guidelines when generating code suggestions.


## Structure
- The project is organized into packages, each with its own `src` folder
- `scripts` directories are used for build and development scripts

## Main libraries
- AJV and Typebox are used for JSON Schema management

## Code Style & Standards
- Use TypeScript for all new JavaScript/TypeScript files
- Follow Biome configurations in the project
- Prefer const over let, avoid var
- Use async/await over Promise chains

## Architecture Patterns
- Follow the established folder structure in each package
- Implement proper error handling with try/catch blocks
- Follow SOLID principles

## Testing
- Write unit tests for all new functions and classes
- Use Vitest as the testing framework
- Place test files adjacent to source files with .test.ts extension in the closest `tests` folder
- Aim for high test coverage
- Mock external dependencies in tests
- When running test, use `vitest run`, not just `vitest`

## Documentation
- Add JSDoc comments for all public functions and classes
- Dont Include type annotations in JSdoc, they already are in typescript
- Write clear, concise commit messages
- Update README files when adding new features

## Package Management
- This monorepo uses `pnpm` as the package manager
- Use the workspace package manager commands

## Security
- Validate all user inputs
- Use environment variables for sensitive configuration
- Follow secure coding practices
- Don't hardcode secrets or API keys

## Performance
- Prefer efficient algorithms and data structures
- Implement proper caching where beneficial
- Use lazy loading for heavy resources
