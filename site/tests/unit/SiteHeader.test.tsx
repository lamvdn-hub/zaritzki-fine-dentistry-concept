import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocationProvider } from '@/lib/LocationProvider';
import { SiteHeader } from '@/components/chrome/SiteHeader';
import headerStyles from '@/components/chrome/SiteHeader.module.css';
import { translator } from '@/lib/i18n';
import en from '@/messages/en.json';

const t = translator(en as Record<string, unknown>);

function setup() {
  return render(
    <LocationProvider>
      <SiteHeader t={t} locale="en" />
    </LocationProvider>,
  );
}

describe('SiteHeader', () => {
  it('carries the practice wordmark as the link home', () => {
    setup();

    expect(screen.getByRole('link', { name: 'Zaritzki Fine Dentistry' })).toHaveAttribute(
      'href',
      '/en',
    );
  });

  it('presents the two practices as a radio group with Mitte selected', () => {
    setup();

    expect(screen.getByRole('radiogroup', { name: /practice/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Mitte' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Charlottenburg' })).not.toBeChecked();
  });

  it('switches the selected practice on click', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole('radio', { name: 'Charlottenburg' }));

    expect(screen.getByRole('radio', { name: 'Charlottenburg' })).toBeChecked();
  });

  it('moves selection and focus right through the practice radio group', async () => {
    const user = userEvent.setup();
    setup();
    const mitte = screen.getByRole('radio', { name: 'Mitte' });
    const charlottenburg = screen.getByRole('radio', { name: 'Charlottenburg' });

    mitte.focus();
    await user.keyboard('{ArrowRight}');

    expect(charlottenburg).toBeChecked();
    expect(charlottenburg).toHaveFocus();
    expect(charlottenburg).toHaveAttribute('tabindex', '0');
    expect(mitte).toHaveAttribute('tabindex', '-1');
  });

  it('cycles selection and focus left through the practice radio group', async () => {
    const user = userEvent.setup();
    setup();
    const mitte = screen.getByRole('radio', { name: 'Mitte' });
    const charlottenburg = screen.getByRole('radio', { name: 'Charlottenburg' });

    mitte.focus();
    await user.keyboard('{ArrowLeft}');

    expect(charlottenburg).toBeChecked();
    expect(charlottenburg).toHaveFocus();
  });

  it('shows the telephone number as a dialable link for returning patients', () => {
    setup();

    expect(screen.getByRole('link', { name: /030 854 030 00/ })).toHaveAttribute(
      'href',
      'tel:+493085403000',
    );
  });

  it('keeps a translated compact dial link for narrow screens', () => {
    setup();
    const desktopPhone = screen.getByText('030 854 030 00').closest('a');
    const compactPhone = screen.getByText('Call the practice').closest('a');

    expect(desktopPhone).toHaveAttribute('href', 'tel:+493085403000');
    expect(compactPhone).toHaveAttribute('href', 'tel:+493085403000');
    expect(desktopPhone).toHaveClass(headerStyles.desktopPhone);
    expect(compactPhone).toHaveClass(headerStyles.compactPhone);
  });

  it('offers exactly one booking action and no competing patient CTA', () => {
    setup();

    expect(screen.getAllByRole('link', { name: /^Book$/ })).toHaveLength(1);
    expect(screen.queryByText(/existing patient/i)).not.toBeInTheDocument();
  });

  it('marks English as the current locale', () => {
    setup();

    expect(screen.getByText('EN')).toHaveAttribute('aria-current', 'true');
    expect(screen.queryByRole('link', { name: 'EN' })).not.toBeInTheDocument();
  });

  it('does not link the German route while its copy is unwritten', () => {
    setup();

    expect(screen.getByText('DE')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'DE' })).not.toBeInTheDocument();
  });
});
