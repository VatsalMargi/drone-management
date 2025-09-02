// File: src/app/api/missions/[missionId]/status/route.ts (Corrected)

// FIX 1: Import NextRequest as well as NextResponse
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// FIX 2: Update the function signature to match Next.js's expected types
export async function GET(
  request: NextRequest,
  { params }: { params: { missionId: string } }
) {
  // FIX 3: Access missionId from params directly
  const { missionId } = params;

  const mission = await prisma.mission.findUnique({
    where: { id: missionId },
  });

  if (!mission) {
    return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
  }

  // Simulate flight progress only if in progress
  if (mission.status === 'IN_PROGRESS') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const flightPath = mission.flightPath as any;
    // Handle cases where flight path might not be defined
    if (!flightPath?.geometry?.coordinates[0]) {
      return NextResponse.json({ ...mission, progress: 0, currentPosition: null });
    }
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
      // Ensure droneId exists before updating
      if (completedMission.droneId) {
        await prisma.drone.update({
          where: { id: completedMission.droneId },
          data: { status: 'AVAILABLE' },
        });
      }
      return NextResponse.json({ ...completedMission, progress: 100 });
    }

    const [lon, lat] = waypoints[currentWaypointIndex];
    const currentPosition = { lat, lon };
    
    return NextResponse.json({ ...mission, progress, currentPosition });
  }

  // For other statuses, return the mission data as is
  return NextResponse.json(mission);
}