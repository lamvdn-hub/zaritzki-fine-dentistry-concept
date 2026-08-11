**Tabs** — underlined tab navigation with a brass active underline. Pass `items` as `{id,label,content}`.

```jsx
<Tabs items={[
  { id: 'general', label: 'General care', content: <p>…</p> },
  { id: 'implants', label: 'Implantology', content: <p>…</p> },
]} />
```

Uncontrolled via `defaultTab`, or controlled with `value` + `onChange`.
