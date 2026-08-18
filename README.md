# Global Creative Intelligence OS

> From ad metrics to creative decisions.

A portfolio-first decision workspace that connects Google Ads performance, placement behavior, video content evidence and business guardrails. It turns fragmented cross-market analysis into a repeatable workflow:

**Business context → Campaign / Placement / Asset data → deterministic diagnosis → content evidence → creative action**

## Why this exists

A conventional dashboard can show CPA, CTR and spend, but it cannot explain whether a decline came from:

- attention decay,
- purchase-intent loss,
- placement mismatch,
- a weak product reason,
- or insufficient evidence.

Creative Intelligence OS keeps performance data and Hook / Product Action / Result / CTA evidence in one decision trail. It also makes limitations visible instead of allowing an AI layer to over-claim attribution.

## Current MVP

- Three-step onboarding: account, campaign scope, Target CPA
- One-click `Generate latest insights` workflow
- Six verified market fixtures: Developed EN, Korea, Turkey, Portuguese, Spanish and France
- L30 / L14 / L7 Campaign health
- In-feed / In-stream / Shorts diagnosis
- Asset-level ranking and action states
- Creative Lab with content evidence
- Meeting-ready Insight Report
- Portfolio Case Study page
- Responsive and print-ready design
- Explicit Demo Mode / Live Mode separation

## Run locally

Double-click:

```text
start.bat
```

Then open:

```text
http://127.0.0.1:5174
```

Or run manually with a Node.js 24+ environment:

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run lint
npm run build
```

## Product flow

### First-time setup

1. Connect Google Ads
2. Select account and campaigns
3. Confirm market, funnel stage and Target CPA
4. Save the analysis template

### Recurring workflow

1. Use the latest completed day in the account timezone
2. Pull nested L30 / L14 / L7 windows
3. Normalize Campaign → Placement → Asset data
4. Run deterministic rules
5. Select high-impact videos for content review
6. Assemble conclusion → supporting data → content evidence → implication

## Diagnosis principles

- CPA + Conversion Volume are the north stars.
- Spend, CTR, CPC, CvR, placement and p50 explain performance.
- A recent zero conversion alone is not creative fatigue.
- Fatigue requires supporting signals such as CPC inflation and CvR deterioration.
- High p50 does not guarantee Purchase intent.
- High-spend zero-conversion and low-spend zero-conversion receive different diagnoses.
- Retargeting and Prospecting are not mechanically compared.
- Professional tasks can be placement-specific rather than universally scalable.

## Data integrity

The product explicitly discloses:

- Demand Gen quartile metrics may be inherited from a parent ad.
- Audience attribution cannot reliably reach `video × audience`; Ad Group is the minimum reliable level in this case.
- Fractional attributed conversions below 0.1 are displayed as `<0.1`.
- Without GA4 or CRM data, landing-page and backend explanations remain hypotheses.
- Demo Mode uses rounded, curated case-study data and is never presented as a live account connection.

## Architecture

```text
Google Ads OAuth/API ─┐
                      ├─ DataAdapter ─ Normalized schema ─ Rule engine ─ Insight JSON ─ UI / PDF
Verified demo fixture ┘

YouTube ID / video upload ─ Transcript + keyframes ─ Hook / Action / Result / CTA evidence ─┘
```

### Data adapters

- `DemoDataAdapter` is fully implemented.
- `GoogleAdsDataAdapter` defines the Live Mode boundary and fails explicitly until credentials are configured.

### Rule-first design

The language layer is not allowed to invent metrics or unsupported root causes. The diagnosis is produced by deterministic rules; a language model may only structure evidence into meeting-ready prose.

## Live Google Ads prerequisites

Copy `.env.example` to `.env.local` and configure:

```text
GOOGLE_ADS_CLIENT_ID
GOOGLE_ADS_CLIENT_SECRET
GOOGLE_ADS_DEVELOPER_TOKEN
GOOGLE_ADS_LOGIN_CUSTOMER_ID
GOOGLE_ADS_REDIRECT_URI
```

Live Mode also requires a secure backend OAuth callback and encrypted refresh-token storage. These credentials must never be exposed in Vite client variables or committed to Git.

## Portfolio narrative

**Challenge:** Creative analysis was fragmented across Google Ads exports, video content and local market context.

**Role:** Product framing, metric design, attribution boundaries, creative diagnosis, UX and implementation.

**Outcome:** A reusable decision workflow that makes commercial thinking visible in the interface—not only in a final report.

The Case Study page maps the product to six senior growth capabilities:

1. Business understanding
2. Attribution and data judgment
3. Creative and content insight
4. Actionable execution
5. Risk and stability control
6. Cross-cultural user thinking

## Next iteration

- Secure Google OAuth backend
- Google Ads API query service
- Automated subtitle and keyframe processing
- Creative Brief and experiment cards
- Scheduled weekly generation
- GA4 / CRM / profit model integration
- Feishu publishing

The first release intentionally does **not** make automatic campaign mutations or pause assets without human confirmation.
