**Card** — the primary surface for grouped content (services, team, editorial). Compose with `CardEyebrow`, `CardTitle`, `CardBody`.

```jsx
<Card interactive>
  <CardEyebrow>Prophylaxis</CardEyebrow>
  <CardTitle>Professional cleaning</CardTitle>
  <CardBody>A thorough, gentle clean tailored to your enamel.</CardBody>
</Card>
<Card variant="inverse">…</Card>
```

Variants: `default` / `flat` / `raised` / `inverse`. Set `padded={false}` for full-bleed image cards; add `interactive` for clickable lift.
