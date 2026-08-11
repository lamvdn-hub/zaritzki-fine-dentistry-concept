**Dialog** — a centred modal over a warm blurred scrim, for confirmations and short forms (e.g. booking a callback). Closes on Esc, overlay click, or ×.

```jsx
<Dialog open={open} onClose={close} title="Request a callback"
  footer={<><Button variant="ghost" onClick={close}>Cancel</Button><Button onClick={submit}>Send</Button></>}>
  <p>Leave your number and we'll call within one business day.</p>
</Dialog>
```
