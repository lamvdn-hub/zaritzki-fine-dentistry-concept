import Link from 'next/link';
import type { MouseEventHandler, ReactNode } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'ghost' | 'link';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  iconRight?: ReactNode;
  disabled?: boolean;
  className?: string;
  'aria-disabled'?: boolean;
  'data-testid'?: string;
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  iconRight,
  disabled = false,
  className,
  'aria-disabled': ariaDisabled,
  ...rest
}: Props) {
  const isDisabled = disabled || ariaDisabled === true;
  const classNames = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ');
  const content = (
    <>
      <span>{children}</span>
      {iconRight ? <span className={styles.icon} aria-hidden="true">{iconRight}</span> : null}
    </>
  );

  if (href) {
    const isExternal = /^(https?:|tel:|mailto:)/.test(href);
    const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
      if (isDisabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };
    const anchorProps = {
      className: classNames,
      href,
      onClick: handleClick,
      'aria-disabled': isDisabled || undefined,
      ...rest,
    };

    if (isExternal) {
      return <a {...anchorProps}>{content}</a>;
    }

    return <Link {...anchorProps}>{content}</Link>;
  }

  return (
    <button
      {...rest}
      type="button"
      className={classNames}
      disabled={disabled}
      aria-disabled={ariaDisabled || undefined}
      onClick={onClick as MouseEventHandler<HTMLButtonElement> | undefined}
    >
      {content}
    </button>
  );
}
