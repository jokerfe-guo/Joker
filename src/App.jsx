import { useState } from 'react'
import wangLeehomImage from './assets/wang-leehom.jpg'

const screens = [
  { id: 'resume', label: 'Resume' },
  { id: 'blog-home', label: 'Blog' },
  { id: 'article', label: 'Article' },
  { id: 'project', label: 'Project' },
]

const skillGroups = [
  ['React 19', 'TypeScript', 'Next.js'],
  ['Motion', 'Three.js', 'Design Systems'],
  ['Accessibility', 'Testing', 'Performance'],
]

const experience = [
  {
    role: 'Senior Front-end Engineer',
    company: 'Nova Labs',
    time: '2023 - Present',
    body: 'Owning a product surface that blends interactive storytelling, design systems, and measurable performance budgets.',
  },
  {
    role: 'UI Platform Developer',
    company: 'Glassline Studio',
    time: '2020 - 2023',
    body: 'Built reusable front-end primitives for editorial, commerce, and portfolio experiences with a glassmorphism-first brand language.',
  },
]

const articles = [
  {
    title: 'Mastering CSS Grid with Glassmorphism',
    meta: 'OCT 12 • 8 MIN READ',
    tags: ['CSS Architecture', 'UI Physics'],
  },
  {
    title: 'Advanced TypeScript Design Patterns for React Apps',
    meta: 'AUG 28 • 12 MIN READ',
    tags: ['TypeScript', 'Architecture'],
  },
  {
    title: 'Web Animation Pipelines That Stay at 60fps',
    meta: 'JUN 02 • 6 MIN READ',
    tags: ['Motion', 'Performance'],
  },
]

export default function App() {
  const [activeScreen, setActiveScreen] = useState('resume')

  return (
    <main className="app-shell">
      <div className="noise-layer" />
      <div className="orb orb-left" />
      <div className="orb orb-right" />

      <aside className="side-rail">
        <div className="rail-logo">AI</div>
        <div className="rail-dots">
          {screens.map((screen) => (
            <button
              key={screen.id}
              type="button"
              aria-label={screen.label}
              className={screen.id === activeScreen ? 'rail-dot active' : 'rail-dot'}
              onClick={() => setActiveScreen(screen.id)}
            />
          ))}
        </div>
      </aside>

      <div className="page-shell">
        {activeScreen === 'resume' && (
          <ResumeScreen activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
        )}
        {activeScreen === 'blog-home' && (
          <BlogHomeScreen activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
        )}
        {activeScreen === 'article' && (
          <ArticleScreen activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
        )}
        {activeScreen === 'project' && (
          <ProjectScreen activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
        )}
      </div>
    </main>
  )
}

