# Aerivis

Aerivis is an interactive partner prototype for an end-to-end environmental
exposure evidence service. It connects the resident report, housing response,
controlled air sampling, laboratory analysis, clinical context, legal review,
remediation, and verification in one role-based workflow.

## Live prototype

[Open the private partner demo](https://aerivis-evidence-prototype.kevin-doyle296372.chatgpt.site)

Access to the hosted demonstration is restricted separately from this source
repository.

## What the prototype demonstrates

- Role-specific workspaces for housing, field, laboratory, clinical, legal, and
  resident users
- Awaab's Law deadline tracking and case-stage handoffs
- Collector pairing, sampling telemetry, and contextual environmental data
- Consent controls and an auditable chain of custody
- Laboratory, clinical, and legal review boundaries
- Local generation of a demonstration evidence pack
- A staged validation and commercial-readiness roadmap

All cases and records shown in the prototype are fictional demonstration data.
The Collector, analytical method, and workflow remain subject to technical,
clinical, regulatory, legal, and commercial validation. The prototype does not
provide a diagnosis or guarantee evidential admissibility or compliance.

## Run locally

Requires Node.js 22.13 or later.

```bash
npm install
npm run dev
```

Then open the local address shown in the terminal.

## Verify

```bash
npm test
```

The test command builds the production application and checks the rendered
prototype and product metadata.

## Deployment targets

- `npm run build` produces the Cloudflare/Sites `dist/` build.
- `npm run build:vercel` produces the standard Next.js `.next/` build required
  by Vercel.

The checked-in `vercel.json` selects the Vercel-specific build automatically
when the GitHub repository is deployed there.

## Main project areas

- `app/AerivisPrototype.tsx` — interactive partner demonstration
- `app/globals.css` — responsive visual system
- `public/aerivis-collector.jpg` — supplied Collector concept image
- `tests/rendered-html.test.mjs` — rendered-output checks
- `.openai/hosting.json` — hosted Sites project reference

## Technology

The prototype uses React, TypeScript, Next.js-compatible routing through vinext,
Vite, and Cloudflare Workers.
