import { Search, X } from 'lucide-react'
import { useEffect, useEffectEvent, useId, useMemo, useState } from 'react'
import type { CommandItem } from '../../types'
import { EmptyState } from '../ui/StateBlocks'
import { useModalDialog } from '../ui/useModalDialog'

export type CommandPaletteProps = {
  readonly open: boolean
  readonly commands: readonly CommandItem[]
  readonly onClose: () => void
  readonly onSelect: (path: CommandItem['path']) => void
}

type CommandPaletteContentProps = Omit<CommandPaletteProps, 'open'>

function matchesCommand(command: CommandItem, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  const haystack = [command.label, command.description, ...command.keywords].join(' ').toLowerCase()
  return haystack.includes(normalized)
}

function CommandPaletteContent({ commands, onClose, onSelect }: CommandPaletteContentProps) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const listboxId = useId()
  const dialogRef = useModalDialog(true, onClose)
  const filtered = useMemo(() => commands.filter((command) => matchesCommand(command, query)), [commands, query])
  const onPaletteKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.isComposing || !(event.target instanceof HTMLInputElement) || event.target.getAttribute('role') !== 'combobox') return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, Math.max(filtered.length - 1, 0)))
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    }
    if (event.key === 'Home') {
      event.preventDefault()
      setActiveIndex(0)
    }
    if (event.key === 'End') {
      event.preventDefault()
      setActiveIndex(Math.max(filtered.length - 1, 0))
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      const command = filtered[activeIndex]
      if (command) {
        onSelect(command.path)
        onClose()
      }
    }
  })

  useEffect(() => {
    window.addEventListener('keydown', onPaletteKeyDown)
    return () => window.removeEventListener('keydown', onPaletteKeyDown)
  }, [])

  useEffect(() => {
    const command = filtered[activeIndex]
    if (command) document.getElementById(`${listboxId}-${command.id}`)?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, filtered, listboxId])

  return (
    <dialog ref={dialogRef} className="dialog dialog-modal mb-auto mt-[10vh] max-h-[80vh] w-full max-w-2xl overflow-hidden p-0 text-theme-text-primary" aria-label="Command palette">
      <div className="flex items-center gap-3 border-b-subtle px-4 py-3">
        <Search className="h-5 w-5 text-theme-text-tertiary" aria-hidden="true" />
        <input
          autoFocus
          aria-label="Search commands"
          aria-activedescendant={filtered[activeIndex] ? `${listboxId}-${filtered[activeIndex].id}` : undefined}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded="true"
          className="min-w-0 flex-1 bg-transparent text-base text-theme-text-primary outline-none"
          role="combobox"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActiveIndex(0)
          }}
        />
        <button className="rounded-md p-2 text-theme-text-tertiary hover:bg-theme-hover hover:text-theme-text-primary" type="button" onClick={onClose} aria-label="Close command palette">
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div id={listboxId} className="max-h-[28rem] overflow-y-auto p-2" role="listbox">
        {filtered.length === 0 ? (
          <EmptyState compact title="No commands found" description="Try a different search or use the navigation rail." />
        ) : filtered.map((command, index) => (
          <button
            key={command.id}
            id={`${listboxId}-${command.id}`}
            aria-selected={index === activeIndex}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left transition-colors ${index === activeIndex ? 'selection-strong selection-ring' : 'hover:bg-theme-hover'}`}
            type="button"
            role="option"
            tabIndex={-1}
            onMouseEnter={() => setActiveIndex(index)}
            onClick={() => {
              onSelect(command.path)
              onClose()
            }}
          >
            <span>
              <span className="block text-sm font-medium text-theme-text-primary">{command.label}</span>
              <span className="text-xs text-theme-text-secondary">{command.description}</span>
            </span>
            {command.shortcut ? <kbd className="inline-code text-sm font-medium text-theme-text-secondary">{command.shortcut}</kbd> : null}
          </button>
        ))}
      </div>
    </dialog>
  )
}

export function CommandPalette({ open, commands, onClose, onSelect }: CommandPaletteProps) {
  return open ? <CommandPaletteContent commands={commands} onClose={onClose} onSelect={onSelect} /> : null
}

export { matchesCommand }
