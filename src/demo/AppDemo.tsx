import { Bell, Filter, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import type { AppRoute, TemplateConfig, Tone } from '../types'
import { Badge, Card, Dialog, EmptyState, ErrorState, LoadingState, MetricTile, PageHeader, StatusDot } from '../components/ui'
import { useToast } from '../components/providers/ToastProvider'

type AppDemoProps = {
  readonly route: AppRoute
  readonly config: TemplateConfig
}

export function AppDemo({ route, config }: AppDemoProps) {
  const [settingsOpen, setSettingsOpen] = useState(route === '/app/preferences')
  const { pushToast } = useToast()

  if (route === '/app/table') return <TableDemo config={config} />
  if (route === '/app/detail') return <DetailDemo config={config} />
  if (route === '/app/preferences') return <SettingsDemo appName={config.brand.appName} open={settingsOpen} onOpenChange={setSettingsOpen} />
  if (route === '/app/states') return <StatesDemo onCreate={() => pushToast({ tone: 'success', title: 'Example created', message: 'Replace this callback with the product creation flow.' })} />

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-theme-border bg-theme-surface p-6 shadow-theme-md">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <Badge tone="note">Radar-inspired template</Badge>
            <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-theme-text-primary xl:text-5xl">{config.brand.tagline}</h1>
            <p className="mt-3 max-w-2xl text-base text-theme-text-secondary">Use this dashboard surface for dense product operations, internal tools, or SaaS control rooms.</p>
          </div>
          <button className="btn-brand px-4 py-2 text-sm font-medium" type="button" onClick={() => pushToast({ tone: 'success', title: 'Template ready', message: 'Toast provider, badges, and shell interactions are wired.' })}>
            Trigger toast
          </button>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {config.metrics.map((metric) => (
          <MetricTile key={metric.label} label={metric.label} value={metric.value} change={metric.change}>
            <StatusDot tone={metric.tone} label={metric.tone} />
          </MetricTile>
        ))}
      </section>
      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <Card title="Priority stream" eyebrow="Live surface" action={<Badge tone="structural">{config.records.length} items</Badge>}>
          <div className="space-y-3">
            {config.records.map((record) => (
              <div key={record.id} className="flex items-center justify-between gap-3 rounded-lg border border-theme-border bg-theme-base p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-theme-text-primary">{record.name}</p>
                  <p className="text-xs text-theme-text-tertiary">{record.owner} · {record.updated}</p>
                </div>
                <Badge tone={record.status}>{record.statusLabel}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Control panel" eyebrow="Slots and actions">
          <div className="space-y-3 text-sm text-theme-text-secondary">
            <div className="card-inner-lg flex items-center gap-3"><SlidersHorizontal className="h-4 w-4 text-accent" aria-hidden="true" />Slot controls live in `AppShell` props.</div>
            <div className="card-inner-lg flex items-center gap-3"><Bell className="h-4 w-4 text-accent" aria-hidden="true" />Toasts are app-level and theme-aware.</div>
            <div className="card-inner-lg flex items-center gap-3"><Filter className="h-4 w-4 text-accent" aria-hidden="true" />Filters, tables, and cards use the same token layer.</div>
          </div>
        </Card>
      </section>
    </div>
  )
}

type TableFilter = {
  readonly label: 'All' | 'Healthy' | 'Needs review' | 'Blocked'
  readonly statuses: readonly Tone[] | undefined
}

const tableFilters: readonly [TableFilter, ...TableFilter[]] = [
  { label: 'All', statuses: undefined },
  { label: 'Healthy', statuses: ['success'] },
  { label: 'Needs review', statuses: ['warning', 'alert'] },
  { label: 'Blocked', statuses: ['error'] },
]

function TableDemo({ config }: { readonly config: TemplateConfig }) {
  const [activeFilter, setActiveFilter] = useState<TableFilter>(tableFilters[0])
  const activeStatuses = activeFilter.statuses
  const visibleRecords = activeStatuses === undefined
    ? config.records
    : config.records.filter((record) => activeStatuses.includes(record.status))
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Dense data" title="Operational records" description="Prioritize columns by viewport, filter the live set, and keep status visible at every width." />
      <Card title="Table demo" eyebrow="Responsive table" action={<Badge tone="note">{activeFilter.label}</Badge>}>
        <div className="mb-4 flex flex-wrap gap-2">
          {tableFilters.map((filter) => (
            <button
              key={filter.label}
              className={activeFilter.label === filter.label ? 'selection-strong selection-ring rounded-full' : 'rounded-full'}
              type="button"
              aria-pressed={activeFilter.label === filter.label}
              onClick={() => setActiveFilter(filter)}
            >
              <Badge tone="structural">{filter.label}</Badge>
            </button>
          ))}
        </div>
        <div className="overflow-hidden rounded-xl border border-theme-border">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-theme-elevated text-xs uppercase tracking-[0.14em] text-theme-text-tertiary">
              <tr><th className="px-4 py-3">Name</th><th className="hidden px-4 py-3 xl:table-cell">Owner</th><th className="hidden px-4 py-3 lg:table-cell">Impact</th><th className="px-4 py-3">Status</th><th className="hidden px-4 py-3 xl:table-cell">Updated</th></tr>
            </thead>
            <tbody className="divide-y divide-theme-border-subtle bg-theme-surface">
              {visibleRecords.map((record) => (
                <tr key={record.id} className="hover:bg-theme-hover">
                  <th scope="row" className="whitespace-nowrap px-4 py-3 text-left font-medium text-theme-text-primary">{record.name}</th>
                  <td className="hidden px-4 py-3 text-theme-text-secondary xl:table-cell">{record.owner}</td>
                  <td className="hidden px-4 py-3 lg:table-cell"><Badge tone="structural">{record.impact}</Badge></td>
                  <td className="whitespace-nowrap px-4 py-3"><Badge tone={record.status}>{record.statusLabel}</Badge></td>
                  <td className="hidden px-4 py-3 text-theme-text-tertiary xl:table-cell">{record.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function DetailDemo({ config }: { readonly config: TemplateConfig }) {
  const record = config.records[0]
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Context" title="Detail workspace" description="Combine compact facts, related objects, and a contextual drawer without coupling the shell to domain data." />
      <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-4">
          <Card title="Detail surface" eyebrow="Summary and relationships">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="card-inner-lg"><p className="text-xs text-theme-text-tertiary">Owner</p><p className="text-sm font-medium text-theme-text-primary">{record?.owner}</p></div>
              <div className="card-inner-lg"><p className="text-xs text-theme-text-tertiary">Impact</p><p className="text-sm font-medium text-theme-text-primary">{record?.impact}</p></div>
              <div className="card-inner-lg"><p className="text-xs text-theme-text-tertiary">Updated</p><p className="text-sm font-medium text-theme-text-primary">{record?.updated}</p></div>
            </div>
            <p className="mt-4 text-sm leading-6 text-theme-text-secondary">Detail pages should combine compact facts, related objects, and action slots without requiring the shell to know domain data.</p>
          </Card>
          <Card title="Related context" eyebrow="Nearby signals">
            <div className="grid gap-3 sm:grid-cols-3">
              {config.records.slice(1, 4).map((related) => (
                <div key={related.id} className="card-inner-lg">
                  <div className="flex items-start justify-between gap-2"><p className="text-sm font-medium text-theme-text-primary">{related.name}</p><StatusDot tone={related.status} label={related.statusLabel} /></div>
                  <p className="mt-2 text-xs text-theme-text-tertiary">{related.owner} · {related.updated}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <aside className="rounded-xl border border-theme-border bg-theme-surface p-4 shadow-drawer">
          <Badge tone={record?.status ?? 'neutral'}>{record?.statusLabel ?? 'Unknown'}</Badge>
          <h2 className="mt-4 text-xl font-semibold text-theme-text-primary">{record?.name ?? 'Selected record'}</h2>
          <p className="mt-2 text-sm text-theme-text-secondary">Use this drawer pattern for contextual detail without leaving the workspace.</p>
        </aside>
      </div>
    </div>
  )
}

function SettingsDemo({ appName, open, onOpenChange }: { readonly appName: string; readonly open: boolean; readonly onOpenChange: (open: boolean) => void }) {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Configuration" title="Preferences" description="Keep settings entry points explicit and isolate short edits in an accessible modal flow." />
      <Card title="Workspace defaults" eyebrow="Dialog form">
        <button className="btn-brand px-4 py-2 text-sm font-medium" type="button" onClick={() => onOpenChange(true)}>Open settings dialog</button>
      </Card>
      <Dialog open={open} title="Settings dialog" description="A reusable modal pattern with tokenized surfaces." onClose={() => onOpenChange(false)}>
        <div className="space-y-4">
          <label className="block text-sm text-theme-text-secondary">Workspace name<input className="mt-1 w-full rounded-lg border border-theme-border bg-theme-elevated px-3 py-2 text-theme-text-primary" defaultValue={appName} /></label>
          <label className="block text-sm text-theme-text-secondary">Default view<select className="mt-1 w-full rounded-lg border border-theme-border bg-theme-elevated px-3 py-2 text-theme-text-primary" defaultValue="dashboard"><option value="dashboard">Dashboard</option><option value="table">Table</option></select></label>
          <button className="btn-brand px-4 py-2 text-sm font-medium" type="button" onClick={() => onOpenChange(false)}>Save preferences</button>
        </div>
      </Dialog>
    </div>
  )
}

function StatesDemo({ onCreate }: { readonly onCreate: () => void }) {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="System feedback" title="State patterns" description="Loading, empty, success, and error feedback preserve orientation without changing the page skeleton." />
      <div className="grid gap-4 lg:grid-cols-3">
        <LoadingState />
        <EmptyState title="Nothing here yet" description="Use this when a user has no data, no results, or a clean first-run state." action={<button className="btn-brand px-3 py-2 text-sm" type="button" onClick={onCreate}>Create example</button>} />
        <ErrorState title="Could not load preview" description="Show the user what failed and what they can try next without breaking the layout." />
      </div>
    </div>
  )
}
