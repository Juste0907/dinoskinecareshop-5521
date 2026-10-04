# Dino Skincare — Design

Single-product cosmetics store (web) for **La Gelée Dino**, a hydrating glow gel-serum. French copy.
Visual direction follows the supplied "High Protein / Magic Spoon — neon cereal arcade" system:
candy-colored pastel aisles, saturated violet hero, Deep Concord type, chunky pills, scalloped seals.
The rust-orange Dino logo/bottle (#b34a00) is the only warm accent and pops against violet.

## Colors (CSS vars in `packages/web/src/web/styles.css`)

| Token | Value | Use |
|---|---|---|
| electric-grape | #5b00ed / gradient 45deg #e30ba6 → #5b00ed | Hero, promo fields |
| deep-concord | #3f0791 | Headings, body text, outlines, filled CTAs |
| bubblegum-flash | #e30ba6 | Gradient endpoint, tiny accents |
| sky-scoop | #bfefff / gradient 0deg #d4beff 50% → #bfedfe | Feature band |
| lilac-aisle | #dad9ff | Default canvas |
| soft-grape | #cac4f4 | Muted fills, tabs |
| marshmallow | #ffffff | Cards, selectors, reversed text |
| midnight-cereal | #000000 | Footer |
| dino-rust | #b34a00 | Brand logo color, "best-seller" accent only |

## Typography
- Poppins 400/500/600/700/900 for everything. Hero 60/63 white, section 64/64 Deep Concord, nav 16 uppercase 700.
- Review proof: "Mabry Pro" → substitute Arial Black / Archivo Black, 900, 16px uppercase.
- Never below 700 for display.

## Shapes
- Cards 25px. Image/overlay panels 25 25 25 0 (square bottom-left).
- Outline selectors: white fill, 2px #3f0791, radius 52px, padding 10px 24px, Poppins 600 18/27.
- Filled conversion buttons: #3f0791, white 700, radius 20px.
- Inputs 28px radius. Badges 0px (scalloped SVG seals).
- Shadows only: 0 15px 50px rgba(0,0,0,.08) and 0 20px 60px rgba(0,0,0,.1) for elevated cards.

## Pages
- `/` — announcement bar, nav over violet, full-bleed hero (image + size selector + add to cart + seals),
  claims marquee (lilac), benefits row, ingredients band (sky scoop), 3 sizes grid, reviews (violet gradient), FAQ, black footer.
- `/checkout` — contact + shipping form, shipping method, demo payment, order summary in elevated card.
- `/merci/:number` — order confirmation.
- Cart drawer slides from right on every page.
