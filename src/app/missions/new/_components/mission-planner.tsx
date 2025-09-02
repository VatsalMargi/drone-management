// File: src/app/missions/new/_components/mission-planner.tsx

'use client';

import { Drone } from '@prisma/client';
import dynamic from 'next/dynamic';
import MissionForm from './mission-form';

// We need to dynamically import the map to prevent SSR issues with Leaflet
const MissionMap = dynamic(() => import('./mission-map'), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-slate-200 animate-pulse rounded-md flex items-center justify-center"><p>Loading Map...</p></div>,
});

interface MissionPlannerProps {
  availableDrones: Drone[];
}

export default function MissionPlanner({ availableDrones }: MissionPlannerProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <MissionMap />
      </div>
      <div>
        <MissionForm drones={availableDrones} />
      </div>
    </div>
  );
}