# Animated Presentation Experience Design

## Goal

Transform the existing forecasting case-study website into a presentation-first experience that can be delivered like an animated PowerPoint while remaining understandable and interactive when opened independently by judges, stakeholders, and other challenge teams.

The revised experience must preserve the working seven-stage forecasting showcase, clarify the BASF business setting, add BASF Agricultural Solutions branding and agricultural photography, and make the story navigable with keyboard arrows, touch gestures, and visible presentation controls.

## Audience and presentation context

The primary audience is the judging panel. Secondary audiences include BASF stakeholders and other challenge groups facing different forecasting problems. The site must work in two contexts:

1. A presenter advances the story in a room using a keyboard.
2. An attendee opens the public URL on a phone or laptop and understands the case without narration.

All explanatory copy therefore needs to be concise enough for a slide but complete enough for self-guided use.

## Chosen presentation model

The approved direction is a vertical full-page story with layered reveals.

- Every top-level chapter occupies at least one viewport and participates in vertical scroll snapping.
- Down Arrow, Right Arrow, Space, Page Down, swipe up, mouse wheel, or the visible next control advances one reveal step. After the last reveal on a slide, the same action advances to the next slide.
- Up Arrow, Left Arrow, Page Up, swipe down, or the visible previous control reverses the reveal sequence. Before the first reveal, it returns to the previous slide.
- Home moves to the first slide. End moves to the final slide.
- The active slide updates the URL hash without a page reload.
- A fixed presentation control displays the current slide, total slides, progress, previous and next buttons, and a concise keyboard hint.
- Keyboard navigation is suspended when focus is within a link, button, input, select, textarea, tab, modal, or the interactive forecasting showcase. Escape returns focus to the slide controller when appropriate.
- On mobile, natural touch scrolling remains possible and the visible previous/next buttons remain available. Swipe gestures use a threshold so small movements do not trigger navigation.
- `prefers-reduced-motion` preserves the ordered reveal states but applies them without travel, scale, parallax, or long transitions.

## Layered reveal system

Each slide declares a small ordered set of reveal groups. A typical sequence is:

1. Background image and context label.
2. Headline and core statement.
3. Selectable concepts, diagram, or evidence.
4. Supporting explanation or call to action.

Reveals use short opacity and vertical-position transitions. Photography may use a restrained scale or parallax effect. No reveal may hide essential information permanently: direct navigation to a hash initializes the slide at its first meaningful state, and self-guided users can advance with visible controls.

## Slide sequence and content

### 1. Opening

The opening slide combines KIT and official BASF Agricultural Solutions branding with an original photorealistic agricultural field image. The existing headline remains the core message:

> Forecasting, from fragmented data to confident decisions.

The headline, one-sentence description, team, and project metrics reveal in layers. The visual must clearly identify the work as a KIT × BASF Data Science Challenge case study without implying that the team represents BASF officially.

### 2. Forecasting is more than choosing a model

The business challenge becomes a photographic, selectable four-concept experience. One concept is active at a time. Selecting a card updates a nearby explanation panel and animates the image treatment and selection indicator.

- **Siloed data infrastructure:** Important sales and market signals are distributed across systems, owners, and formats.
- **Limited historical data availability:** Short or incomplete histories make robust validation and seasonality detection harder.
- **Missing domain knowledge:** Product, crop, weather, and market context are necessary to interpret drivers correctly.
- **Time-intensive model research:** Comparing new forecasting methods repeatedly consumes expert time and slows decisions.

The first concept is selected by default so the slide always contains a complete explanation.

### 3. A holistic AI opportunity

The opportunity slide presents an animated lifecycle with four selectable AI use cases. Selecting a node updates a short explanation and highlights its relationship to the lifecycle.

- **Understand:** AI profiles unfamiliar datasets, identifies quality issues, and summarizes the available forecasting context.
- **Research:** AI helps discover relevant external signals, methods, and evidence for a specific product group.
- **Forecast:** Foundation and conventional models can be configured, compared, and combined within one workflow.
- **Explain:** AI translates model behavior and forecast drivers for technical and business stakeholders.

The interaction should feel exploratory rather than decorative. The active node, explanation, and connecting path must be visually obvious.

### 4. The BASF forecasting setting

This slide states the task directly:

> In the BASF Agricultural Solutions setting, we aim to predict sales for five product groups.

The five groups are Insecticides, Herbicides, Fungicides, Seeds, and Seed Treatment. The slide emphasizes that each target has different demand patterns and drivers, while the platform provides one consistent workflow. Product groups may be selectable for a short contextual line, but the central message is the sales-forecasting setting rather than a generic category list.

### 5. The platform in three blocks

The seven-stage journey is summarized into three animated, selectable blocks. Each block expands into its specific capabilities.

#### Discover and build features

- Explore potentially useful internal and external data sources.
- Ingest them safely through predefined data contracts.
- Combine signals and domain knowledge into candidate features.
- Rank features using statistical and machine-learning measures.

#### Model and evaluate

- Configure state-of-the-art statistical, machine-learning, and foundation models with a few clicks.
- Train consistently across product groups.
- Backtest, compare, rank, and select candidate forecasts.

