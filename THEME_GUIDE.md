/**
 * Apple-Inspired Theme Guide
 * Complete documentation for using the MGCK Science theme
 */

/*
═══════════════════════════════════════════════════════════════════════════════
   THEME OVERVIEW
═══════════════════════════════════════════════════════════════════════════════

This theme implements a modern, Apple-inspired design system with:
- Navy blue (#0A1F44) as primary color
- Gold (#D4AF37) for accents
- Glassmorphism effects with backdrop blur
- Science-themed floating particle animations
- Smooth hover transitions and effects
*/

/*
═══════════════════════════════════════════════════════════════════════════════
   CSS UTILITY CLASSES
═══════════════════════════════════════════════════════════════════════════════

1. GLASSMORPHISM UTILITIES
───────────────────────────────────────────────────────────────────────────────

.glass-card
  - Frosted glass effect card
  - Blur background, soft shadows
  - Hover effect: lifts up, glows with gold
  - Use for: content cards, modal panels, dashboard widgets

.glass-navbar
  - Sticky navigation with glass effect
  - Responsive blur effect
  - Perfect for: top navigation bars

EXAMPLE HTML:
<div class="glass-card">
  <h2>My Card</h2>
  <p>Content here...</p>
</div>

─────────────────────────────────────────────────────────────────────────────

2. LAYOUT UTILITIES
───────────────────────────────────────────────────────────────────────────────

.section-container
  - Max width 1280px, centered container
  - Built-in padding
  - Use for: main page sections

.hero-section
  - Full viewport height hero with animated background
  - Centered content
  - Use for: landing page hero sections

.animated-bg
  - Gradient background animation
  - Smooth 15s animation loop
  - Layer content on top automatically

EXAMPLE HTML:
<section class="section-container">
  <h1 class="title-gradient">My Title</h1>
  <p>Content here...</p>
</section>

─────────────────────────────────────────────────────────────────────────────

3. TEXT UTILITIES
───────────────────────────────────────────────────────────────────────────────

.title-gradient
  - Large gradient text (navy to gold)
  - Font size: 48px
  - Full width gradient text effect

.title-gradient-sm
  - Smaller gradient text
  - Use for: subheadings, section titles

.text-navy, .text-gold, .text-white
  - Color utilities using theme colors

.text-glow
  - Gold text shadow glow effect

EXAMPLE HTML:
<h1 class="title-gradient">Science Society</h1>
<h3 class="title-gradient-sm">Latest Achievements</h3>

─────────────────────────────────────────────────────────────────────────────

4. SHADOW UTILITIES
───────────────────────────────────────────────────────────────────────────────

.shadow-soft         - Subtle shadow for hover states
.shadow-medium       - Medium shadow for elevated elements
.shadow-gold-glow    - Gold-colored glow shadow

EXAMPLE:
<div class="glass-card shadow-soft hover:shadow-medium">

─────────────────────────────────────────────────────────────────────────────

5. ANIMATION UTILITIES
───────────────────────────────────────────────────────────────────────────────

.glow-animation      - Pulsing gold glow effect
.smooth-hover        - Apple-style smooth hover lift

EXAMPLE HTML:
<button class="btn-primary glow-animation">
  Click Me
</button>

─────────────────────────────────────────────────────────────────────────────

6. DASHBOARD UTILITIES
───────────────────────────────────────────────────────────────────────────────

.dashboard-panel
  - Glass card styled for dashboards
  - Header with optional icon
  - Use for: admin panels, data displays

.card-grid
  - Responsive grid layout
  - Auto-fit columns
  - Gap: 24px

EXAMPLE HTML:
<div class="card-grid">
  <div class="glass-card">Card 1</div>
  <div class="glass-card">Card 2</div>
  <div class="glass-card">Card 3</div>
</div>

─────────────────────────────────────────────────────────────────────────────

7. BACKGROUND EFFECTS
───────────────────────────────────────────────────────────────────────────────

.blur-sm, .blur-md, .blur-lg
  - Apply blur filter (4px, 8px, 12px)

EXAMPLE:
<div class="blur-md">Blurred content</div>

═══════════════════════════════════════════════════════════════════════════════
   REACT COMPONENT LIBRARY
═══════════════════════════════════════════════════════════════════════════════

Import all components from: @/components/ThemeComponents

─────────────────────────────────────────────────────────────────────────────

import {
  GlassCard,
  HeroSection,
  DashboardPanel,
  GradientButton,
  AnimatedSection,
  GradientText,
  CardGrid,
  Navbar,
  Badge,
} from '@/components/ThemeComponents';

import FloatingParticles from '@/components/FloatingParticles';

1. GlassCard
───────────────────────────────────────────────────────────────────────────────
<GlassCard className="p-6">
  <h3>Card Content</h3>
</GlassCard>

Props:
  - children: React.ReactNode
  - className?: string (additional classes)
  - onClick?: () => void (optional click handler)

─────────────────────────────────────────────────────────────────────────────

2. HeroSection
───────────────────────────────────────────────────────────────────────────────
<HeroSection
  title="Senior Science Society"
  subtitle="Discover Innovation"
>
  <p>Additional content here</p>
</HeroSection>

Props:
  - title: string (required)
  - subtitle?: string
  - children?: React.ReactNode
  - className?: string

─────────────────────────────────────────────────────────────────────────────

3. DashboardPanel
───────────────────────────────────────────────────────────────────────────────
<DashboardPanel
  title="Statistics"
  icon="📊"
  actions={<button>View More</button>}
>
  <p>Panel content</p>
</DashboardPanel>

Props:
  - title: string
  - icon?: React.ReactNode
  - children: React.ReactNode
  - className?: string
  - actions?: React.ReactNode

─────────────────────────────────────────────────────────────────────────────

4. GradientButton
───────────────────────────────────────────────────────────────────────────────
<GradientButton
  variant="primary"
  size="md"
  onClick={() => console.log('Clicked!')}
>
  Click Me
</GradientButton>

Props:
  - children: React.ReactNode
  - variant?: 'primary' | 'secondary'
  - size?: 'sm' | 'md' | 'lg'
  - All standard HTML button attributes

─────────────────────────────────────────────────────────────────────────────

5. GradientText
───────────────────────────────────────────────────────────────────────────────
<GradientText size="lg">
  Amazing Title
</GradientText>

Props:
  - children: React.ReactNode
  - size?: 'sm' | 'md' | 'lg' | 'xl'
  - className?: string

─────────────────────────────────────────────────────────────────────────────

6. Navbar
───────────────────────────────────────────────────────────────────────────────
<Navbar
  logo="MGCK"
  items={[
    { label: 'Home', href: '/' },
    { label: 'Events', href: '/events' },
    { label: 'Achievements', href: '/achievements' },
  ]}
  actions={<GradientButton>Sign In</GradientButton>}
/>

Props:
  - logo?: React.ReactNode
  - items?: Array<{ label: string; href: string }>
  - actions?: React.ReactNode

─────────────────────────────────────────────────────────────────────────────

7. FloatingParticles
───────────────────────────────────────────────────────────────────────────────
// Add to your layout for animated particles background
<FloatingParticles />

// In your layout:
app/layout.tsx:
<html>
  <body>
    <FloatingParticles />
    {children}
  </body>
</html>

─────────────────────────────────────────────────────────────────────────────

8. Badge
───────────────────────────────────────────────────────────────────────────────
<Badge variant="primary">New</Badge>
<Badge variant="secondary">Featured</Badge>

Props:
  - children: React.ReactNode
  - variant?: 'primary' | 'secondary' | 'success' | 'warning'

═══════════════════════════════════════════════════════════════════════════════
   COMPLETE PAGE EXAMPLE
═══════════════════════════════════════════════════════════════════════════════

import {
  HeroSection,
  GradientButton,
  AnimatedSection,
  GlassCard,
  CardGrid,
  Navbar,
  Badge,
} from '@/components/ThemeComponents';
import FloatingParticles from '@/components/FloatingParticles';

export default function Home() {
  return (
    <>
      <FloatingParticles />
      
      <Navbar
        logo="MGCK Science"
        items={[
          { label: 'Home', href: '/' },
          { label: 'Events', href: '/events' },
        ]}
      />

      <HeroSection
        title="Senior Science Society"
        subtitle="Building Tomorrow's Scientists"
      >
        <GradientButton size="lg">Explore Now</GradientButton>
      </HeroSection>

      <AnimatedSection>
        <h2 className="title-gradient mb-8">Featured Achievements</h2>
        <CardGrid>
          <GlassCard>
            <Badge>Research</Badge>
            <h3 className="mt-4">Amazing Discovery</h3>
          </GlassCard>
          <GlassCard>
            <Badge variant="secondary">Competition</Badge>
            <h3 className="mt-4">Won First Prize</h3>
          </GlassCard>
        </CardGrid>
      </AnimatedSection>
    </>
  );
}

═══════════════════════════════════════════════════════════════════════════════
   COLOR REFERENCE
═══════════════════════════════════════════════════════════════════════════════

Primary: Navy Blue         #0A1F44
Accent:  Gold             #D4AF37
Neutral: White            #FFFFFF

CSS Variables Available:
  --color-navy              Navy blue color
  --color-gold              Gold accent color
  --color-white             Pure white
  --glass-light             Light glass effect color
  --glass-border            Glass border color
  --shadow-soft             Soft shadow
  --shadow-medium           Medium shadow
  --shadow-gold-glow        Gold glow shadow

═══════════════════════════════════════════════════════════════════════════════
   ANIMATION REFERENCE
═══════════════════════════════════════════════════════════════════════════════

@keyframe float              - Particle floating up animation (15-25s)
@keyframe pulse-gentle       - Gentle pulse effect
@keyframe shimmer           - Shimmer/shine effect
@keyframe glow              - Pulsing gold glow
@keyframe gradient-shift    - Gradient background animation

═══════════════════════════════════════════════════════════════════════════════
*/
