// File: src/app/missions/[missionId]/monitor/page.tsx (Corrected)

import MissionMonitor from "@/components/mission-monitor";
import prisma from "@/lib/db";

export default async function MonitorPage({ params }: { params: { missionId: string }}) {
  const mission = await prisma.mission.findUnique({
    where: { id: params.missionId },
    include: { drone: true }
  });

  // FIX: Instead of calling notFound(), we return a JSX element directly.
  // This makes the component's return value predictable for the renderer.
  if (!mission) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold">Mission Not Found</h1>
        <p>The mission you are looking for does not exist.</p>
      </div>
    );
  }

  return <MissionMonitor initialMission={mission} />;
}