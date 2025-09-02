// File: src/app/api/missions/[missionId]/status/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// A very simplified simulation
export async function GET(
  request: Request,
  { params }: { params: { missionId: string } }
) {
  const mission = await prisma.mission.findUnique({
    where: { id: params.missionId },
  });

  if (!mission) {
    return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
  }

  // Simulate flight progress only if in progress
  if (mission.status === 'IN_PROGRESS') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const flightPath = mission.flightPath as any;
    const waypoints = flightPath.geometry.coordinates[0];
    const totalWaypoints = waypoints.length;
    
    // Simulate progress based on time (e.g., 1 waypoint every 5 seconds)
    const timeElapsed = (Date.now() - new Date(mission.updatedAt).getTime()) / 1000;
    const currentWaypointIndex = Math.min(Math.floor(timeElapsed / 5), totalWaypoints - 1);
    const progress = Math.round((currentWaypointIndex / (totalWaypoints - 1)) * 100);

    // If progress reaches 100, mark mission as complete
    if (progress >= 100) {
      const completedMission = await prisma.mission.update({
        where: { id: mission.id },
        data: { status: 'COMPLETED' },
      });
      await prisma.drone.update({
        where: { id: mission.droneId! },
        data: { status: 'AVAILABLE' },
      });
      return NextResponse.json({ ...completedMission, progress: 100 });
    }

    const [lon, lat] = waypoints[currentWaypointIndex];
    const currentPosition = { lat, lon };
    
    return NextResponse.json({ ...mission, progress, currentPosition });
  }

  // For other statuses, return the mission data as is
  return NextResponse.json(mission);
}