#### Explain and operationalize

- Explain data quality, feature relevance, forecast behavior, and model choice throughout the workflow.
- Adapt explanations for stakeholders with different technical backgrounds.
- Export results and register the champion model for operational use.

The animation begins with three simple blocks, then reveals the selected block's substeps and direction of travel. This overview complements rather than duplicates the detailed product showcase.

### 6. Interactive forecasting product

The existing seven-stage Forecast OS showcase remains fully functional. It is contained within a presentation chapter that may exceed one viewport on small screens. When a user interacts with its controls, global keyboard navigation does not intercept arrow keys or Space.

The showcase retains ingestion, external data, model selection, training, results, explainability, and export/registry. Its deterministic sample flow remains unchanged unless a presentation integration issue requires a minimal adjustment.

### 7. Three demonstrations

The video section becomes a single click-through presentation rather than a three-card grid. It contains three states:

1. From data to a forecast-ready foundation.
2. Selecting and training the model portfolio.
3. Explaining, exporting, and operationalizing results.

Each state has a visual poster, title, concise description, state counter, and previous/next controls. Video placeholders remain replacement-ready and clearly indicate that recordings can be added later. The component must not imply a video can play when no source is present.

### 8. Backup evidence

Existing feature-importance images remain accessible in a click-through gallery suitable for technical questions. The evidence gallery supports previous/next, thumbnails or labels, Escape to close, and keyboard-safe interaction. It remains visually secondary to the main narrative.

### 9. Closing

The closing slide communicates that the workflow generalizes to other forecasting settings with fragmented data, limited history, and expensive model selection. It retains the project team and both institutional identities and ends with a clear invitation to explore the interactive product.

## Visual identity and imagery

- Retain the existing deep-teal, cream, and mint visual direction.
- Add an official BASF Agricultural Solutions brand asset sourced from an official BASF property. Preserve its aspect ratio, colors, and clear space; do not redraw or synthesize the logo.
- Generate original photorealistic agricultural field imagery for project-local use. The imagery should include varied crop fields, field-level detail, and broad landscapes with usable negative space for text.
- Use images as full-bleed or split-background treatments with overlays that preserve text contrast.
- Add photographic treatments to the four challenge concepts. Images may be cropped derivatives of the generated source set where composition remains strong.
- Keep imagery free of people, readable text, company marks, watermarks, exaggerated sci-fi interfaces, and identifiable private property.

## Component architecture

### Presentation controller

A client-side `PresentationController` owns the active slide and reveal index, registers keyboard and pointer input, updates hashes, and exposes previous/next actions to the fixed controls. Slides declare their IDs and reveal counts through a small, explicit contract.

### Slide components

Existing page sections are reorganized into focused slide components. New interactive units are bounded as follows:

- `ChallengeExplorer`: four selectable business challenges and their explanations.
- `OpportunityExplorer`: four selectable AI use cases and lifecycle highlighting.
- `PlatformBlocks`: three selectable blocks and their capability lists.
- `VideoCarousel`: three replacement-ready demo states.

The existing `ForecastShowcase` and `EvidenceGallery` keep their current state responsibilities.

### Content model

Business challenges, AI use cases, product groups, platform blocks, and demo states live in structured content arrays. Components render from those arrays and hold only the currently selected item in local state. This keeps language review separate from animation behavior.

## Accessibility and failure handling

- All interactive cards are real buttons with an accessible selected state.
- Updated explanations use an appropriate live region without repeatedly interrupting screen readers.
- Visible focus styles remain strong on field imagery and solid backgrounds.
- Every image has meaningful alternative text or is explicitly decorative.
- Text contrast meets WCAG AA for normal text.
- Missing imagery falls back to the existing branded gradients without hiding copy.
- Presentation controls have accessible names and disabled states at the beginning and end.
- Modals and click-through galleries close with Escape and return focus to the launching control.
- The page remains readable and navigable when JavaScript animation is unavailable; sections stay in document order.

## Verification criteria

Automated tests must cover:

- Forward and reverse reveal sequencing.
- Transition from a slide's last reveal to the next slide.
- Home/End navigation and URL-hash synchronization.
- Protection of interactive controls from global keyboard handling.
- Selection and explanation changes for challenge, opportunity, platform, and video components.
- Reduced-motion behavior.
- Preservation of the existing deterministic forecasting workflow tests.
- English-only user-facing copy and required BASF setting language.

Manual verification must cover:

- Desktop keyboard presentation at 1440 × 900.
- Tablet layout at 1024 × 768.
- Mobile layout and swipe/controls at 390 × 844.
- No page-level horizontal overflow.
- No browser console errors or warnings caused by the application.
- Correct rendering of official logos and generated imagery.
- End-to-end forecasting showcase interaction within the presentation controller.
- Successful production build and public Cloudflare deployment.
- HTTPS 200 response and correct title/content at the deployed URL.

## Out of scope

- Recording or editing the three real videos.
- Connecting the deterministic showcase to production BASF data or systems.
- Adding authentication to the public presentation URL.
- Creating a custom domain.
- Redesigning the forecasting algorithms or demo reducer beyond presentation-integration needs.
