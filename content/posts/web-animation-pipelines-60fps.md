---
title: "Web Animation Pipelines That Stay at 60fps"
date: 2024-06-02
tags: [Motion, Performance, CSS]
description: "The compositor thread, transform-only animations, and why your blur transition is janking on mobile."
published: true
cover: ""
---

The browser's rendering pipeline has three stages that matter for animation: style recalculation, layout, and paint. Triggering layout or paint inside an animation loop is the primary cause of frame drops.

## The Compositor Thread

Modern browsers offload certain animations to the GPU compositor thread, which runs independently of the main thread. An animation running on the compositor cannot be blocked by JavaScript.

Only two CSS properties are compositor-eligible today:
- `transform` (translate, scale, rotate, skew)
- `opacity`

Everything else — `width`, `height`, `top`, `left`, `background-color`, `border-radius` — triggers layout or paint, which runs on the main thread.

```css
/* ❌ Triggers layout on every frame */
.card { transition: width 300ms ease; }

/* ✅ Compositor-only, 60fps on any device */
.card { transition: transform 300ms ease; }
```

## will-change and Layer Promotion

`will-change: transform` tells the browser to promote the element to its own GPU layer before the animation starts, eliminating the promotion cost mid-animation:

```css
.glass-card {
  will-change: transform;
  transition: transform 220ms ease, opacity 220ms ease;
}
.glass-card:hover {
  transform: translateY(-4px);
}
```

> Promote deliberately. Every promoted layer consumes GPU memory. A page with 50 `will-change` elements will stutter worse than one with none.

## Animating Glassmorphism Surfaces

`backdrop-filter` is not compositor-eligible. Every frame of a blur animation is a full repaint. The workaround is to animate only `opacity` on the blurred element, not the blur radius itself:

```css
/* ❌ Repaints every frame */
.glass { transition: backdrop-filter 300ms; }
.glass:hover { backdrop-filter: blur(32px); }

/* ✅ Compositor-eligible fade */
.glass-overlay {
  backdrop-filter: blur(24px);
  opacity: 0;
  transition: opacity 220ms ease;
}
.glass-overlay.visible { opacity: 1; }
```

## React and the Animation Loop

In React, coordinate animations through `useLayoutEffect` or a dedicated animation library. `useState`-driven animations re-render the component tree, which can block the compositor.

```tsx
import { useRef } from 'react'

function AnimatedCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  const handleEnter = () => {
    // Direct DOM manipulation bypasses React re-render
    ref.current?.style.setProperty('transform', 'translateY(-4px)')
  }

  const handleLeave = () => {
    ref.current?.style.setProperty('transform', 'translateY(0)')
  }

  return (
    <div
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ transition: 'transform 220ms ease', willChange: 'transform' }}
    >
      {children}
    </div>
  )
}
```

For complex sequences, use the Web Animations API or a library like Motion that writes directly to the compositor without triggering React re-renders.
