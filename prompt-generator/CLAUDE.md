# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run Commands

- **Install Dependencies**: `npm install`
- **Development Server**: `npm run dev`
- **Build for Production**: `npm run build`
- **Preview Production Build**: `npm run preview`

## Architecture & Structure

- **Type**: Vue 3 Single Page Application (SPA) built with Vite.
- **Entry Point**: `src/main.js` mounts the app, initializes Pinia, Router, and I18n.
- **Routing**: `src/router/index.js` uses `createWebHashHistory`.
  - Home: `src/views/HomeView.vue`
  - About: `src/views/AboutView.vue` (lazy loaded)
- **State Management**: Pinia stores located in `src/stores/`.
- **Styling**: Tailwind CSS v4 configured in `vite.config.js` with DaisyUI component library.
- **Internationalization**: `vue-i18n` configured in `src/i18n/`.
- **Components**: Reusable UI components in `src/components/`.
- **Static Assets**: `src/assets/`.

## Code Style & Conventions

- **Path Alias**: Use `@` to import from `src/` (e.g., `import Foo from '@/components/Foo.vue'`).
- **Vue Style**: Prefer Composition API with `<script setup>`.
- **CSS**: Use utility classes from Tailwind CSS where possible.
- **Base URL**: Configured as `/AI-Prompt-Generator/` in `vite.config.js`.
