'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RiAddLine } from '@remixicon/react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useParams, useRouter } from 'next/navigation';

export function AddCustomerButton() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const { organizationId } = useParams<{ organizationId: string }>();

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="aspect-square max-lg:p-0"
            onClick={() =>
              router.push(`/organization/${organizationId}/customers/new`)
            }
          >
            <RiAddLine
              className="lg:-ms-1 opacity-40 size-5"
              size={20}
              aria-hidden="true"
            />
            <span className="max-lg:sr-only">Add Customer</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="lg:hidden" hidden={isMobile}>
          Add Customer
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