function ResumeScreen({ activeScreen, setActiveScreen }) {
  return (
    <section className="screen">
      <nav className="floating-nav glass">
        <span className="brand-mark">Joker.AI</span>
        <div className="screen-switcher" aria-label="Screens">
          {screens.map((screen) => (
            <button
              key={screen.id}
              type="button"
              className={screen.id === activeScreen ? 'switch-pill active' : 'switch-pill'}
              onClick={() => setActiveScreen(screen.id)}
            >
              {screen.label}
            </button>
          ))}
        </div>
        <button type="button" className="cta-button">
          Contact
        </button>
      </nav>

      <section id="home" className="hero-section glass organic-card">
        <div className="hero-copy">
          <span className="availability-pill">Currently at Kuaishou</span>
          <div className="hero-heading">
            <h2>Joker</h2>
            <span className="hero-subtitle">
              <span className="hero-subtitle__orb" aria-hidden="true" />
              <span className="hero-subtitle__text">Senior Front-end Engineer</span>
            </span>
          </div>
          <p>
            Crafting high-performance digital experiences with immersive aesthetics, fluid
            interactions, and front-end systems that survive real product scale.
          </p>

          <div className="hero-actions">
            <button type="button" className="soft-button primary">
              View My Blog
            </button>
            <a
              className="soft-button"
              href="https://github.com/jokerfe-guo"
              target="_blank"
              rel="noreferrer"
            >
              View Github
            </a>
          </div>
        </div>

        <div className="hero-portrait">
          <div className="portrait-aura" />
          <div className="portrait-ring">
            <div className="portrait-shell">
              <div className="portrait-face">
                <img className="portrait-image" src={wangLeehomImage} alt="Wang Leehom portrait" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="metric-row">
        {[
          ['5+', 'Years Exp'],
          ['40+', 'Projects'],
          ['12', 'Awards'],
          ['100%', 'Success'],
        ].map(([value, label], index) => (
          <article key={label} className={index % 2 === 0 ? 'metric-card glass metric-a' : 'metric-card glass metric-b'}>
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>

      <section className="resume-grid">
        <article id="skills" className="glass content-card">
          <p className="eyebrow">Skills</p>
          <h3>Interface engineering with aesthetic discipline.</h3>
          <div className="skill-columns">
            {skillGroups.map((group) => (
              <div key={group.join('-')} className="skill-stack">
                {group.map((item) => (
                  <span key={item} className="skill-tile">
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </article>

        <article id="experience" className="glass content-card">
          <p className="eyebrow">Experience</p>
          <div className="timeline-stack">
            {experience.map((item) => (
              <div key={item.role} className="timeline-item">
                <div className="timeline-node" />
                <div>
                  <strong>{item.role}</strong>
                  <span>
                    {item.company} • {item.time}
                  </span>
                  <p>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </section>
  )
}

function BlogHomeScreen({ activeScreen, setActiveScreen }) {
  return (
    <section className="screen blog-layout-screen">
      <nav className="floating-nav glass">
        <span className="brand-mark">Joker.AI</span>
        <div className="screen-switcher" aria-label="Screens">
          {screens.map((screen) => (
            <button
              key={screen.id}
              type="button"
              className={screen.id === activeScreen ? 'switch-pill active' : 'switch-pill'}
              onClick={() => setActiveScreen(screen.id)}
            >
              {screen.label}
            </button>
          ))}
        </div>
      </nav>

      <header className="blog-header">
        <div>
          <p className="eyebrow">DevLog v2.0.4</p>
          <h2>Tech Blog Home with Timeline</h2>
          <p className="subdued">
            Front-end engineering, UI physics, and modern web architecture.
          </p>
        </div>
        <div className="search-shell glass">Search articles...</div>
      </header>

      <div className="blog-grid">
        <aside className="blog-timeline glass">
          <div className="blog-line" />
          <strong>2024</strong>
          {['October', 'August', 'June', 'May'].map((month, index) => (
            <div key={month} className={index === 0 ? 'blog-month active' : 'blog-month'}>
              <span />
              {month}
            </div>
          ))}
          <strong className="muted-year">2023</strong>
        </aside>

        <div className="blog-feed">
          {articles.map((article) => (
            <article key={article.title} className="glass blog-card">
              <div className="blog-card-meta">
                <div className="tag-list">
                  {article.tags.map((tag) => (
                    <span key={tag} className="tag-chip">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="subdued">{article.meta}</span>
              </div>
              <h3>{article.title}</h3>
              <p className="subdued">
                Notes on blur stacks, render cost, motion systems, and the compositional rules that
                make glossy interfaces feel engineered instead of decorative.
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ArticleScreen({ activeScreen, setActiveScreen }) {
  return (
    <section className="screen article-layout-screen">
      <nav className="floating-nav glass">
        <span className="brand-mark">Joker.AI</span>
        <div className="screen-switcher" aria-label="Screens">
          {screens.map((screen) => (
            <button
              key={screen.id}
              type="button"
              className={screen.id === activeScreen ? 'switch-pill active' : 'switch-pill'}
              onClick={() => setActiveScreen(screen.id)}
            >
              {screen.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="progress-track">
        <div className="progress-fill" />
      </div>

      <article className="glass article-card">
        <p className="eyebrow">Article Detail</p>
        <h2>Mastering CSS Grid with Glassmorphism</h2>
        <div className="article-meta">
          <span>By Alex Riverside</span>
          <span>Oct 12, 2024</span>
          <span>8 min read</span>
        </div>

        <div className="article-hero-panel">
          <div className="article-glow" />
          <div className="article-hero-copy">Grid Systems / Rendering / Blur Layers</div>
        </div>

        <div className="article-prose">
          <p>
            Glassmorphism becomes credible when the structure underneath it is rigid. A strong grid
            gives translucency something to contrast against, and it controls visual rhythm before any
            effect layer is added.
          </p>
          <p>
            The practical rule is to isolate blur-heavy surfaces, keep stacking contexts predictable,
            and animate transform and opacity instead of repaint-heavy properties across large panels.
          </p>
          <blockquote>
            Build the composition first. Blur and glow should reinforce the hierarchy, not invent it.
          </blockquote>
          <p>
            In production React code, that usually translates to a small set of reusable surface
            primitives with fixed elevation tokens, restrained gradients, and real spacing discipline.
          </p>
        </div>
      </article>
    </section>
  )
}

function ProjectScreen({ activeScreen, setActiveScreen }) {
  return (
    <section className="screen project-layout-screen">
      <nav className="floating-nav glass">
        <span className="brand-mark">Joker.AI</span>
        <div className="screen-switcher" aria-label="Screens">
          {screens.map((screen) => (
            <button
              key={screen.id}
              type="button"
              className={screen.id === activeScreen ? 'switch-pill active' : 'switch-pill'}
              onClick={() => setActiveScreen(screen.id)}
            >
              {screen.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="project-backdrop" />

      <article className="project-modal glass">
        <div className="project-preview">
          <div className="project-preview-shine" />
          <div className="project-preview-frame">Case Study Preview</div>
        </div>

        <div className="project-copy">
          <p className="eyebrow">Featured Project</p>
          <h2>Project Detail Modal Overlay</h2>
          <p className="subdued">
            A cinematic overlay for portfolio case studies. The layout combines layered blur,
            restrained accent light, and compact metadata so the story stays readable even with a
            dramatic visual treatment.
          </p>

          <div className="project-stats">
            <div>
              <strong>Role</strong>
              <span>Lead Front-end</span>
            </div>
            <div>
              <strong>Stack</strong>
              <span>React / Motion / WebGL</span>
            </div>
            <div>
              <strong>Impact</strong>
              <span>+28% engagement</span>
            </div>
          </div>

          <div className="hero-actions">
            <button type="button" className="soft-button primary">
              Open Case Study
            </button>
            <button type="button" className="soft-button">
              Close Overlay
            </button>
          </div>
        </div>
      </article>
    </section>
  )
}
