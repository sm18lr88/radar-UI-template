import { Badge, Card, Dialog, EmptyState, ErrorState, Facet, LoadingState, PageHeader, StatusDot, Summary, Tooltip } from '../components/ui'
import { useState } from 'react'

export function PrimitivesPage() {
  const [open, setOpen] = useState(false)
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Primitives" title="Component gallery" description="Copy these building blocks for dashboards, settings pages, and marketing sections." />
      <Card title="Badges and status dots" eyebrow="Status vocabulary">
        <div className="flex flex-wrap gap-2">
          {(['success', 'warning', 'alert', 'error', 'info', 'neutral', 'note', 'accent1', 'accent2', 'accent3', 'structural'] as const).map((tone) => <Badge key={tone} tone={tone}>{tone}</Badge>)}
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          {(['success', 'warning', 'alert', 'error', 'info', 'neutral'] as const).map((tone) => <StatusDot key={tone} tone={tone} label={tone} />)}
        </div>
      </Card>
      <div className="grid gap-4 lg:grid-cols-3">
        <LoadingState label="Loading preview" />
        <EmptyState title="No matches" description="Search and filter states should still feel designed." />
        <ErrorState title="Problem detected" description="Error states keep the user oriented and preserve density." />
      </div>
      <Card title="Facets and summaries" eyebrow="Compact facts">
        <div className="grid gap-3 sm:grid-cols-3">
          <Facet label="Owner" value="Platform" />
          <Facet label="Impact" value="High" />
          <Tooltip content="Tooltips work with hover and keyboard focus"><Badge tone="note">Focus or hover</Badge></Tooltip>
        </div>
        <div className="mt-4">
          <Summary items={[{ label: 'Status', value: 'Ready' }, { label: 'Updated', value: '2m ago' }, { label: 'Region', value: 'Global' }]} />
        </div>
      </Card>
      <Card title="Dialogs and cards" eyebrow="Layering">
        <button className="btn-brand px-4 py-2 text-sm font-medium" type="button" onClick={() => setOpen(true)}>Open dialog</button>
        <Dialog open={open} title="Reusable dialog" description="Modal containers use the `.dialog` class and theme shadows." onClose={() => setOpen(false)}>
          <p className="text-sm text-theme-text-secondary">Place forms, confirmations, or short flows here.</p>
        </Dialog>
      </Card>
    </div>
  )
}
