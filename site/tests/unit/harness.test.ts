import { describe, it, expect } from 'vitest';

describe('test harness', () => {
  it('runs TypeScript in a jsdom environment', () => {
    const el = document.createElement('div');
    el.textContent = 'ok';
    expect(el).toHaveTextContent('ok');
  });
});
