import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface BreadcrumbItemProps {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface AppHeaderProps {
  breadcrumbItems?: BreadcrumbItemProps[];
  actions?: React.ReactNode;
}

export const AppHeader = ({
  breadcrumbItems = [],
  actions,
}: AppHeaderProps) => {
  return (
    <header className="flex flex-wrap gap-3 min-h-20 py-4 shrink-0 items-center transition-all ease-linear border-b">
      {/* Left side */}
      <div className="flex flex-1 items-center gap-2">
        <SidebarTrigger className="-ms-1" />
        <div className="max-lg:hidden lg:contents">
          <Separator
            orientation="vertical"
            className="me-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <BreadcrumbSeparator className="hidden md:block" />
                  )}
                  <BreadcrumbItem
                    className={index === 0 ? 'hidden md:block' : ''}
                  >
                    {item.isCurrentPage ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={item.href || '#'}>
                        {item.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      {/* Right side */}
      {actions && <div className="flex items-center">{actions}</div>}
    </header>
  );
};
