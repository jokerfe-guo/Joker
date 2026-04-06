-- Seed default resume sections from resume-data.ts
-- Run AFTER 0001_init.sql
-- Run: wrangler d1 execute joker-blog --file=packages/db/migrations/0002_seed_resume.sql --remote

INSERT OR IGNORE INTO resume_sections (section_key, data, sort_order, updated_at) VALUES
(
  'hero',
  '{"name":"Joker","title":"Senior Front-end Engineer","company":"Kuaishou","bio":"Crafting high-performance digital experiences with immersive aesthetics, fluid interactions, and front-end systems that survive real product scale.","avatar":"/avatar.jpg","github":"https://github.com/jokerfe-guo"}',
  0,
  unixepoch()
),
(
  'metrics',
  '[{"value":"5+","label":"Years Exp"},{"value":"40+","label":"Projects"},{"value":"12","label":"Awards"},{"value":"100%","label":"Success"}]',
  1,
  unixepoch()
),
(
  'skills',
  '[["React 19","TypeScript","Next.js"],["Motion","Three.js","Design Systems"],["Accessibility","Testing","Performance"]]',
  2,
  unixepoch()
),
(
  'experience',
  '[{"role":"Senior Front-end Engineer","company":"Nova Labs","time":"2023 - Present","body":"Owning a product surface that blends interactive storytelling, design systems, and measurable performance budgets."},{"role":"UI Platform Developer","company":"Glassline Studio","time":"2020 - 2023","body":"Built reusable front-end primitives for editorial, commerce, and portfolio experiences with a glassmorphism-first brand language."}]',
  3,
  unixepoch()
);
