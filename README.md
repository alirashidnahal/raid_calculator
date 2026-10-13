# RAID Calculator

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/alirashidnahal/raid_calculator)](https://github.com/alirashidnahal/raid_calculator/releases)
[![Issues](https://img.shields.io/github/issues/alirashidnahal/raid_calculator)](https://github.com/alirashidnahal/raid_calculator/issues)
[![Node](https://img.shields.io/badge/node-24-339933?logo=node.js&logoColor=white)](package.json)

A lightweight, client-side **RAID disk space calculator**. Enter the number of disks and the size of each drive, choose a RAID level, and see usable capacity versus raw capacity instantly.

All calculations run locally in the browser. No disk configuration is sent to a server.

- **Repository:** [github.com/alirashidnahal/raid_calculator](https://github.com/alirashidnahal/raid_calculator)
- **Author:** [Ali Rashidnahal](https://alirashidnahal.com/)
- **Donate:** [alirashidnahal.com/donate](https://alirashidnahal.com/donate)

---

## Table of contents

- [Features](#features)
- [What is RAID?](#what-is-raid)
- [Supported RAID levels](#supported-raid-levels)
- [How to use](#how-to-use)
- [Capacity formulas](#capacity-formulas)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [CI/CD](#cicd)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

---

## Features

- Calculate **usable vs. total** capacity in terabytes
- Visual progress bar for usable space as a share of raw capacity
- RAID levels: **0, 1, 5, 6, 10, 50, 60**
- Options that are invalid for the current disk count are **disabled**
- Built-in Persian (Farsi) explainer for RAID technology and each level (pros, cons, diagrams)
- **RTL** layout with [Vazirmatn](https://github.com/rastikerdar/vazirmatn) and Bootstrap 5 RTL
- Installable web app metadata (`site.webmanifest`, icons, theme color)
- Static production build (deploy the `dist/` folder anywhere)

---

## What is RAID?

**RAID** (Redundant Array of Independent Disks) is a storage virtualization method that combines multiple physical drives into one logical volume. Arrays can be implemented in hardware or software and differ by **performance**, **redundancy**, and **capacity efficiency**.

This project is a planning tool: it estimates usable space for a given layout. It does not create, manage, or talk to real RAID controllers.

---

## Supported RAID levels

| Level   | Common name          | Minimum disks (calculator) | Notes                                                                  |
|---------|----------------------|----------------------------|------------------------------------------------------------------------|
| RAID 0  | Stripe               | 1 (typically 2+)           | Highest efficiency, no redundancy. Any drive failure loses the array.  |
| RAID 1  | Mirror               | **Exactly 2**              | Full copy on a second drive. Fast reads, slower writes, 100% overhead. |
| RAID 5  | Striping with parity | 3                          | Survives one drive failure. Capacity of *n − 1* drives.                |
| RAID 6  | Double parity        | 4                          | Survives two drive failures. Capacity of *n − 2* drives.               |
| RAID 10 | Mirror + stripe      | 4, **even** count          | Striped mirrors. Strong performance and fault tolerance; 50% overhead. |
| RAID 50 | RAID 5 + stripe      | 6                          | Two striped RAID 5 groups (as implemented here).                       |
| RAID 60 | RAID 6 + stripe      | 8                          | Two striped RAID 6 groups (as implemented here).                       |

The educational accordion also describes **RAID 0+1** (stripe then mirror). That level is documented in the UI but is **not** a selectable calculator option (use RAID 10 for the mirror-then-stripe nested layout).

---

## How to use

1. Open the app (see [Getting started](#getting-started)).
2. Set **total number of disks**.
3. Set **size of each drive** in **terabytes** (all drives are assumed to be the same size).
4. Choose an enabled RAID configuration.
5. Read **usable space** and **total (raw) space**. If the layout is invalid for the disk count, the usable value is shown as not possible (`امکان پذیر نیست`).

Drive count gates which radio buttons stay active. For example, RAID 10 needs an even number of disks of at least 4; RAID 1 is only enabled for two disks.

---

## Capacity formulas

Let `n` = number of disks and `s` = size of each drive (TB). Raw capacity is always `n × s`.

| RAID | Usable capacity (when valid) |
|------|------------------------------|
| 0    | `n × s`                      |
| 1    | `s` (only when `n === 2`)    |
| 5    | `(n − 1) × s`                |
| 6    | `(n − 2) × s`                |
| 10   | `(n × s) / 2`                |
| 50   | `((n / 2) × s − s) × 2`      |
| 60   | `((n / 2) × s − 2s) × 2`     |

RAID 50/60 in this calculator assume **two** parity groups striped together, so usable space matches two RAID 5 or RAID 6 sets of `n / 2` disks each.

Results are intended for planning. Real arrays also lose space to filesystem metadata, vendor overhead, and decimal vs. binary TB (this UI uses the numeric TB values you enter).

---

## Tech stack

| Area       | Choice                                                           |
|------------|------------------------------------------------------------------|
| Language   | Vanilla JavaScript (ES modules)                                  |
| Markup     | HTML5 (`index.html`, `lang="fa"`, `dir="rtl"`)                   |
| Styling    | Custom CSS + [Bootstrap 5](https://getbootstrap.com/) RTL        |
| Font       | [Vazirmatn](https://www.npmjs.com/package/vazirmatn)             |
| Bundler    | [Vite 6](https://vitejs.dev/) (`base: './'` for relative assets) |
| Quality    | ESLint 10, Prettier 3, EditorConfig                              |
| Runtime CI | Node.js 24                                                       |

There is no backend, database, or analytics pipeline. The calculator logic lives in `assets/main.js`.

---

## Getting started

### Requirements

- [Node.js](https://nodejs.org/) (CI uses **24**; any current LTS that supports Vite 6 should work)
- npm (comes with Node)

### Install and run

```bash
git clone https://github.com/alirashidnahal/raid_calculator.git
cd raid_calculator
npm install
npm run dev
```

Vite prints a local URL (typically `http://localhost:5173`). Open it in the browser.

### Production build

```bash
npm run build
npm run preview
```

- `npm run build` writes a static site to `dist/`.
- `npm run preview` serves that folder locally.
- Copy `dist/` to any static host (GitHub Pages, nginx, Apache/XAMPP, Netlify, etc.). Assets are relative (`base: './'`), so the site also works from a subfolder.

GitHub Releases ship a ZIP of `dist/` plus `LICENSE` when the publish workflow runs on `master`.

---

## Available scripts

| Script           | Command                      | Purpose                              |
|------------------|------------------------------|--------------------------------------|
| Dev server       | `npm run dev` or `npm start` | Vite HMR development server          |
| Production build | `npm run build`              | Output to `dist/`                    |
| Preview build    | `npm run preview`            | Serve `dist/`                        |
| Format           | `npm run format`             | Prettier write                       |
| Format check     | `npm run format:check`       | Prettier check (no write)            |
| Lint             | `npm run lint`               | ESLint with `--fix`                  |
| Lint check       | `npm run lint:check`         | ESLint without fixing                |
| Tests            | `npm test`                   | Placeholder (no automated tests yet) |

Prettier uses 4-space indent, single quotes, 100-character width, and ES5 trailing commas (`.prettierrc`). ESLint applies recommended rules to `assets/main.js` and `vite.config.js`.

---

## Project structure

```text
raid_calculator/
├── assets/
│   ├── img/            # RAID level diagrams
│   ├── main.js         # Calculator logic and Bootstrap/CSS entry
│   └── style.css
├── public/             # Copied as-is into the build
│   ├── favicon.ico
│   ├── icon.png
│   ├── icon.svg
│   ├── robots.txt
│   └── site.webmanifest
├── index.html          # App UI (calculator + RAID guide)
├── vite.config.js
├── eslint.config.js
├── package.json
├── LICENSE             # GNU GPL v3
└── .github/            # Issues, PRs, security, workflows
```

---

## CI/CD

Workflows live under `.github/workflows/`.

### Fix code style

- File: `.github/workflows/fix_code_style.yml`
- Runs on **push to `develop`** (with path ignores) or **manual `workflow_dispatch`**
- Installs dependencies, runs Prettier and ESLint, then auto-commits style fixes if anything changed
- Skips when the actor is `github-actions[bot]` to avoid loops

### Publish

- File: `.github/workflows/release.yml`
- Runs on **push to `master`**
- Builds the app, bumps the patch version from the latest git tag, tags the repo, zips `dist/` (including `LICENSE`), and opens a **draft** GitHub Release

### Dependabot

Monthly updates (timezone `Asia/Tehran`) for **npm** and **GitHub Actions**. Major Vite upgrades are ignored so the bundler can be reviewed separately.

---

## Contributing

Contributions are welcome.

1. Search [existing issues](https://github.com/alirashidnahal/raid_calculator/issues) before opening a new one.
2. Use the templates:
   - [Bug report](https://github.com/alirashidnahal/raid_calculator/issues/new?template=bug_report.yml)
   - [Feature request](https://github.com/alirashidnahal/raid_calculator/issues/new?template=feature_request.yml)
3. Questions can go to [Discussions](https://github.com/alirashidnahal/raid_calculator/discussions).
4. Open a pull request against the appropriate branch. Follow the [PR template](.github/PULL_REQUEST_TEMPLATE.md): describe the change type, keep style consistent (`npm run format` / `npm run lint`), and update docs when behavior changes.

Please follow the [Code of Conduct](.github/CODE_OF_CONDUCT.md). Reports of unacceptable behavior can be sent to [hi@alirashidnahal.com](mailto:hi@alirashidnahal.com).

Default code owner: [@alirashidnahal](https://github.com/alirashidnahal).

---

## Security

This is a **client-side** application. RAID inputs never leave the browser.

Do **not** file public issues for vulnerabilities. Report them privately:

- Email: [hi@alirashidnahal.com](mailto:hi@alirashidnahal.com)
- [Private GitHub security advisory](https://github.com/alirashidnahal/raid_calculator/security/advisories/new)

Full policy, supported versions, and response times: [.github/SECURITY.md](.github/SECURITY.md).

---

## License

This program is free software under the [GNU General Public License v3.0](LICENSE).

You may redistribute and/or modify it under the terms of the GPL. It is provided **without warranty**; see the license for details.

Copyright © [Ali Rashidnahal](https://alirashidnahal.com/).
