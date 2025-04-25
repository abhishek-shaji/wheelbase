import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Experiment 03 - Crafted.is',
};

import { VehicleForm } from '@/components/partials/vehicle';

export default function Page() {
  return (
    <div className="grid auto-rows-min @2xl:grid-cols-2 *:-ms-px *:-mt-px -m-px">
      <VehicleForm />
    </div>
  );
}
