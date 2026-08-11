**Accordion** — serif-headed disclosure list, ideal for FAQs and treatment detail. The brass "+" rotates to "×" when open.

```jsx
<Accordion defaultOpen={[0]} items={[
  { title: 'Do you accept statutory insurance?', content: <p>Yes — …</p> },
  { title: 'How do I prepare for my first visit?', content: <p>…</p> },
]} />
```

Single-open by default; set `allowMultiple` to keep several open.
