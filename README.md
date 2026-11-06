# Portfolio

[![CI](https://github.com/Zapeman02/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Zapeman02/portfolio/actions/workflows/ci.yml)
[![Deploy](https://github.com/Zapeman02/portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/Zapeman02/portfolio/actions/workflows/deploy.yml)

Personal portfolio showing my projects, experience and interests.

**Live:** https://zapeman02.github.io/portfolio/

Built with Vite, React and TypeScript. Tested with Vitest and React Testing Library. Deployed to GitHub Pages via GitHub Actions.

## Run locally

```bash
npm ci
npm run dev
```

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Workflow

`main` is protected. All changes go through a pull request: feature branch → PR → green CI → squash merge. Merges to `main` deploy automatically.
