/**
 * Theme Components Library
 * Reusable components following the Apple-inspired design
 */

import React from 'react';

// ============================================================================
// Glass Card Component
// ============================================================================
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  onClick,
}) => {
  return (
    <div
      className={`glass-card ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

// ============================================================================
// Hero Section Component
// ============================================================================
interface HeroSectionProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  children,
  className = '',
}) => {
  return (
    <section className={`hero-section ${className}`}>
      <div className="hero-content">
        <h1 className="title-gradient mb-6">{title}</h1>
        {subtitle && (
          <p className="text-lg text-gray-600 mb-8">{subtitle}</p>
        )}
        {children}
      </div>
    </section>
  );
};

// ============================================================================
// Dashboard Panel Component
// ============================================================================
interface DashboardPanelProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export const DashboardPanel: React.FC<DashboardPanelProps> = ({
  title,
  icon,
  children,
  className = '',
  actions,
}) => {
  return (
    <div className={`dashboard-panel ${className}`}>
      <div className="dashboard-panel-header">
        <div className="flex items-center gap-3">
          {icon && <div className="text-gold text-2xl">{icon}</div>}
          <h2 className="text-xl font-semibold text-navy">{title}</h2>
        </div>
        {actions}
      </div>
      <div className="panel-content">{children}</div>
    </div>
  );
};

// ============================================================================
// Gradient Button Component
// ============================================================================
interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const buttonClass =
    variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  const sizeClass =
    size === 'sm'
      ? 'px-4 py-2 text-sm'
      : size === 'lg'
        ? 'px-8 py-4 text-lg'
        : 'px-6 py-3';

  return (
    <button
      className={`${buttonClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// ============================================================================
// Animated Section Component
// ============================================================================
interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`animated-bg section-container ${className}`}>
      {children}
    </div>
  );
};

// ============================================================================
// Gradient Text Component
// ============================================================================
interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  className = '',
  size = 'md',
}) => {
  const sizeClass =
    size === 'sm'
      ? 'title-gradient-sm text-2xl'
      : size === 'md'
        ? 'title-gradient text-4xl'
        : size === 'lg'
          ? 'title-gradient text-5xl'
          : 'title-gradient text-6xl';

  return <div className={`${sizeClass} ${className}`}>{children}</div>;
};

// ============================================================================
// Card Grid Component
// ============================================================================
interface CardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
}

export const CardGrid: React.FC<CardGridProps> = ({
  children,
  columns = 3,
}) => {
  const gridClass = `grid grid-cols-1 md:grid-cols-${columns} gap-6 p-6`;

  return <div className={gridClass}>{children}</div>;
};

// ============================================================================
// Navbar Component
// ============================================================================
interface NavbarProps {
  logo?: React.ReactNode;
  items?: Array<{ label: string; href: string }>;
  actions?: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({ logo, items = [], actions }) => {
  return (
    <nav className="glass-navbar">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {logo && <div className="text-2xl font-bold text-gold">{logo}</div>}
          <div className="hidden md:flex gap-8">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-navy hover:text-gold transition-colors text-sm font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
        {actions && <div>{actions}</div>}
      </div>
    </nav>
  );
};

// ============================================================================
// Badge Component
// ============================================================================
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
}) => {
  const variantClass =
    variant === 'primary'
      ? 'bg-navy text-white'
      : variant === 'secondary'
        ? 'bg-gold text-navy'
        : variant === 'success'
          ? 'bg-green-500 text-white'
          : 'bg-yellow-500 text-navy';

  return (
    <span
      className={`${variantClass} px-3 py-1 rounded-full text-xs font-semibold inline-block`}
    >
      {children}
    </span>
  );
};
