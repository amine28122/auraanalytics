'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function AuraAcademyLogo({ className, iconOnly = false }: { className?: string, iconOnly?: boolean }) {
  const SvgIcon = ({ className }: { className?: string }) => (
    <svg
      width="100"
      height="100"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <g>
        <path
          d="M4 18L9 12L14 18"
          stroke="#7C3AED"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="logo-bottom"
        />
        <path
          d="M10 6L15 12L20 6"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="logo-top"
        />
      </g>
    </svg>
  );

  if (iconOnly) {
    return <SvgIcon className={className} />;
  }

  return (
    <div className={cn('inline-flex flex-col items-center gap-2', className)}>
      <SvgIcon />
      <span className="font-headline text-2xl font-bold text-foreground">
        AURA
      </span>
    </div>
  );
}
