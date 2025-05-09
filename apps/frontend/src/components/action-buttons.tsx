'use client';

import React from 'react';

interface ActionButtonsProps {
  children?: React.ReactNode;
}

export function ActionButtons({ children }: ActionButtonsProps) {
  return <div className="flex gap-3">{children}</div>;
}
