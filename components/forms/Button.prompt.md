**Button** — the primary action control; brass fill for the main action, espresso solid or hairline ghost for secondary, link for inline text actions.

```jsx
<Button variant="primary" size="lg">Book a consultation</Button>
<Button variant="ghost" iconLeft={<PhoneIcon/>}>Call the practice</Button>
<Button variant="link">Learn more</Button>
```

Variants: `primary` (brass), `secondary` (espresso), `ghost` (hairline), `link`. Sizes: `sm` / `md` / `lg`. Use one primary per view. Pass `as="a"` with `href` for navigation.
