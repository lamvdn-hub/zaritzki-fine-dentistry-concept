**Input / Textarea** — labelled text fields on a cream surface with a hairline border that shifts to brass on focus.

```jsx
<Input label="Full name" placeholder="Jane Doe" required />
<Input label="Email" iconLeft={<MailIcon/>} error="Please enter a valid email" />
<Textarea label="How can we help?" hint="Optional" rows={4} />
```

Both accept `label`, `hint`, `error`, `required`. `Input` also takes `iconLeft` / `iconRight`.
