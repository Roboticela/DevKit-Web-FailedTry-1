# Timeline

Chronological event rail. Composes **Icon** and **Empty State**. Reuse this for Security Events, audit logs, and activity feeds — do not fork timeline layout.

## Usage

```tsx
<Timeline aria-label="Account activity">
  <Timeline.Group label="Today">
    <Timeline.Item
      icon={<LockIcon />}
      title="Password changed"
      timestamp="10:42 AM"
      description="Changed from Settings → Security"
      badge={<Badge label="Security" />}
    />
  </Timeline.Group>
</Timeline>
```

## Parts

- `Timeline` — ordered list shell / empty state
- `Timeline.Group` — labeled section for day / category grouping
- `Timeline.Item` — marker + title + timestamp + optional activate handler
