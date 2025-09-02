import MissionMonitor from "@/components/mission-monitor";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export default async function MonitorPage({ params }: { params: { missionId: string }}) {
  const mission = await prisma.mission.findUnique({
    where: { id: params.missionId },
    include: { drone: true }
  });

  if (!mission) {
    notFound();
  }

  return <MissionMonitor initialMission={mission} />;
}