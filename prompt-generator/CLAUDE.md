# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vue 3 application built with Vite, using Pinia for state management and Vue Router for routing. Styled with Tailwind CSS v4 and DaisyUI.

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Architecture

- **Entry point**: src/main.js - initializes Vue app with Pinia and Router
- **Routing**: src/router/index.js - uses Vue Router with history mode
- **State management**: Pinia stores in src/stores/ using Composition API
- **Styling**: Tailwind CSS v4 with DaisyUI plugin imported in src/assets/main.css
- **Path alias**: `@` resolves to `src/` directory (configured in vite.config.js)

## Key Configuration

- Node version: ^20.19.0 || >=22.12.0
- Vite plugins: Vue, Vue DevTools, Tailwind CSS
- Lazy-loaded routes: AboutView uses dynamic import for code-splitting

# Pay attention to the following requirements.

Project files are encoded in UTF-8.

Prioritize the use of components from the DaisyUI library when generating the interface UI.

When adding an SVG icon, you can refer to the icons available at https://heroicons.com/.