// File: src/app/missions/new/page.tsx (Corrected)

import prisma from '@/lib/db';
import MissionPlanner from './_components/mission-planner';

// This is now a pure Server Component. Its only job is to fetch data.
export default async function NewMissionPage() {
  // Fetch available drones to assign to the mission
  const availableDrones = await prisma.drone.findMany({
    where: { status: 'AVAILABLE' },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Plan New Mission</h1>
      {/* Pass the server-fetched data as a prop to the Client Component */}
      <MissionPlanner availableDrones={availableDrones} />
    </div>
  );
}