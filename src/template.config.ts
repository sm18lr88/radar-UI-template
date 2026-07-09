import { Activity, Boxes, ChartNoAxesCombined, Component, LayoutDashboard, Settings, Sparkles } from 'lucide-react'
import { defineSurfaceRegistry } from './surface-registry'
import type { TemplateConfig } from './types'

export const templateConfig = {
  brand: {
    appName: 'Northstar Console',
    tagline: 'A cool, dense control room for modern product teams.',
    markLabel: 'N',
    websiteTitle: 'Build product surfaces that feel as sharp as your infrastructure.',
    websiteLead: 'Start from a Radar-inspired shell, token system, and component kit built for apps, websites, and future agents.',
  },
  website: {
    badge: 'Reusable app + website kit',
    openAppLabel: 'Open app',
    primaryCta: 'Start from the app shell',
    secondaryCta: 'Browse primitives',
    features: [
      { title: 'Typed config', description: 'Keep identity, routes, and demo content in one typed source of truth.' },
      { title: 'Token-first styling', description: 'Build with Radar-inspired semantic tokens that stay coherent in light and dark modes.' },
      { title: 'Browser QA ready', description: 'Ship with responsive, keyboard, contrast, browser, and Electron smoke coverage.' },
    ],
    faqTitle: 'FAQ',
    faq: [
      { question: 'Can I rebrand it?', answer: 'Yes. Start with `src/template.config.ts`, then follow the rebrand checklist.' },
      { question: 'Can I remove demos?', answer: 'Yes. Disable complete surfaces in the registry or delete demo-only content in a copied product.' },
      { question: 'Can agents extend it?', answer: 'Yes. The agent guide, ownership map, and quality gates define safe extension points.' },
    ],
    footer: 'Built from the Radar UI language. Replace brand, copy, and demo data before shipping.',
  },
  surfaces: defineSurfaceRegistry({
    defaultRoute: '/app',
    routes: {
      '/app': {
        enabled: true,
        nav: { order: 0, id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Operational overview and trend cards' },
        command: { order: 0, id: 'open-dashboard', label: 'Open dashboard', description: 'Return to the main overview', shortcut: 'G D', keywords: ['home', 'overview'] },
      },
      '/app/table': {
        enabled: true,
        nav: { order: 1, id: 'table', label: 'Table', icon: Activity, description: 'Dense table and filter pattern' },
        command: { order: 1, id: 'open-table', label: 'Open table demo', description: 'Inspect the dense data-table pattern', shortcut: 'G T', keywords: ['records', 'list'] },
      },
      '/app/detail': {
        enabled: true,
        nav: { order: 2, id: 'detail', label: 'Detail', icon: Boxes, description: 'Detail drawer and summary cards' },
      },
      '/app/preferences': {
        enabled: true,
        nav: { order: 3, id: 'preferences', label: 'Preferences', icon: Settings, description: 'Dialog and form controls' },
        command: { order: 4, id: 'open-preferences', label: 'Open preferences', description: 'Review configurable controls', shortcut: 'G S', keywords: ['settings', 'theme'] },
      },
      '/app/states': {
        enabled: true,
        nav: { order: 4, id: 'states', label: 'States', icon: ChartNoAxesCombined, description: 'Loading, empty, and error states' },
      },
      '/primitives': {
        enabled: true,
        nav: { order: 5, id: 'primitives', label: 'Primitives', icon: Component, description: 'Reusable component gallery' },
        command: { order: 2, id: 'open-primitives', label: 'Open primitives gallery', description: 'Review badges, cards, dialogs, and states', shortcut: 'G P', keywords: ['components', 'ui'] },
      },
      '/site': {
        enabled: true,
        nav: { order: 6, id: 'site', label: 'Website', icon: Sparkles, description: 'Landing page surface' },
        command: { order: 3, id: 'open-website', label: 'Open website demo', description: 'See the marketing surface', shortcut: 'G W', keywords: ['landing', 'hero'] },
      },
    },
  }),
  metrics: [
    { label: 'Signals triaged', value: '1,284', change: '+12.8%', tone: 'success' },
    { label: 'Open decisions', value: '37', change: '-4 today', tone: 'info' },
    { label: 'Risk queue', value: '8', change: '2 urgent', tone: 'alert' },
    { label: 'Automation health', value: '99.4%', change: '+0.3%', tone: 'success' },
  ],
  records: [
    { id: 'rec-1', name: 'Billing workflow', owner: 'Revenue', status: 'success', statusLabel: 'Healthy', impact: 'High', updated: '2m ago' },
    { id: 'rec-2', name: 'Signup funnel', owner: 'Growth', status: 'warning', statusLabel: 'Watch', impact: 'Medium', updated: '9m ago' },
    { id: 'rec-3', name: 'Reports export', owner: 'Operations', status: 'alert', statusLabel: 'Needs review', impact: 'High', updated: '18m ago' },
    { id: 'rec-4', name: 'Mobile onboarding', owner: 'Product', status: 'info', statusLabel: 'Shipping', impact: 'Medium', updated: '31m ago' },
    { id: 'rec-5', name: 'Data warehouse sync', owner: 'Platform', status: 'error', statusLabel: 'Blocked', impact: 'Critical', updated: '44m ago' },
  ],
} satisfies TemplateConfig

export type { TemplateConfig }
