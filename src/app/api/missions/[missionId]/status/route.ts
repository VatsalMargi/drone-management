// File: src/app/api/missions/[missionId]/status/route.ts (Final Fix)

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: NextRequest,
  // FIX 1: The type for `context.params` is now correctly defined as a Promise,
  // matching the build error message precisely.
  context: { params: Promise<{ missionId: string }> }
) {
  // FIX 2: We must `await` the promise to get the actual params object before using it.
  const { missionId } = await context.params;

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
    if (!flightPath?.geometry?.coordinates[0]) {
      return NextResponse.json({ ...mission, progress: 0, currentPosition: null });
    }
    const waypoints = flightPath.geometry.coordinates[0];
    const totalWaypoints = waypoints.length;

    const timeElapsed = (Date.now() - new Date(mission.updatedAt).getTime()) / 1000;
    const currentWaypointIndex = Math.min(Math.floor(timeElapsed / 5), totalWaypoints - 1);
    const progress = Math.round((currentWaypointIndex / (totalWaypoints - 1)) * 100);

    if (progress >= 100) {
      const completedMission = await prisma.mission.update({
        where: { id: mission.id },
        data: { status: 'COMPLETED' },
      });
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

  return NextResponse.json(mission);
}