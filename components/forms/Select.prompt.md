**Select** — a styled native select matching the Input field, with a brass caret.

```jsx
<Select label="Treatment" options={['Cleaning & prophylaxis','Whitening','Implant consult']} />
<Select label="Location"><option>Charlottenburg</option><option>Mitte</option></Select>
```

Pass `options` (strings or `{value,label}`) or `<option>` children. Shares `label` / `hint` / `error` / `required` with Input.
